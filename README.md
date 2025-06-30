# ilw-tooltip

Links: **[ilw-tooltip in Builder](https://builder3.toolkit.illinois.edu/component/ilw-tooltip/index.html)** | 
[Illinois Web Theme](https://webtheme.illinois.edu/) | 
[Toolkit Development](https://github.com/web-illinois/toolkit-management)

## Overview

The Illinois theme component ilw-tooltip is a popup that provides additional information about a user interface element, such as a button or link, when the mouse hovers over it.
Tooltips are typically used to provide context or explanations for elements that may not be immediately clear to users.

The default color background color is white, there is also a blue option for the background.

The default position for the arrow is top center by default, but can be changed.

There is a slot for the tooltip trigger and a slot for the tooltip content.

### Attributes
* theme: Default is white background. Other theme available is ```blue```.

* arrow: The position of the arrow. Default is top center.

## Code Example

```html
<ilw-tooltip>
    <a href="javascript:void(0);" slot="trigger">Hover over me</a>
    <div slot="content">
        This is a simple tooltip example.
    </div>
</ilw-tooltip>

 <ilw-tooltip arrow="bottom-center">
    <a href="javascript:void(0);" slot="trigger">Hover over me</a>
    <div slot="content">
        <strong>Text can be bold.</strong><br>This is a tooltip example.
    </div>
</ilw-tooltip>

<ilw-tooltip theme="blue" arrow="bottom-left">
    <a href="#" slot="trigger" role="button">Hover over me</a>
    <div slot="content">
        Buttons can be used to trigger the tooltip.
    </div>
</ilw-tooltip>
```
## Code Example with Icon Button

```html
<ilw-tooltip theme="blue" arrow="bottom-left">
    <button slot="trigger" role="button">
        <ilw-icon size="50px" icon="admissions" alt="Admissions"></ilw-icon></button>
    <div slot="content">
        Admissions
    </div>
</ilw-tooltip>
    
```
## Accessibility Notes and Use

When placing tooltips, ensure that they do not obscure important content or navigation elements. Tooltips should be used to enhance the user experience by providing additional context without overwhelming the user.
The arrow position can be adjusted to ensure that the tooltip does not cover the element it is describing or get cut off by the edge of the viewport. Be sure to test on mobile.

## External References
- [WCAG Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
- [APG Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
