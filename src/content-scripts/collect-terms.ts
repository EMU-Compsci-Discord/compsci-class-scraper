import { enumerateOptions, findSelect } from "./utils";
import { update as updateStorage } from "../storage";

const select = findSelect("term");

const terms = enumerateOptions(select)
  .map((term) => term.replaceAll(/\(.*\)/g, "").trim())
  .join("\n");

updateStorage({ terms, step: "Waiting for user to select term" });
