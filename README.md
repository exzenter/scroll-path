# Scroll Path Nav

A WordPress Gutenberg block that auto-detects headings on a page and creates an animated SVG scroll path navigation.

## Features

- **Automatic Heading Detection**: Automatically finds all headings on the page and creates a navigation structure
- **Configurable Heading Levels**: Choose which heading levels (H1-H6) to include in the navigation
- **Custom Selectors**: Add custom CSS selectors (classes or IDs) to include additional elements in the navigation
- **Animated SVG Path**: Beautiful animated path that highlights the current section as you scroll
- **Hierarchical Structure**: Maintains proper nesting based on heading levels
- **Smooth Scroll Navigation**: Click any item to smoothly scroll to that section

## Installation

1. Upload the `scrolpath` folder to your `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Add the "Scroll Path Nav" block to any page or post

## Usage

### Basic Usage

Simply add the **Scroll Path Nav** block to your page. By default, it will detect all H2, H3, and H4 headings.

### Configuring Heading Levels

In the block settings sidebar, you can toggle which heading levels to include:

- **H1** - Off by default
- **H2** - On by default
- **H3** - On by default
- **H4** - On by default
- **H5** - Off by default
- **H6** - Off by default

You can also enable **"Use title attribute as label"** to use shorter custom labels. When enabled, if a heading has a `title` attribute, that text will be used in the navigation instead of the full heading text:

```html
<h2 title="Short Label">This Is A Very Long Heading Title</h2>
```

You can also enable **"Use data-scrollpath-label attribute"** for even more explicit control:

```html
<h2 data-scrollpath-label="Custom Nav Label">This Is A Very Long Heading Title</h2>
```

When both are enabled, `data-scrollpath-label` takes priority over `title`.

### Custom Selectors

You can also include elements that aren't headings by adding custom CSS selectors:

```
.my-section, #intro, .custom-heading
```

This will include any elements matching those selectors in the navigation.

### Path Styling

Customize the appearance of the scroll indicator path:

- **Path Color** - Choose any color for the indicator path (default: #91cb3e)
- **Path Width (px)** - Set the stroke width from 1-10px (default: 3px)
- **Path Opacity (%)** - Control transparency from 10-100% (default: 100%)
- **Line Style** - Choose from Solid, Dashed, or Dotted (default: Solid)
- **Child Indent (px)** - How far to indent nested heading levels (1-300px, default: 20px)
- **Corner Radius (px)** - Round the corners of the path (0-50px, default: 0px)

### Typography

Control the text appearance of the navigation:

- **Font Size (px)** - Set the text size (8-32px, default: 14px)
- **Line Height** - Set the line spacing (1-4, default: 2)

### Viewport Detection

Fine-tune how the scroll spy detects which headings are currently visible:

- **Section-based detection** - When enabled, each heading "owns" all content until the next heading. The indicator spans based on section visibility, not just heading visibility. This is more accurate for longer pages.

When section-based detection is disabled:
- **Top Margin (%)** - Percentage of viewport to exclude from the top (0-50%, default: 10%)
- **Bottom Margin (%)** - Percentage of viewport to exclude from the bottom (0-50%, default: 10%)

Lower values = more items highlighted (larger detection zone)  
Higher values = fewer items highlighted (smaller detection zone)

## Styling

The navigation can be styled using the following CSS classes:

| Class | Description |
|-------|-------------|
| `.scrollpath-nav` | Main navigation container |
| `.scrollpath-nav__list` | Navigation list (ul) |
| `.scrollpath-nav__item` | Navigation item (li) |
| `.scrollpath-nav__link` | Navigation link (a) |
| `.scrollpath-nav__svg` | SVG path container |
| `.scrollpath-nav__path` | The animated SVG path |
| `.scrollpath-nav__item--visible` | Applied to visible/active items |

## Development

### Prerequisites

- Node.js 16+
- npm

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run start
```

## Requirements

- WordPress 6.0+
- PHP 7.4+

## License

GPL-2.0-or-later
