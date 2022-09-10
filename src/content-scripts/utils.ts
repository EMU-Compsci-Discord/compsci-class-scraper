export function clickLink(text: string) {
  for (const a of document.querySelectorAll("a")) {
    if (a.innerText.includes(text)) {
      a.click();
    }
  }
}

export function clickButton(text: string) {
  for (const input of document.querySelectorAll("input")) {
    if (input.value.includes(text)) {
      input.click();
    }
  }
}

export function findSelect(name: string): HTMLSelectElement {
  for (const select of document.querySelectorAll("select")) {
    if (select.name.includes(name)) {
      return select;
    }
  }
  throw new Error(`Could not find select with name ${name}`);
}

export function enumerateOptions(element: HTMLSelectElement): string[] {
  const options: string[] = [];
  for (const option of element.options) {
    options.push(option.innerText);
  }
  return options;
}

export function selectOption(element: HTMLSelectElement, text: string) {
  for (const option of element.options) {
    if (option.innerText.includes(text)) {
      option.selected = true;
      return;
    }
  }
  throw new Error(`Could not find option with text ${text}`);
}
