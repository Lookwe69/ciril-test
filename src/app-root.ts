import {LitElement, html, TemplateResult, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import { SimulationController } from './controllers/SimulationController';

import './components/forest-case';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('app-root')
export class AppRoot extends LitElement {

  #simulation: SimulationController = new SimulationController(this, 1000);


  override render() {
    return html`
      ${this.renderMap()}
      <div>Etape : ${this.#simulation.step}</div>
      <button
        type="button"
        @click=${() => this.#simulation.restart()}
      >Restart</button>
    `;
  }

  renderMap(): TemplateResult {
    return html`
      <div class="map" style =${styleMap({
        '--grid-columns-nb': this.#simulation.dimension.width,
        '--grid-rows-nb': this.#simulation.dimension.height,
      })}>
      ${this.#simulation.casesMatrice.map(caseRow => html`
        ${caseRow.map(caseObj => html`
          <forest-case
            .x=${caseObj.x}
            .y=${caseObj.y}
            .state=${caseObj.state}
          ></forest-case>
        `)}
      `)}
      </div>
    `;
  }

  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      justify-content: center;
      align-items: center;
    }
    .map {
      --grid-columns-nb: 1;
      --grid-rows-nb: 1;

      display: grid;
      grid-template-columns: repeat(var(--grid-columns-nb), 1fr);
      grid-template-rows: repeat(var(--grid-rows-nb), 1fr);
      gap: 2px;
      width: 500px;
      height: 500px;
      max-width: 100%;
      max-height: 100%;
    }

    button {
      all: unset;
      appearance: none;
      
      display: flex;
      background-color: #dddddd;
      outline: 2px solid transparent;
      outline-offset: 2px;
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 5px;
      transition:
        outline-color .3s,
        background-color .3s;

      &:hover {
        background-color: #eaeaea;
      }

      &:active {
        background-color: #cccccc;
      }

      &:focus-visible {
        outline-color: #00bbff;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}
