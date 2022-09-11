import { clickButton, findSelect, selectOption, setInputValue } from "./utils";

const select = findSelect("subj");

selectOption(select, "Statistics");

setInputValue("crse", "360");

clickButton("Section Search");
