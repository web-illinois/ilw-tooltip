import { LitElement, html, css, unsafeCSS } from "lit";
import styles from './ilw-tooltip.styles.css?inline';
import './ilw-tooltip.css';

class Tooltip extends LitElement {
    static get properties() {
        return {
            theme: { type: String, attribute: true },
            arrow: { type: String, reflect: true },
            visible: { type: Boolean, reflect: true },
        };
    }

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
        this.theme = '';
        this.visible = false;
        this.arrow = 'top-center'; // Default arrow position
        this._longPressTimer = null;
        this._touchMoved = false;
        this._ignoreNextPointerDown = false;

        this._tooltipId = 'tooltip-' + Math.random().toString(36).substring(2, 10);
    }

    firstUpdated() {
        const trigger = this.querySelector('[slot="trigger"]');
        const content = this.querySelector('[slot="content"]');

        if (trigger && content) {
            if (!content.id) {
                content.id = this._tooltipId;
            }

            if (!trigger.hasAttribute('aria-describedby')) {
                trigger.setAttribute('aria-describedby', content.id);
            }

            trigger.setAttribute('tabindex', trigger.getAttribute('tabindex') || '0');

            // Mouse and keyboard triggers
            trigger.addEventListener('mouseenter', this._showTooltip.bind(this));
            trigger.addEventListener('mouseleave', this._maybeHideTooltip.bind(this));
            trigger.addEventListener('focus', this._showTooltip.bind(this));
            trigger.addEventListener('blur', this._maybeHideTooltip.bind(this));
            //mobile touch events
            trigger.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });
            trigger.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
            trigger.addEventListener('touchend', this._onTouchEnd.bind(this), { passive: false });
            trigger.addEventListener('touchcancel', this._onTouchCancel.bind(this), { passive: false });
        }

        document.addEventListener('keydown', this._onEscape.bind(this));
        document.addEventListener('pointerdown', this._onDocumentClick.bind(this));//handle clicks outside the tooltip on mobile
    }

    _onDocumentClick(e) {
        const trigger = this.querySelector('[slot="trigger"]');
        const tooltip = this.shadowRoot.querySelector('.tooltip');

        // Avoid closing if we intentionally opened it
        if (this._ignoreNextPointerDown) {
            this._ignoreNextPointerDown = false;
            return;
        }

        const clickedInsideTrigger = trigger && trigger.contains(e.target);
        const clickedInsideTooltip = tooltip && tooltip.contains(e.target);

        if (!clickedInsideTrigger && !clickedInsideTooltip) {
            this._hideTooltip();

            // Manually blur trigger on mobile if still focused
            if (document.activeElement === trigger) {
                trigger.blur();
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
        this._ignoreNextPointerDown = true;
        await this.updateComplete;
        this._positionTooltip();
    }

    _hideTooltip() {
        if (this.visible) {
            this.visible = false;
            this._ignoreNextPointerDown = false;
        }
    }


    _onEscape(e) {
        if (e.key === 'Escape') {
            this._hideTooltip();
        }
    }

    _onTouchStart(e) {
        this._touchMoved = false;

        // Always clear previous timer
        if (this._longPressTimer) {
            clearTimeout(this._longPressTimer);
            this._longPressTimer = null;
        }

        this._longPressTimer = setTimeout(() => {
            this._showTooltip();

            // Prevents tap propagation that would immediately hide tooltip
            e.preventDefault();
            e.stopPropagation();
        }, 500); // long-press threshold
    }


    _onTouchMove(e) {
        this._touchMoved = true;
        if (this._longPressTimer) {
            clearTimeout(this._longPressTimer);
            this._longPressTimer = null;
        }
    }

    _onTouchEnd(e) {
        if (this._longPressTimer) {
            clearTimeout(this._longPressTimer);
            this._longPressTimer = null;
        }
    }

    _onTouchCancel(e) {
        if (this._longPressTimer) {
            clearTimeout(this._longPressTimer);
            this._longPressTimer = null;
        }
    }


    _maybeHideTooltip() {
        // Delay to allow blur/focus transitions (e.g., tabbing)
        requestAnimationFrame(() => {
            const trigger = this.querySelector('[slot="trigger"]');

            const isHovered = trigger.matches(':hover');
            const isFocused = document.activeElement === trigger;

            if (!isHovered && !isFocused) {
                this._hideTooltip();
            }
        });
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
            <div class="tooltip" role="tooltip" aria-hidden=${!this.visible}>
                <slot name="content"></slot>
            </div>
        `;
    }
}

customElements.define('ilw-tooltip', Tooltip);
