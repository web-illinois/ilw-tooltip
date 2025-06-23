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
            // Create accessible label
            const tooltipId = 'tooltip-content-' + Math.random().toString(36).substring(2, 10);
            const srText = document.createElement('div');
            srText.id = tooltipId;
            srText.className = 'visually-hidden';
            srText.textContent = content.textContent;
            this.appendChild(srText);

            trigger.setAttribute('aria-describedby', tooltipId);
            trigger.setAttribute('tabindex', trigger.getAttribute('tabindex') || '0');

            trigger.addEventListener('mouseenter', this._showTooltip.bind(this));
            trigger.addEventListener('mouseleave', this._hideTooltip.bind(this));
            trigger.addEventListener('focus', this._showTooltip.bind(this));
            trigger.addEventListener('blur', this._hideTooltip.bind(this));
            trigger.addEventListener('click', this._toggleTooltip.bind(this));//for mobile devices
        }

        document.addEventListener('keydown', this._onEscape.bind(this));
        document.addEventListener('pointerdown', this._onDocumentClick.bind(this));
    }

    _onDocumentClick(e) {
        const trigger = this.querySelector('[slot="trigger"]');
        const tooltip = this.shadowRoot.querySelector('.tooltip');

        if (this.visible && trigger && tooltip) {
            const clickedInsideTrigger = trigger.contains(e.target);
            const clickedInsideTooltip = tooltip.contains(e.target);

            if (!clickedInsideTrigger && !clickedInsideTooltip) {
                this._hideTooltip();
            }
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this._onEscape);
        document.removeEventListener('pointerdown', this._onDocumentClick);
    }

    async _showTooltip() {
        this.visible = true;
        await this.updateComplete;
        this._positionTooltip();
    }

    _hideTooltip() {
        this.visible = false;
    }

    _onEscape(e) {
        if (e.key === 'Escape') {
            this._hideTooltip();
        }
    }

    _toggleTooltip(e) {
        this.visible ? this._hideTooltip() : this._showTooltip();
    }

    _positionTooltip() {
        const trigger = this.querySelector('[slot="trigger"]');
        const tooltip = this.shadowRoot.querySelector('.tooltip');
        if (!trigger || !tooltip) return;

        const offset = 12;
        const arrow = this.getAttribute('arrow');
        let top = 0, left = 0;

        const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = trigger;
        const tooltipRect = tooltip.getBoundingClientRect();

        switch (arrow) {
            case 'top-left':
                top = offsetTop - tooltipRect.height - offset;
                left = offsetLeft;
                break;
            case 'top-right':
                top = offsetTop - tooltipRect.height - offset;
                left = offsetLeft + offsetWidth - tooltipRect.width;
                break;
            case 'top-center':
                top = offsetTop - tooltipRect.height - offset;
                left = offsetLeft + (offsetWidth - tooltipRect.width) / 2;
                break;
            case 'bottom-left':
                top = offsetTop + offsetHeight + offset;
                left = offsetLeft;
                break;
            case 'bottom-right':
                top = offsetTop + offsetHeight + offset;
                left = offsetLeft + offsetWidth - tooltipRect.width;
                break;
            case 'bottom-center':
                top = offsetTop + offsetHeight + offset;
                left = offsetLeft + (offsetWidth - tooltipRect.width) / 2;
                break;
            case 'left':
                top = offsetTop + (offsetHeight - tooltipRect.height) / 2;
                left = offsetLeft - tooltipRect.width - offset;
                break;
            case 'right':
                top = offsetTop + (offsetHeight - tooltipRect.height) / 2;
                left = offsetLeft + offsetWidth + offset;
                break;
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    }

    render() {
        return html`
            <slot name="trigger"></slot>
            <div class="tooltip" role="tooltip">
                <slot name="content"></slot>
            </div>
        `;
    }
}

customElements.define('ilw-tooltip', Tooltip);
