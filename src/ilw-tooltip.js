import { LitElement, html, unsafeCSS } from "lit";
import styles from './ilw-tooltip.styles.css?inline';
import './ilw-tooltip.css';

class Tooltip extends LitElement {

    static get properties() {
        return {
            theme: { type: String, attribute: true }
        };
    }

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
        this.theme = '';
    }

    render() {
        return html`
            <div>
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('ilw-tooltip', Tooltip);