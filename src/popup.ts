import "./popup-gui";
import type { BackgroundMessage } from "./background";
import { getStorage, nextStep, setStorage, subscribeToStep, updateStorage } from "./storage";
import { $schema, OutputFile, Section } from "./output-file";

const BANNER_REGISTRATION_URL =
  "https://bannerweb.oci.emich.edu/ssomanager/saml/login?relayState=/c/auth/SSB?pkg=twbkwbis.P_GenMenu?name=bmenu.P_RegMnu";

async function getCurrentTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length > 0) {
    return tabs[0];
  } else {
    throw new Error("No active tab found");
  }
}

const tab = await getCurrentTab();

const tabId = tab.id!;

let onTabLoad = () => {
  // do nothing
};
chrome.tabs.onUpdated.addListener((eventTabId, info) => {
  if ((eventTabId === tabId && info.status) === "complete") {
    onTabLoad();
  }
});
function waitForTabToLoad() {
  return new Promise<void>((resolve) => {
    onTabLoad = resolve;
  });
}

function executeScript(script: BackgroundMessage["script"]) {
  const message: BackgroundMessage = { message: "executeScript", script, tabId };
  return chrome.runtime.sendMessage(message);
}

const gui = document.querySelector("popup-gui")!;

subscribeToStep(async (step) => {
  gui.step = step;
  switch (step) {
    case "Waiting for user to start": {
      await gui.waitForStartButton();
      updateStorage({ step: nextStep(step) });
      break;
    }

    case "Navigating to Registration": {
      await chrome.tabs.update(tabId, { url: BANNER_REGISTRATION_URL });
      let loading = true;
      while (loading) {
        await waitForTabToLoad();
        const tab = await getCurrentTab();
        const hostname = new URL(tab.url!).hostname;
        if (hostname === "bannerweb.oci.emich.edu") {
          loading = false;
          updateStorage({ step: nextStep(step) });
        }
      }
      break;
    }

    case "Clicking 'Look-up Classes'": {
      executeScript("clickLookUpClasses");
      await waitForTabToLoad();
      updateStorage({ step: nextStep(step) });
      break;
    }

    case "Collecting terms": {
      executeScript("collectTerms");
      break;
    }

    case "Waiting for user to select term": {
      const state = await getStorage();
      const terms = (state.terms ?? "").split("\n");

      const selectedTerm = await gui.waitForTermSelection(terms);

      updateStorage({ step: nextStep(step), selectedTerm });
      break;
    }

    case "[1/3] Selecting term":
    case "[2/3] Selecting term":
    case "[3/3] Selecting term": {
      executeScript("selectTerm");
      await waitForTabToLoad();
      updateStorage({ step: nextStep(step) });
      break;
    }

    case "[1/3] Clicking 'Advanced Search'":
    case "[2/3] Clicking 'Advanced Search'":
    case "[3/3] Clicking 'Advanced Search'": {
      executeScript("clickAdvancedSearch");
      await waitForTabToLoad();
      updateStorage({ step: nextStep(step) });
      break;
    }

    case "[1/3] Selecting 'Computer Science'": {
      executeScript("selectComputerScience");
      await waitForTabToLoad();
      updateStorage({ step: nextStep(step) });
      break;
    }

    case "[2/3] Selecting 'Mathematics' 120": {
      executeScript("selectMath120");
      await waitForTabToLoad();
      updateStorage({ step: nextStep(step) });
      break;
    }

    case "[3/3] Selecting 'Statistics' 360": {
      executeScript("selectStat360");
      await waitForTabToLoad();
      updateStorage({ step: nextStep(step) });
      break;
    }

    case "[1/3] Collecting classes":
    case "[2/3] Collecting classes":
    case "[3/3] Collecting classes": {
      executeScript("collectClasses");
      break;
    }

    case "[1/3] Clicking 'New Search'":
    case "[2/3] Clicking 'New Search'": {
      executeScript("clickNewSearch");
      await waitForTabToLoad();
      updateStorage({ step: nextStep(step) });
      break;
    }

    case "Done": {
      const state = await getStorage();
      const outputFile: OutputFile = {
        $schema,
        term: state.selectedTerm!,
        timestamp: new Date().getTime(),
        classes: JSON.parse(state.classes ?? "[]") as Section[],
      };

      gui.onSaveFile = async () => {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: outputFile.term.replaceAll(" ", "-"),
          types: [{ accept: { "application/json": [".json"] } }],
        });
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(outputFile, null, 2));
        await writable.close();
      };

      break;
    }

    case "Error": {
      const state = await getStorage();
      console.error(state.error);

      gui.error = state.error;

      break;
    }

    default: {
      throw new Error("Unknown state");
    }
  }
});

setStorage({ step: "Waiting for user to start", tabId });
