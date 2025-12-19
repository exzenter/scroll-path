import { useBlockProps } from '@wordpress/block-editor';

export default function save() {
    const blockProps = useBlockProps.save({
        className: 'scrollpath-nav',
    });

    return (
        <nav {...blockProps} aria-label="Page sections">
            {/* Content will be populated by frontend JavaScript */}
        </nav>
    );
}
