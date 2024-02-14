import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from 'lit/directives/class-map.js';
import type {State} from './../types/types';

@customElement('forest-case')
export class ForestCase extends LitElement {
    @property({type: Number})
    accessor x: number = 0;

    @property({type: Number})
    accessor y: number = 0;

    @property({type: String})
    accessor state: State = 'green';

    override render() {
        return html`
            <div class=${classMap({
                [`state--${this.state}`]: true
            })}></div>
        `;    
    }

    static override styles = css`
        div {
            --state-color: white;

            width: 100%;
            height: 100%;
            background-color: var(--state-color);
            border-radius: 4px;
        }
        .state--green {
            --state-color: green;
        }
        .state--burning {
            --state-color: red;
        }
        .state--burned {
            --state-color: grey;
        }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
      'forest-case': ForestCase;
    }
  }