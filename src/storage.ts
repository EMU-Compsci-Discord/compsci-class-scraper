export const steps = [
  "Waiting for user to start",
  "Clicking 'Look-up Classes'",
  "Collecting terms",
  "Waiting for user to select term",
  "[1/3] Selecting term",
  "[1/3] Clicking 'Advanced Search'",
  "[1/3] Selecting 'Computer Science'",
  "[1/3] Collecting classes",
  "[1/3] Clicking 'New Search'",
  "[2/3] Selecting term",
  "[2/3] Clicking 'Advanced Search'",
  "[2/3] Selecting 'Mathematics' 120",
  "[2/3] Collecting classes",
  "[2/3] Clicking 'New Search'",
  "[3/3] Selecting term",
  "[3/3] Clicking 'Advanced Search'",
  "[3/3] Selecting 'Statistics' 360",
  "[3/3] Collecting classes",
  "Done",
  "Error",
] as const;

export type Step = (typeof steps)[number];

export interface StorageState {
  step: Step;
  tabId: number;
  terms?: string;
  selectedTerm?: string;
  classes?: string;
  error?: string;
}

export async function setStorage(state: StorageState) {
  await chrome.storage.local.clear();
  return await chrome.storage.local.set(state);
}

export function updateStorage(state: Partial<StorageState>) {
  return chrome.storage.local.set(state);
}

export function getStorage() {
  return chrome.storage.local.get() as Promise<StorageState>;
}

export function subscribeToStep(callback: (state: Step) => void): () => void {
  const listener = async (
    changes: {
      [key in keyof StorageState]: { newValue?: StorageState[key] };
    },
    areaName: "sync" | "local" | "managed" | "session"
  ) => {
    if (areaName === "local" && changes.step?.newValue !== undefined) {
      callback(changes.step?.newValue);
    }
  };
  chrome.storage.onChanged.addListener(listener as any);
  return () => {
    chrome.storage.onChanged.removeListener(listener as any);
  };
}

export function nextStep(step: Step): Step {
  const index = steps.indexOf(step);
  if (index === -1) {
    throw new Error("Unknown step");
  }
  return steps[index + 1];
}
