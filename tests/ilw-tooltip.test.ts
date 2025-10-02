import { expect, test, describe } from "vitest";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "../src/ilw-tooltip";

describe("ilw-tooltip", () => {
    test("renders tooltip with trigger and content slots", async () => {
        const { container } = await render(
            html`
                <ilw-tooltip>
                    <a href="javascript:void(0);" slot="trigger">Hover over me</a>
                    <span slot="content">Tooltip content</span>
                </ilw-tooltip>
            `
        );

        const tooltip = container.querySelector("ilw-tooltip");
        const trigger = tooltip?.querySelector('[slot="trigger"]');
        const content = tooltip?.querySelector('[slot="content"]');

        expect(trigger).toBeTruthy();
        expect(content).toBeTruthy();
        expect(trigger?.textContent).toBe("Hover over me");
    });

    test("tooltip is hidden by default", async () => {
        const { container } = await render(
            html`
                <ilw-tooltip>
                    <button slot="trigger">Trigger</button>
                    <span slot="content">Content</span>
                </ilw-tooltip>
            `
        );

        const tooltip = container.querySelector("ilw-tooltip");
        expect(tooltip?.visible).toBe(false);
    });

    test("shows tooltip on mouseenter", async () => {
        const { container } = await render(
            html`
                <ilw-tooltip>
                    <button slot="trigger">Trigger</button>
                    <span slot="content">Content</span>
                </ilw-tooltip>
            `
        );

        const tooltip = container.querySelector("ilw-tooltip") as any;
        const trigger = tooltip.querySelector('[slot="trigger"]') as HTMLElement;

        await trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
        await tooltip.updateComplete;

        expect(tooltip.visible).toBe(true);
    });

    test("hides tooltip on mouseleave", async () => {
        const { container } = await render(
            html`
                <ilw-tooltip>
                    <button slot="trigger">Trigger</button>
                    <span slot="content">Content</span>
                </ilw-tooltip>
            `
        );

        const tooltip = container.querySelector("ilw-tooltip") as any;
        const trigger = tooltip.querySelector('[slot="trigger"]') as HTMLElement;

        // Show tooltip first
        await trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
        await tooltip.updateComplete;
        expect(tooltip.visible).toBe(true);

        // Then hide it
        await trigger.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
        await tooltip.updateComplete;

        // Wait for requestAnimationFrame
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(tooltip.visible).toBe(false);
    });
});