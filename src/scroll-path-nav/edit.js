import { useBlockProps } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';

export default function Edit() {
    const blockProps = useBlockProps({
        className: 'scrollpath-nav-editor',
    });

    return (
        <div {...blockProps}>
            <div className="scrollpath-nav-editor__placeholder">
                <Icon icon="list-view" size={48} />
                <h3>Scroll Path Nav</h3>
                <p>
                    This block will automatically detect all <strong>H2</strong>, <strong>H3</strong>, and <strong>H4</strong> headings
                    on this page and generate an animated scroll navigation.
                </p>
                <p className="scrollpath-nav-editor__hint">
                    The navigation will appear on the frontend.
                </p>
            </div>
        </div>
    );
}
