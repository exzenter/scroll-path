<?php
/**
 * Plugin Name:       Scroll Path Nav
 * Description:       A Gutenberg block that auto-detects headings and creates an animated SVG scroll path navigation.
 * Version:           1.0.0
 * Author:            Your Name
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       scrollpath
 * Requires at least: 6.0
 * Requires PHP:      7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'SCROLLPATH_VERSION', '1.0.0' );
define( 'SCROLLPATH_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SCROLLPATH_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 */
function scrollpath_register_blocks() {
    // Check if build directory exists
    $build_dir = SCROLLPATH_PLUGIN_DIR . 'build/scroll-path-nav';
    
    if ( file_exists( $build_dir ) ) {
        register_block_type( $build_dir );
    }
}
add_action( 'init', 'scrollpath_register_blocks' );
