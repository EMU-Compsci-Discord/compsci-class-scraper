import { findTableByCaption } from "./utils";
import { nextStep, updateStorage, getStorage } from "../storage";
import { Section } from "../output-file";

const table = findTableByCaption("Sections Found");

const rows = [...table.querySelectorAll("tr")];

let columnIndexes: { [key in keyof Section]: number } | undefined;

while (columnIndexes === undefined) {
  const row = rows.shift() as HTMLTableRowElement;

  const headers = row.querySelectorAll("th");

  if (headers.length === 1) {
    continue;
  }

  columnIndexes = {
    subject: -1,
    course: -1,
    days: -1,
    time: -1,
    instructor: -1,
  };

  for (const header of headers) {
    const text = header.textContent?.toLowerCase() ?? "";

    if (text.includes("subj")) {
      columnIndexes.subject = header.cellIndex;
    } else if (text.includes("crse")) {
      columnIndexes.course = header.cellIndex;
    } else if (text.includes("days")) {
      columnIndexes.days = header.cellIndex;
    } else if (text.includes("time")) {
      columnIndexes.time = header.cellIndex;
    } else if (text.includes("instructor")) {
      columnIndexes.instructor = header.cellIndex;
    }
  }
}

const currentState = await getStorage();

const classes = JSON.parse(currentState.classes ?? "[]") as Section[];

for (const row of rows) {
  const cells = row.querySelectorAll("td");

  const classInfo: Partial<Section> = {};

  for (const [key, index] of Object.entries(columnIndexes)) {
    const cell = cells[index];
    classInfo[key as keyof Section] = cell.textContent?.replaceAll(/\s+/g, " ").trim() ?? "";
  }

  if (classInfo.subject === "" || classInfo.course === "") {
    continue;
  }

  classes.push(classInfo as Section);
}

updateStorage({ classes: JSON.stringify(classes), step: nextStep(currentState.step) });
