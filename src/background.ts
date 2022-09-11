import clickLookUpClasses from "./content-scripts/click-look-up-classes.ts?script";
import collectTerms from "./content-scripts/collect-terms.ts?script";
import selectTerm from "./content-scripts/select-term.ts?script";
import clickAdvancedSearch from "./content-scripts/click-advanced-search.ts?script";
import selectComputerScience from "./content-scripts/select-computer-science.ts?script";
import selectMath120 from "./content-scripts/select-math-120.ts?script";
import selectStat360 from "./content-scripts/select-stat-360.ts?script";
import collectClasses from "./content-scripts/collect-classes.ts?script";
import clickNewSearch from "./content-scripts/click-new-search.ts?script";

const scripts = {
  clickLookUpClasses,
  collectTerms,
  selectTerm,
  clickAdvancedSearch,
  selectComputerScience,
  selectMath120,
  selectStat360,
  collectClasses,
  clickNewSearch,
} as const;

export type BackgroundMessage = {
  message: "executeScript";
  script: keyof typeof scripts;
  tabId: number;
};

chrome.runtime.onMessage.addListener(async ({ message, script, tabId }: BackgroundMessage) => {
  if (message === "executeScript") {
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: [scripts[script]],
    });
  }
});
