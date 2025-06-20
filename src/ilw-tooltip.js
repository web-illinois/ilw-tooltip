import { LitElement, html, css, unsafeCSS } from "lit";
import styles from './ilw-tooltip.styles.css?inline';
import './ilw-tooltip.css';

class Tooltip extends LitElement {
    static get properties() {
        return {
            theme: { type: String, attribute: true },
            arrow: { type: String, attribute: true },
            visible: { type: Boolean, reflect: true }
        };
    }

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
        this.theme = '';
        this.visible = false;
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.hasAttribute('arrow')) {
            this.setAttribute('arrow', 'top-center');
        }
    }

    firstUpdated() {
        const trigger = this.querySelector('[slot="trigger"]');
        const content = this.querySelector('[slot="content"]');

        if (trigger && content) {
            const tooltipId = 'tooltip-content-' + Math.random().toString(36).substring(2, 10);

            // Mirror content to aria-describedby using hidden element in light DOM
            const srText = document.createElement('div');
            srText.id = tooltipId;
            srText.className = 'visually-hidden';
            srText.textContent = content.textContent;
            this.appendChild(srText);

            trigger.setAttribute('aria-describedby', tooltipId);
            if (!trigger.hasAttribute('tabindex')) {
                trigger.setAttribute('tabindex', '0');
            }

            trigger.addEventListener('mouseenter', this._showTooltip.bind(this));
            trigger.addEventListener('mouseleave', this._hideTooltip.bind(this));
            trigger.addEventListener('focus', this._showTooltip.bind(this));
            trigger.addEventListener('blur', this._hideTooltip.bind(this));
        }

        document.addEventListener('keydown', this._onEscape.bind(this));
    }


    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this._onEscape);
    }

    async _showTooltip() {
        this.visible = true;
        await this.updateComplete;
        this._positionTooltip();
    }

    _positionTooltip() {
        const trigger = this.querySelector('[slot="trigger"]');
        const tooltip = this.shadowRoot.querySelector('.tooltip');
        if (!trigger || !tooltip) return;

        const offset = 12;
        const arrow = this.getAttribute('arrow') || 'top-center';

        const triggerRect = trigger.getBoundingClientRect();
        const hostRect = this.getBoundingClientRect();

        let top, left;

        switch (arrow) {
            case 'left':
                top = trigger.offsetTop + (trigger.offsetHeight - tooltip.offsetHeight) / 2;
                left = trigger.offsetLeft - tooltip.offsetWidth - offset;
                break;
            case 'right':
                top = trigger.offsetTop + (trigger.offsetHeight - tooltip.offsetHeight) / 2;
                left = trigger.offsetLeft + trigger.offsetWidth + offset;
                break;
            case 'bottom-center':
                top = trigger.offsetTop + trigger.offsetHeight + offset;
                left = trigger.offsetLeft + (trigger.offsetWidth - tooltip.offsetWidth) / 2;
                break;
            case 'bottom-left':
                top = trigger.offsetTop + trigger.offsetHeight + offset;
                left = trigger.offsetLeft;
                break;
            case 'bottom-right':
                top = trigger.offsetTop + trigger.offsetHeight + offset;
                left = trigger.offsetLeft + trigger.offsetWidth - tooltip.offsetWidth;
                break;
            default: // 'top-center'
                top = trigger.offsetTop - tooltip.offsetHeight - offset;
                left = trigger.offsetLeft + (trigger.offsetWidth - tooltip.offsetWidth) / 2;
        }

        tooltip.style.position = 'absolute';
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    }

    _hideTooltip() {
        this.visible = false;
    }

    _onEscape(e) {
        if (e.key === 'Escape') {
            this.visible = false;
        }
    }

    render() {
        return html`
            <slot name="trigger"></slot>
            <div class="tooltip" id="tooltip-content" role="tooltip">
                <slot name="content"></slot>
            </div>
    `;
    }
}

customElements.define('ilw-tooltip', Tooltip);
