import "./popup.css";
import type { BackgroundMessage } from "./background";
import { getStorage, nextStep, setStorage, subscribeToStep, updateStorage } from "./storage";
import { $schema, OutputFile, Section } from "./output-file";

const BANNER_REGISTRATION_URL =
  "https://bannerweb.emich.edu/ssomanager/c/SSB?pkg=twbkwbis.P_GenMenu?name=bmenu.P_RegMnu";

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

subscribeToStep(async (step) => {
  console.log("new step:", step);
  switch (step) {
    case "Waiting for user to start": {
      // TODO: Button

      await chrome.tabs.update(tabId, { url: BANNER_REGISTRATION_URL });
      await waitForTabToLoad();
      updateStorage({ step: nextStep(step) });
      break;
    }

    case "Clicking 'Look-up Classes'": {
      await executeScript("clickLookUpClasses");
      await waitForTabToLoad();
      updateStorage({ step: nextStep(step) });
      break;
    }

    case "Collecting terms": {
      await executeScript("collectTerms");
      break;
    }

    case "Waiting for user to select term": {
      const state = await getStorage();
      const terms = (state.terms ?? "").split("\n");

      // TODO: Select

      updateStorage({ step: nextStep(step), selectedTerm: terms[1] });
      break;
    }

    case "[1/3] Selecting term":
    case "[2/3] Selecting term":
    case "[3/3] Selecting term": {
      await executeScript("selectTerm");
      await waitForTabToLoad();
      updateStorage({ step: nextStep(step) });
      break;
    }

    case "[1/3] Clicking 'Advanced Search'":
    case "[2/3] Clicking 'Advanced Search'":
    case "[3/3] Clicking 'Advanced Search'": {
      await executeScript("clickAdvancedSearch");
      await waitForTabToLoad();
      updateStorage({ step: nextStep(step) });
      break;
    }

    case "[1/3] Selecting 'Computer Science'": {
      await executeScript("selectComputerScience");
      await waitForTabToLoad();
      updateStorage({ step: nextStep(step) });
      break;
    }

    case "[2/3] Selecting 'Mathematics' 120": {
      await executeScript("selectMath120");
      await waitForTabToLoad();
      updateStorage({ step: nextStep(step) });
      break;
    }

    case "[3/3] Selecting 'Statistics' 360": {
      await executeScript("selectStat360");
      await waitForTabToLoad();
      updateStorage({ step: nextStep(step) });
      break;
    }

    case "[1/3] Collecting classes":
    case "[2/3] Collecting classes":
    case "[3/3] Collecting classes": {
      await executeScript("collectClasses");
      break;
    }

    case "[1/3] Clicking 'New Search'":
    case "[2/3] Clicking 'New Search'": {
      await executeScript("clickNewSearch");
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
      console.log(outputFile);

      // TODO: Save to file

      break;
    }

    case "Error": {
      const state = await getStorage();
      console.error(state.error);

      // TODO: display error message

      break;
    }

    default: {
      throw new Error("Unknown state");
    }
  }
});

setStorage({ step: "Waiting for user to start", tabId });
