/**
 * External Dependencies
 */
import React from 'react';

/**
 * Internal Dependencies
 */
import Stream from 'reader/stream';
import DocumentHead from 'components/data/document-head';
import EmptyContent from './empty';
import TagStreamHeader from './header';
import {
	recordAction,
	recordGaEvent,
	recordTrack,
} from 'reader/stats';
import HeaderBack from 'reader/header-back';
import { requestFollowTag, requestUnfollowTag } from 'state/reader/tags/items/actions';
import { find } from 'lodash';
import needs, { readerTags } from 'lib/needs';

const TagStream = React.createClass( {

	_isMounted: false,

	propTypes: {
		encodedTagSlug: React.PropTypes.string,
		decodedTagSlug: React.PropTypes.string,
	},

	getInitialState() {
		return {
			isEmojiTitle: false
		};
	},

	componentWillMount() {
		const self = this;
		this._isMounted = true;
		// can't use arrows with asyncRequire
		asyncRequire( 'emoji-text', function( emojiText ) {
			if ( self._isMounted ) {
				self.setState( { emojiText } );
			}
		} );
		asyncRequire( 'twemoji', function( twemoji ) {
			if ( self._isMounted ) {
				const title = self.props.decodedTagSlug;
				self.setState( {
					twemoji,
					isEmojiTitle: title && twemoji.test( title )
				} );
			}
		} );
	},

	componentWillUnmount() {
		this._isMounted = false;
	},

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.encodedTagSlug !== this.props.encodedTagSlug ) {
			this.checkForTwemoji( nextProps );
		}
	},

	checkForTwemoji() {
		const title = this.getTitle();
		this.setState( {
			isEmojiTitle: title && this.state.twemoji && this.state.twemoji.test( title )
		} );
	},

	isSubscribed() {
		const tag = find( this.props.tags, { slug: this.props.encodedTagSlug } );
		return !! ( tag && tag.isFollowing );
	},

	toggleFollowing() {
		const { decodedTagSlug, unfollowTag, followTag } = this.props;
		const isFollowing = this.isSubscribed(); // this is the current state, not the new state
		const toggleAction = isFollowing ? unfollowTag : followTag;
		toggleAction( decodedTagSlug );
		recordAction( isFollowing ? 'unfollowed_topic' : 'followed_topic' );
		recordGaEvent( isFollowing ? 'Clicked Unfollow Topic' : 'Clicked Follow Topic', decodedTagSlug );
		recordTrack( isFollowing ? 'calypso_reader_reader_tag_unfollowed' : 'calypso_reader_reader_tag_followed', {
			tag: decodedTagSlug
		} );
	},

	render() {
		const emptyContent = ( <EmptyContent decodedTagSlug={ this.props.decodedTagSlug } /> );
		const title = this.props.decodedTagSlug;
		const tag = find( this.props.tags, { slug: this.props.encodedTagSlug } );

		let imageSearchString = this.props.encodedTagSlug;

		// If the tag contains emoji, convert to text equivalent
		if ( this.state.emojiText && this.state.isEmojiTitle ) {
			imageSearchString = this.state.emojiText.convert( title, {
				delimiter: ''
			} );
		}

		return (
			<Stream { ...this.props } listName={ this.state.title } emptyContent={ emptyContent } showFollowInHeader={ true } >
				<DocumentHead title={ this.translate( '%s ‹ Reader', { args: title } ) } />
				{ this.props.showBack && <HeaderBack /> }
				<TagStreamHeader
					title={ title }
					imageSearchString={ imageSearchString }
					showFollow={ !! ( tag && tag.id ) }
					following={ this.isSubscribed() }
					onFollowToggle={ this.toggleFollowing }
					showBack={ this.props.showBack } />
			</Stream>
		);
	}
} );

export default needs(
	[
		readerTags( { tag: { slug: 'encodedTagSlug' } } ),
	],
	{
		followTag: requestFollowTag,
		unfollowTag: requestUnfollowTag,
	},
)( TagStream );
