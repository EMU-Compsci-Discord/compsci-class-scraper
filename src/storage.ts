export const steps = [
  "Waiting for user to start",
  "Clicking 'Look-up Classes'",
  "Collecting terms",
  "Waiting for user to select term",
  "[1/3] Selecting term",
  "[1/3] Clicking 'Advanced Search'",
  "[1/3] Selecting 'Computer Science'",
  "[1/3] Collecting classes",
  "[2/3] Selecting term",
  "[2/3] Clicking 'Advanced Search'",
  "[2/3] Selecting 'Computer Science'",
  "[2/3] Collecting classes",
  "[3/3] Selecting term",
  "[3/3] Clicking 'Advanced Search'",
  "[3/3] Selecting 'Computer Science'",
  "[3/3] Collecting classes",
  "Done",
  "Error",
] as const;

export type Step = typeof steps[number];

export interface StorageState {
  step: Step;
  tabId: number;
  terms?: string;
  selectedTerm?: string;
  classes?: string;
  error?: string;
}

export async function set(state: StorageState) {
  await chrome.storage.local.clear();
  return await chrome.storage.local.set(state);
}

export function update(state: Partial<StorageState>) {
  return chrome.storage.local.set(state);
}

export function get() {
  return chrome.storage.local.get() as Promise<StorageState>;
}

export function subscribe(callback: (state: Step) => void): () => void {
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
