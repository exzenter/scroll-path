import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const {
        includeH1,
        includeH2,
        includeH3,
        includeH4,
        includeH5,
        includeH6,
        customSelectors,
        excludeSelectors,
        viewportTopMargin,
        viewportBottomMargin,
        sectionBasedDetection,
        pathColor,
        pathWidth,
        pathOpacity,
        pathLineStyle,
        childIndent,
        pathCornerRadius,
        fontSize,
        lineHeight,
        useTitleAttribute,
        useCustomLabel,
        editorModeEnabled,
        manualEntries,
    } = attributes;

    // Build heading selector from enabled levels
    const headingLevels = [];
    if (includeH1) headingLevels.push('h1');
    if (includeH2) headingLevels.push('h2');
    if (includeH3) headingLevels.push('h3');
    if (includeH4) headingLevels.push('h4');
    if (includeH5) headingLevels.push('h5');
    if (includeH6) headingLevels.push('h6');

    // Filter manual entries to only include enabled ones
    const enabledManualEntries = editorModeEnabled
        ? manualEntries.filter(entry => entry.enabled)
        : [];

    const blockProps = useBlockProps.save({
        className: 'scrollpath-nav',
        'data-heading-levels': headingLevels.join(','),
        'data-custom-selectors': customSelectors || '',
        'data-exclude-selectors': excludeSelectors || '',
        'data-viewport-top-margin': viewportTopMargin ?? 10,
        'data-viewport-bottom-margin': viewportBottomMargin ?? 10,
        'data-section-based-detection': sectionBasedDetection ? 'true' : 'false',
        'data-path-color': pathColor || '#91cb3e',
        'data-path-width': pathWidth ?? 3,
        'data-path-opacity': pathOpacity ?? 100,
        'data-path-line-style': pathLineStyle || 'solid',
        'data-child-indent': childIndent ?? 20,
        'data-path-corner-radius': pathCornerRadius ?? 0,
        'data-font-size': fontSize ?? 14,
        'data-line-height': lineHeight ?? 2,
        'data-use-title-attribute': useTitleAttribute ? 'true' : 'false',
        'data-use-custom-label': useCustomLabel ? 'true' : 'false',
        'data-editor-mode': editorModeEnabled ? 'true' : 'false',
        'data-manual-entries': editorModeEnabled ? JSON.stringify(enabledManualEntries) : '',
    });

    return (
        <nav {...blockProps} aria-label="Page sections">
            {/* Content will be populated by frontend JavaScript */}
        </nav>
    );
}

