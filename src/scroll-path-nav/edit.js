import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, CheckboxControl, TextControl, Icon } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const {
        includeH1,
        includeH2,
        includeH3,
        includeH4,
        includeH5,
        includeH6,
        customSelectors,
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
                </PanelBody>
                <PanelBody title="Custom Selectors" initialOpen={true}>
                    <TextControl
                        label="Additional Selectors"
                        help="Enter CSS selectors (class names or IDs) to include in the navigation. Separate multiple selectors with commas. Example: .my-section, #intro, .custom-heading"
                        value={customSelectors}
                        onChange={(value) => setAttributes({ customSelectors: value })}
                        placeholder=".my-class, #my-id"
                    />
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
