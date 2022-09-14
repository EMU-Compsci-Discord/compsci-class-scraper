import "./popup.css";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Step } from "./storage";

@customElement("popup-gui")
export class PopupGuiElement extends LitElement {
  @property()
  step: Step | "Loading" = "Loading";

  @property()
  error: string | undefined;

  @state()
  startButtonResolver: (() => void) | undefined;
  waitForStartButton() {
    return new Promise<void>((resolve) => {
      this.startButtonResolver = resolve;
    });
  }
  handelStartButtonClick() {
    this.startButtonResolver?.();
    this.startButtonResolver = undefined;
  }

  @state()
  terms: string[] = [];
  @state()
  term = "";
  handleTermSelectInput(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.term = target.value;
  }

  @state()
  termSelectionResolver: ((term: string) => void) | undefined;
  waitForTermSelection(terms: string[]) {
    this.terms = terms;
    this.term = terms[0];
    return new Promise<string>((resolve) => {
      this.termSelectionResolver = resolve;
    });
  }
  handleNextButtonClick() {
    this.termSelectionResolver?.(this.term);
    this.termSelectionResolver = undefined;
  }

  @property()
  onSaveFile: (() => void) | undefined;

  render() {
    const showSpinner =
      this.step !== "Waiting for user to start" &&
      this.step !== "Waiting for user to select term" &&
      this.step !== "Done" &&
      this.step !== "Error";
    return html`<h1>Compsci Class Scraper</h1>
      <p class="status">Status: ${this.step}</p>
      <div class="content">
        ${this.termSelectionResolver != undefined
          ? html`<select @change="${this.handleTermSelectInput}">
              ${this.terms.map((term) => html`<option value="${term}">${term}</option>`)}
            </select>`
          : undefined}
        ${this.error != undefined ? html`<p class="error">${this.error}</p>` : undefined}
        ${showSpinner ? html`<div class="spinner"></div>` : undefined}
      </div>
      <div class="buttons">
        ${this.startButtonResolver != undefined
          ? html`<button @click="${this.handelStartButtonClick}">Start</button>`
          : undefined}
        ${this.termSelectionResolver != undefined
          ? html`<button @click="${this.handleNextButtonClick}">Next</button>`
          : undefined}
        ${this.step === "Done" && this.onSaveFile != undefined
          ? html`<button @click="${this.onSaveFile}">Save File</button>`
          : undefined}
      </div>`;
  }

  // disable shadow DOM
  createRenderRoot() {
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "popup-gui": PopupGuiElement;
  }
}
