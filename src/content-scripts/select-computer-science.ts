import { clickButton, findSelect, selectOption } from "./utils";

const select = findSelect("subj");

selectOption(select, "Computer Science");

clickButton("Section Search");
