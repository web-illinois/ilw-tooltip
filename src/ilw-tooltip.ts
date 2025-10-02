import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
// @ts-ignore
import styles from './ilw-tooltip.styles.css?inline';

type ArrowPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'left'
    | 'right';

@customElement('ilw-tooltip')
export default class Tooltip extends LitElement {
    @property({ type: String, attribute: true })
    theme = '';

    @property({ type: String, reflect: true })
    arrow: ArrowPosition = 'top-center';

    @property({ type: Boolean, reflect: true })
    visible = false;

    @query('.tooltip')
    private tooltipElement?: HTMLElement;

    private _longPressTimer: ReturnType<typeof setTimeout> | null = null;
    private _touchMoved = false;
    private _ignoreNextPointerDown = false;
    private _tooltipId: string;

    static override styles = unsafeCSS(styles);

    constructor() {
        super();
        this._tooltipId = 'tooltip-' + Math.random().toString(36).substring(2, 10);
    }

    override firstUpdated(): void {
        const trigger = this.querySelector('[slot="trigger"]') as HTMLElement;
        const content = this.querySelector('[slot="content"]') as HTMLElement;

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

            // Mobile touch events
            trigger.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });
            trigger.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
            trigger.addEventListener('touchend', this._onTouchEnd.bind(this), { passive: false });
            trigger.addEventListener('touchcancel', this._onTouchCancel.bind(this), { passive: false });
        }

        document.addEventListener('keydown', this._onEscape.bind(this));
        document.addEventListener('pointerdown', this._onDocumentClick.bind(this));
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this._onEscape.bind(this));
        document.removeEventListener('pointerdown', this._onDocumentClick.bind(this));
    }

    private _onDocumentClick(e: PointerEvent): void {
        const trigger = this.querySelector('[slot="trigger"]') as HTMLElement;
        const tooltip = this.tooltipElement;

        // Avoid closing if we intentionally opened it
        if (this._ignoreNextPointerDown) {
            this._ignoreNextPointerDown = false;
            return;
        }

        const clickedInsideTrigger = trigger && trigger.contains(e.target as Node);
        const clickedInsideTooltip = tooltip && tooltip.contains(e.target as Node);

        if (!clickedInsideTrigger && !clickedInsideTooltip) {
            this._hideTooltip();

            // Manually blur trigger on mobile if still focused
            if (document.activeElement === trigger) {
                trigger.blur();
            }
        }
    }

    private async _showTooltip(): Promise<void> {
        this.visible = true;
        this._ignoreNextPointerDown = true;
        await this.updateComplete;
        this._positionTooltip();
    }

    private _hideTooltip(): void {
        if (this.visible) {
            this.visible = false;
            this._ignoreNextPointerDown = false;
        }
    }

    private _onEscape(e: KeyboardEvent): void {
        if (e.key === 'Escape') {
            this._hideTooltip();
        }
    }

    private _onTouchStart(e: TouchEvent): void {
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

    private _onTouchMove(e: TouchEvent): void {
        this._touchMoved = true;
        if (this._longPressTimer) {
            clearTimeout(this._longPressTimer);
            this._longPressTimer = null;
        }
    }

    private _onTouchEnd(e: TouchEvent): void {
        if (this._longPressTimer) {
            clearTimeout(this._longPressTimer);
            this._longPressTimer = null;
        }
    }

    private _onTouchCancel(e: TouchEvent): void {
        if (this._longPressTimer) {
            clearTimeout(this._longPressTimer);
            this._longPressTimer = null;
        }
    }

    private _maybeHideTooltip(): void {
        // Delay to allow blur/focus transitions (e.g., tabbing)
        requestAnimationFrame(() => {
            const trigger = this.querySelector('[slot="trigger"]') as HTMLElement;

            const isHovered = trigger?.matches(':hover');
            const isFocused = document.activeElement === trigger;

            if (!isHovered && !isFocused) {
                this._hideTooltip();
            }
        });
    }

    private _positionTooltip(): void {
        const trigger = this.querySelector('[slot="trigger"]') as HTMLElement;
        const tooltip = this.tooltipElement;
        if (!trigger || !tooltip) return;

        const offset = 12;
        const arrow = this.getAttribute('arrow') as ArrowPosition;
        let top = 0;
        let left = 0;

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

    override render() {
        return html`
      <slot name="trigger"></slot>
      <div class="tooltip" role="tooltip" aria-hidden=${!this.visible}>
        <slot name="content"></slot>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'ilw-tooltip': Tooltip;
    }
}