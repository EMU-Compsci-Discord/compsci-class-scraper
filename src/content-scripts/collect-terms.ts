import { enumerateOptions, findSelect } from "./utils";
import { updateStorage } from "../storage";

const select = findSelect("term");

const terms = enumerateOptions(select)
  .map((term) => term.replaceAll(/\(.*\)/g, "").trim())
  .filter((term) => term.toLowerCase() != "none")
  .join("\n");

updateStorage({ terms, step: "Waiting for user to select term" });
