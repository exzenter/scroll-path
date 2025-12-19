import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, CheckboxControl, TextControl, RangeControl, SelectControl, ColorPicker, Icon, Button, ToggleControl, Notice } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
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

    const [showModeWarning, setShowModeWarning] = useState(false);

    const blockProps = useBlockProps({
        className: 'scrollpath-nav-editor',
    });

    // Get all blocks from the editor to find headings
    const blocks = useSelect((select) => {
        return select('core/block-editor').getBlocks();
    }, []);

    // Build the heading level summary for display
    const enabledHeadings = [];
    if (includeH1) enabledHeadings.push('H1');
    if (includeH2) enabledHeadings.push('H2');
    if (includeH3) enabledHeadings.push('H3');
    if (includeH4) enabledHeadings.push('H4');
    if (includeH5) enabledHeadings.push('H5');
    if (includeH6) enabledHeadings.push('H6');

    const headingSummary = enabledHeadings.length > 0
        ? enabledHeadings.join(', ')
        : 'No headings selected';

    // Function to recursively find heading blocks
    const findHeadingBlocks = (blockList, result = []) => {
        blockList.forEach((block) => {
            if (block.name === 'core/heading') {
                const level = block.attributes.level || 2;
                const levelKey = `includeH${level}`;
                const shouldInclude = attributes[levelKey];

                if (shouldInclude) {
                    // Generate an ID from the heading content
                    const content = block.attributes.content || '';
                    const textContent = content.replace(/<[^>]+>/g, ''); // Strip HTML tags
                    let id = block.attributes.anchor || textContent
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '') || `heading-${result.length}`;

                    result.push({
                        id: id,
                        label: textContent,
                        enabled: true,
                        level: level,
                    });
                }
            }

            // Check inner blocks
            if (block.innerBlocks && block.innerBlocks.length > 0) {
                findHeadingBlocks(block.innerBlocks, result);
            }
        });
        return result;
    };

    // Calculate navigation entries from page headings
    const calculateEntries = () => {
        const entries = findHeadingBlocks(blocks);
        setAttributes({ manualEntries: entries });
    };

    // Update a single entry
    const updateEntry = (index, updates) => {
        const newEntries = [...manualEntries];
        newEntries[index] = { ...newEntries[index], ...updates };
        setAttributes({ manualEntries: newEntries });
    };

    // Toggle editor mode with warning
    const handleEditorModeToggle = (value) => {
        if (value) {
            setShowModeWarning(true);
        }
        setAttributes({ editorModeEnabled: value });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title="Editor Mode" initialOpen={true}>
                    <ToggleControl
                        label="Enable Editor Mode"
                        help={editorModeEnabled
                            ? "⚠️ Edit mode is active. Changes to page headings will NOT automatically update the navigation. Click 'Recalculate' to refresh."
                            : "When enabled, you can manually edit navigation entries. Automatic detection will be paused."
                        }
                        checked={editorModeEnabled}
                        onChange={handleEditorModeToggle}
                    />
                    {editorModeEnabled && (
                        <Button
                            variant="secondary"
                            onClick={calculateEntries}
                            style={{ marginTop: '8px' }}
                        >
                            Recalculate from Headings
                        </Button>
                    )}
                </PanelBody>
                <PanelBody title="Heading Levels" initialOpen={!editorModeEnabled}>
                    <p style={{ marginBottom: '12px', color: '#757575', fontSize: '12px' }}>
                        Select which heading levels to include in the scroll path navigation.
                    </p>
                    <CheckboxControl
                        label="H1"
                        checked={includeH1}
                        onChange={(value) => setAttributes({ includeH1: value })}
                    />
                    <CheckboxControl
                        label="H2"
                        checked={includeH2}
                        onChange={(value) => setAttributes({ includeH2: value })}
                    />
                    <CheckboxControl
                        label="H3"
                        checked={includeH3}
                        onChange={(value) => setAttributes({ includeH3: value })}
                    />
                    <CheckboxControl
                        label="H4"
                        checked={includeH4}
                        onChange={(value) => setAttributes({ includeH4: value })}
                    />
                    <CheckboxControl
                        label="H5"
                        checked={includeH5}
                        onChange={(value) => setAttributes({ includeH5: value })}
                    />
                    <CheckboxControl
                        label="H6"
                        checked={includeH6}
                        onChange={(value) => setAttributes({ includeH6: value })}
                    />
                    <hr style={{ margin: '16px 0' }} />
                    <CheckboxControl
                        label="Use title attribute as label"
                        help="When enabled, if a heading has a title attribute, it will be used as the navigation label instead of the full heading text."
                        checked={useTitleAttribute}
                        onChange={(value) => setAttributes({ useTitleAttribute: value })}
                    />
                    <CheckboxControl
                        label="Use data-scrollpath-label attribute"
                        help="When enabled, if a heading has a data-scrollpath-label attribute, it will be used as the navigation label."
                        checked={useCustomLabel}
                        onChange={(value) => setAttributes({ useCustomLabel: value })}
                    />
                </PanelBody>
                <PanelBody title="Custom Selectors" initialOpen={false}>
                    <TextControl
                        label="Include Selectors"
                        help="CSS selectors to include in the navigation. Separate with commas. Example: .my-section, #intro"
                        value={customSelectors}
                        onChange={(value) => setAttributes({ customSelectors: value })}
                        placeholder=".my-class, #my-id"
                    />
                    <TextControl
                        label="Exclude Selectors"
                        help="CSS selectors to exclude from the navigation. Any heading matching these selectors will be hidden. Example: .no-nav, #skip-this"
                        value={excludeSelectors}
                        onChange={(value) => setAttributes({ excludeSelectors: value })}
                        placeholder=".no-nav, #hidden-section"
                    />
                </PanelBody>
                <PanelBody title="Path Styling" initialOpen={true}>
                    <p style={{ marginBottom: '12px', color: '#757575', fontSize: '12px' }}>
                        Customize the appearance of the scroll indicator path.
                    </p>
                    <div style={{ marginBottom: '16px' }}>
                        <p style={{ marginBottom: '8px', fontWeight: '500' }}>Path Color</p>
                        <ColorPicker
                            color={pathColor}
                            onChange={(value) => setAttributes({ pathColor: value })}
                            enableAlpha={false}
                        />
                    </div>
                    <RangeControl
                        label="Path Width (px)"
                        value={pathWidth}
                        onChange={(value) => setAttributes({ pathWidth: value })}
                        min={1}
                        max={10}
                        step={1}
                    />
                    <RangeControl
                        label="Path Opacity (%)"
                        value={pathOpacity}
                        onChange={(value) => setAttributes({ pathOpacity: value })}
                        min={10}
                        max={100}
                        step={5}
                    />
                    <SelectControl
                        label="Line Style"
                        value={pathLineStyle}
                        options={[
                            { label: 'Solid', value: 'solid' },
                            { label: 'Dashed', value: 'dashed' },
                            { label: 'Dotted', value: 'dotted' },
                        ]}
                        onChange={(value) => setAttributes({ pathLineStyle: value })}
                    />
                    <RangeControl
                        label="Child Indent (px)"
                        help="How far to indent nested heading levels"
                        value={childIndent}
                        onChange={(value) => setAttributes({ childIndent: value })}
                        min={1}
                        max={300}
                        step={1}
                    />
                    <RangeControl
                        label="Corner Radius (px)"
                        help="Round the corners of the path"
                        value={pathCornerRadius}
                        onChange={(value) => setAttributes({ pathCornerRadius: value })}
                        min={0}
                        max={50}
                        step={1}
                    />
                </PanelBody>
                <PanelBody title="Typography" initialOpen={false}>
                    <RangeControl
                        label="Font Size (px)"
                        value={fontSize}
                        onChange={(value) => setAttributes({ fontSize: value })}
                        min={8}
                        max={32}
                        step={1}
                    />
                    <RangeControl
                        label="Line Height"
                        value={lineHeight}
                        onChange={(value) => setAttributes({ lineHeight: value })}
                        min={1}
                        max={4}
                        step={0.1}
                    />
                </PanelBody>
                <PanelBody title="Viewport Detection" initialOpen={false}>
                    <CheckboxControl
                        label="Section-based detection"
                        help="When enabled, each heading 'owns' all content until the next heading. The indicator spans based on section visibility, not just heading visibility."
                        checked={sectionBasedDetection}
                        onChange={(value) => setAttributes({ sectionBasedDetection: value })}
                    />
                    {!sectionBasedDetection && (
                        <>
                            <p style={{ marginTop: '16px', marginBottom: '12px', color: '#757575', fontSize: '12px' }}>
                                Adjust how the scroll spy detects visible headings. Higher values create smaller detection zones.
                            </p>
                            <RangeControl
                                label="Top Margin (%)"
                                help="Percentage of viewport to exclude from top"
                                value={viewportTopMargin}
                                onChange={(value) => setAttributes({ viewportTopMargin: value })}
                                min={0}
                                max={50}
                                step={5}
                            />
                            <RangeControl
                                label="Bottom Margin (%)"
                                help="Percentage of viewport to exclude from bottom"
                                value={viewportBottomMargin}
                                onChange={(value) => setAttributes({ viewportBottomMargin: value })}
                                min={0}
                                max={50}
                                step={5}
                            />
                        </>
                    )}
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                {showModeWarning && editorModeEnabled && (
                    <Notice
                        status="warning"
                        isDismissible={true}
                        onRemove={() => setShowModeWarning(false)}
                    >
                        <strong>Editor Mode Enabled:</strong> The navigation will NOT automatically update when headings change. Use "Recalculate from Headings" to refresh the list manually.
                    </Notice>
                )}
                <div className="scrollpath-nav-editor__placeholder">
                    <Icon icon="list-view" size={48} />
                    <h3>Scroll Path Nav</h3>

                    {!editorModeEnabled ? (
                        <>
                            <p>
                                This block will detect <strong>{headingSummary}</strong> headings
                                on this page and generate an animated scroll navigation.
                            </p>
                            {customSelectors && (
                                <p className="scrollpath-nav-editor__hint">
                                    <strong>Custom selectors:</strong> {customSelectors}
                                </p>
                            )}
                            <p className="scrollpath-nav-editor__hint">
                                The navigation will appear on the frontend.
                            </p>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    calculateEntries();
                                    setAttributes({ editorModeEnabled: true });
                                    setShowModeWarning(true);
                                }}
                                style={{ marginTop: '12px' }}
                            >
                                Calculate Navigation
                            </Button>
                        </>
                    ) : (
                        <div className="scrollpath-nav-editor__entries">
                            {manualEntries.length === 0 ? (
                                <>
                                    <p>No entries found. Click the button below to detect headings.</p>
                                    <Button variant="primary" onClick={calculateEntries}>
                                        Calculate Navigation
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <p style={{ marginBottom: '12px', fontSize: '12px', color: '#757575' }}>
                                        Uncheck to hide, edit labels as needed:
                                    </p>
                                    <div className="scrollpath-nav-editor__entry-list">
                                        {manualEntries.map((entry, index) => (
                                            <div
                                                key={entry.id + '-' + index}
                                                className="scrollpath-nav-editor__entry"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    marginBottom: '8px',
                                                    paddingLeft: `${(entry.level - 1) * 16}px`,
                                                    opacity: entry.enabled ? 1 : 0.5,
                                                }}
                                            >
                                                <CheckboxControl
                                                    checked={entry.enabled}
                                                    onChange={(value) => updateEntry(index, { enabled: value })}
                                                    __nextHasNoMarginBottom
                                                />
                                                <span style={{ fontSize: '11px', color: '#757575', minWidth: '24px' }}>
                                                    H{entry.level}
                                                </span>
                                                <TextControl
                                                    value={entry.label}
                                                    onChange={(value) => updateEntry(index, { label: value })}
                                                    style={{ flex: 1, marginBottom: 0 }}
                                                    __nextHasNoMarginBottom
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        variant="secondary"
                                        onClick={calculateEntries}
                                        isDestructive
                                        style={{ marginTop: '12px' }}
                                    >
                                        Recalculate (Overwrites Changes)
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

