import { clickButton, findSelect, selectOption, setInputValue } from "./utils";

const select = findSelect("subj");

selectOption(select, "Mathematics");

setInputValue("crse", "120");

clickButton("Section Search");
