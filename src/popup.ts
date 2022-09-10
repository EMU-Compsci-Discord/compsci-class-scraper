import "./popup.css";
import type { BackgroundMessage } from "./background";
import * as storage from "./storage";

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

storage.subscribe(async (state) => {
  console.log("new state:", state);
  switch (state) {
    case "Waiting for user to start": {
      // TODO: Button

      await chrome.tabs.update(tabId, { url: BANNER_REGISTRATION_URL });
      await waitForTabToLoad();
      storage.update({ step: "Clicking 'Look-up Classes'" });
      break;
    }

    case "Clicking 'Look-up Classes'": {
      await executeScript("clickLookUpClasses");
      await waitForTabToLoad();
      storage.update({ step: "Collecting terms" });
      break;
    }

    case "Collecting terms": {
      await executeScript("collectTerms");
      break;
    }

    case "Waiting for user to select term": {
      const state = await storage.get();
      const terms = (state.terms ?? "").split("\n");

      // TODO: Select

      storage.update({ step: "[1/3] Selecting term", selectedTerm: terms[1] });
      break;
    }

    case "[1/3] Selecting term": {
      await executeScript("selectTerm");
      await waitForTabToLoad();
      storage.update({ step: "[1/3] Clicking 'Advanced Search'" });
      break;
    }

    case "[1/3] Clicking 'Advanced Search'": {
      await executeScript("clickAdvancedSearch");
      await waitForTabToLoad();
      storage.update({ step: "[2/3] Selecting 'Computer Science'" });
      break;
    }

    case "[2/3] Selecting 'Computer Science'": {
      await executeScript("selectComputerScience");
      await waitForTabToLoad();
      storage.update({ step: "[2/3] Collecting classes" });
      break;
    }

    default: {
      throw new Error("Unknown state");
    }
  }
});

storage.set({ step: "Waiting for user to start", tabId });
