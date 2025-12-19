import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, CheckboxControl, TextControl, RangeControl, SelectControl, ColorPicker, Icon } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const {
        includeH1,
        includeH2,
        includeH3,
        includeH4,
        includeH5,
        includeH6,
        customSelectors,
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
    } = attributes;

    const blockProps = useBlockProps({
        className: 'scrollpath-nav-editor',
    });

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

    return (
        <>
            <InspectorControls>
                <PanelBody title="Heading Levels" initialOpen={true}>
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
                        label="Additional Selectors"
                        help="Enter CSS selectors (class names or IDs) to include in the navigation. Separate multiple selectors with commas. Example: .my-section, #intro, .custom-heading"
                        value={customSelectors}
                        onChange={(value) => setAttributes({ customSelectors: value })}
                        placeholder=".my-class, #my-id"
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
                <div className="scrollpath-nav-editor__placeholder">
                    <Icon icon="list-view" size={48} />
                    <h3>Scroll Path Nav</h3>
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
                </div>
            </div>
        </>
    );
}
