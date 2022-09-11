import { clickButton, findSelect, selectOption } from "./utils";
import { getStorage } from "../storage";

const state = await getStorage();

const select = findSelect("term");

selectOption(select, state.selectedTerm!);

clickButton("Submit");
