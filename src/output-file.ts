export interface Section {
  /** @example "COSC", "STAT", "MATH" */
  subject: string;

  /** @example "111", "211", "341W", "388L4" */
  course: string;

  /** @example "MW", "TR", "T" */
  days: string;

  /** @example "09:00 am-10:50 am", "11:00 am-12:50 pm" */
  time: string;

  /** @example "Suchindran Maniccam (P)", "Philip Lynn Francis III (P)" */
  instructor: string;
}

export const $schema =
  "https://raw.githubusercontent.com/EMU-Compsci-Discord/compsci-class-scraper/main/json-schema/output-v1.schema.json";

export interface OutputFile {
  $schema: typeof $schema;

  /** @example "Fall 2022", "Summer 2017", "Winter 2020-COVID Term Impact" */
  term: string;

  /** milliseconds since 1970 */
  timestamp: number;

  classes: Section[];
}
