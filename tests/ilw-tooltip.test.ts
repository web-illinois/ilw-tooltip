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
});