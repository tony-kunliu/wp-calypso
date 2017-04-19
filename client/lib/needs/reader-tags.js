/**
 * External dependencies
 */
import { find } from 'lodash';

/**
 * Internal dependencies
 */
import { requestTags } from 'state/reader/tags/items/actions';
import { getReaderFollowedTags, getReaderTags } from 'state/selectors';

const readerTags = ( {
	tags = false,
	followedTags = false,
	tag = { slug: 'slug' } }
) => ( {
	mapStateToProps: ( state, ownProps ) => {
		const props = {};

		if ( tag ) {
			props.tag = getReaderTags( ownProps[ tag.slug ] );
		}
		if ( tags ) {
			props.tags = getReaderTags( state );
		}
		if ( followedTags ) {
			props.followedTags = getReaderFollowedTags( state );
		}

		return props;
	},

	mapStateToRequestActions: ( state, ownProps ) => {
		const requestActions = [];
		const followedTagsShouldBeFetched = followedTags && getReaderFollowedTags( state ) === null;
		const tagShouldBeFetched = tag && ownProps[ tag.slug ] && ! find( getReaderTags( state ), { slug: ownProps[ tag.slug ] } );

		followedTagsShouldBeFetched && requestActions.push( requestTags() );
		tagShouldBeFetched && requestActions.push( requestTags( ownProps.tag ) );
		console.error(
			ownProps,
			ownProps.tag,
			tagShouldBeFetched,
			getReaderTags( state ) && getReaderTags( state )[ 187477 ],
		);

		return requestActions;
	}
} );

export default readerTags;
