# ilw-tooltip

Links: **[ilw-tooltip in Builder](https://builder3.toolkit.illinois.edu/component/ilw-tooltip/index.html)** | 
[Illinois Web Theme](https://webtheme.illinois.edu/) | 
[Toolkit Development](https://github.com/web-illinois/toolkit-management)

## Overview

The Illinois theme component ilw-tooltip is a popup that provides additional information about a user interface element, such as a button or link, when the mouse hovers over it.
Tooltips are typically used to provide context or explanations for elements that may not be immediately clear to users. They can also be used to display additional information without cluttering the interface.

The default color background color is white, there is also a blue option for the background.

The default position for the arrow is top center by default, but can be changed.

There is a slot for the tooltip trigger and a slot for the tooltip content.

### Attributes
* id: The id of the tooltip is required. This is used to trigger the tooltip from a button or link. The default is `tooltip`. The ID must be unique on the page.

* theme: Default is white background. Other theme available is ```blue```.

* arrow: The position of the arrow. Default is bottom left.

## Code Example for Button or Link Triggering the Tooltip

```html
<button class="ilw-button" aria-labelledby="tooltip">Hover over me</button>
<a href="javascript:void(0)" data-tooltip-target="tooltip">Hover over me</a>
```
## Code Example for Tooltip

```html
<ilw-tooltip>
    <button class="ilw-button" slot="trigger" role="button">Hover over me</button>
    <div slot="content">
        Address Information
    </div>
</ilw-tooltip>

<ilw-tooltip theme="blue" arrow="bottom-left">
    <a href="#" slot="trigger" role="button">Hover over me</a>
    <div slot="content">
        Address Information
    </div>
</ilw-tooltip>

<ilw-tooltip theme="blue" arrow="bottom-left">
    <button slot="trigger" role="button">
        <ilw-icon size="50px" icon="admissions" alt="Admissions"></ilw-icon></button>
    <div slot="content">
        Admissions
    </div>
</ilw-tooltip>
<ilw-tooltip theme="blue" arrow="bottom-center">
    <button slot="trigger" role="button">
        <ilw-icon icon="home" size="50px" alt="Home"></ilw-icon></button>
    <div slot="content">
        Home
    </div>
</ilw-tooltip>
<ilw-tooltip theme="blue" arrow="bottom-right">
    <button slot="trigger" role="button">
        <ilw-icon icon="apply-now" size="50px" alt="Apply Now"></ilw-icon></button>
    <div slot="content">
        Apply Now
    </div>
</ilw-tooltip>
<ilw-tooltip>
<a href="javascript:void(0);" slot="trigger">Hover over me</a>
<div slot="content">
    <strong>Tooltip content goes here.</strong><br>This is a simple tooltip example.
</div>
</ilw-tooltip>
    
    <ilw-tooltip id="tooltip" theme="blue" arrow="bottom-left">
        <h3 slot="title">Tooltip Title</h3>
        <p>This is additional information that appears when you hover over the button.</p>
    </ilw-tooltip>
    
```

## External References
- [WCAG Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
- [APG Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
