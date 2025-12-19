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

### Custom Selectors

You can also include elements that aren't headings by adding custom CSS selectors:

```
.my-section, #intro, .custom-heading
```

This will include any elements matching those selectors in the navigation.

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
