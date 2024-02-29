<?php
/**
 * Plugin Name:       Sapphire Post grid
 * Description:       Show all post as grid.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Sapphire IT
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       sphr-recent-post
 *
 * @package           post-grid
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Show all post block
 *
 * @param array $attributes array of props [explicite description].
 *
 * @return string
 */
function post_grid_block( $attributes ) {
	$args = array(
		'post_type'      => 'post',
		'post_status'    => 'publish',
		'orderby'        => $attributes['orderBy'],
		'order'          => $attributes['order'],
		'posts_per_page' => $attributes['postsPerPage'],
	);

	if ( isset( $attributes['categories'] ) ) {
		$args['category__in'] = array_column( $attributes['categories'], 'id' );
	}

	$wpcp_post_grid = new WP_Query( $args );
	ob_start();
	?>
		<div <?php get_block_wrapper_attributes(); ?>>		
			<div class=" flex-display has-<?php echo esc_attr( $attributes['columns'] ); ?>-columns">
				<?php

				while ( $wpcp_post_grid->have_posts() ) {
					$wpcp_post_grid->the_post();

					global $post;
					?>

					<div class="swiper-slide">
						<div class="post wpcp-post">
							<a href="<?php echo get_the_permalink(); ?>">
								<img src="<?php echo get_the_post_thumbnail_url( $post ); ?>" alt="">
							</a>
							<div class="post-info">
								<h4 class="post-title"><?php esc_html( the_title() ); ?></h4>
								<p><?php echo wp_kses_post( wp_trim_words( get_the_content(), 50 ) ); ?> <a href="<?php echo get_the_permalink(); ?>">Read more</a></p>
							</div>
						</div>
					</div>
					<?php
				}
				wp_reset_postdata();
				?>
			</div>

			<!-- If we need navigation buttons -->
			<div class="swiper-button-prev"></div>
			<div class="swiper-button-next"></div>

			<!-- If we need pagination -->
			<div class="swiper-pagination"></div>


		</div>

		<?php
		return ob_get_clean();
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function sphr_post_grid_block_init() {
	register_block_type( __DIR__ . '/build', array( 'render_callback' => 'post_grid_block' ) );
}
add_action( 'init', 'sphr_post_grid_block_init' );
