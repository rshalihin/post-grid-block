import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element'
import { useSelect } from '@wordpress/data';
import './editor.scss';
import { PanelBody, RangeControl, QueryControls } from '@wordpress/components';


export default function Edit({ attributes, setAttributes }) {
	const { columns, displayFeaturedImage, postsPerPage, order, orderBy, categories } = attributes;

	const cateIds = categories && categories.length > 0 ? categories.map(cat => cat.id) : [];
	const posts = useSelect((select) => {
		return select('core').getEntityRecords('postType', 'post', { per_page: postsPerPage, _embed: true, order, orderby: orderBy, categories: cateIds });
	}, [postsPerPage, order, orderBy, categories]);

	// Get All categories
	const allCate = useSelect((select) => {
		return select('core').getEntityRecords('taxonomy', 'category', { par_page: 999, })
	}, []);

	const cateSuggestions = {};
	// add all categories in cateSuggestions object
	if (allCate) {
		for (let i = 0; i < allCate.length; i++) {
			const cate = allCate[i];
			cateSuggestions[cate.name] = cate;
		}
	};

	// const onDisplayFeaturedImageChange = (value) => {
	// 	setAttributes({ displayFeaturedImage: value });
	// };

	// update categories as user per user selections
	const onCategoryChanges = (values) => {
		// Find Invalide user input category
		const hasNoSuggestions = values.some((value) => typeof value === 'string' && !cateSuggestions[value]);
		// return if Invalide input
		if (hasNoSuggestions) return;
		// Get Valide input
		const updateCategories = values.map((token) => {
			return typeof token === 'string' ? cateSuggestions[token] : token;
		});
		// Update category.
		setAttributes({ categories: updateCategories });

	}

	const onColumnChange = (newNumberColumn) => {
		setAttributes({ columns: newNumberColumn });
	};

	const onPostsPerPageChange = (newPostsPerPage) => {
		setAttributes({ postsPerPage: newPostsPerPage });
	};

	// console.log(posts);

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<RangeControl label={__('Columns', 'post-grid')} min={1} max={6} value={columns} onChange={onColumnChange} />
					<QueryControls
						numberOfItems={postsPerPage}
						onNumberOfItemsChange={onPostsPerPageChange}
						minItems={2}
						maxItems={50}
						orderBy={orderBy}
						onOrderByChange={(value) => setAttributes({ orderBy: value })}
						order={order}
						onOrderChange={(value) => setAttributes({ order: value })}
						categorySuggestions={cateSuggestions}
						selectedCategories={categories}
						onCategoryChange={onCategoryChanges}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()}>
				<div className="swiper wpcp-post-slider">
					<div className={`swiper-wrapper flex-display has-${columns}-columns`}>
						{posts && posts.map((post) => {
							const featuerImage = post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'].length > 0 && post._embedded['wp:featuredmedia'][0];
							return (
								<div className="swiper-slide" key={post.id}>
									<div className="post wpcp-post">
										<a href={post.link}>
											{displayFeaturedImage && featuerImage && <img src={featuerImage.source_url} alt={featuerImage.alt_text} />}
										</a>
										<div className="post-info">
											<h4 className="post-title">
												{post.title.rendered ?
													<RawHTML>{post.title.rendered}</RawHTML>
													: __("No Title", "post-grid")
												}
											</h4>
											<p>{post.excerpt.rendered ?
												<RawHTML>{post.excerpt.rendered}</RawHTML>
												: __("No Content", "post-grid")
											}</p>

										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
}
