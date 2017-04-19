/**
 * External Dependencies
 */
import React, { Component } from 'react';
import map from 'lodash/map';
import { localize } from 'i18n-calypso';
import { identity } from 'lodash';

/**
 * Internal Dependencies
 */
import ReaderSidebarTagsListItem from './list-item';

export class ReaderSidebarTagsList extends Component {

	static propTypes = {
		followedTags: React.PropTypes.array,
		onUnfollow: React.PropTypes.func.isRequired,
		path: React.PropTypes.string.isRequired,
		currentTag: React.PropTypes.string,
		translate: React.PropTypes.func,
	}

	static defaultProps = {
		translate: identity,
	}

	renderItems = () => {
		const { path, onUnfollow, currentTag, followedTags } = this.props;
		return map( followedTags, function( tag ) {
			return (
				<ReaderSidebarTagsListItem
					key={ tag.id }
					tag={ tag }
					path={ path }
					onUnfollow={ onUnfollow }
					currentTag={ currentTag } />
			);
		} );
	}

	render() {
		const { followedTags, translate } = this.props;
		if ( ! followedTags || followedTags.length === 0 ) {
			return (
				<li key="empty" className="sidebar__menu-empty">{ translate( 'Find relevant posts by adding a tag.' ) }</li>
			);
		}

		return (
			<div>{ this.renderItems() }</div>
		);
	}
}

export default localize( ReaderSidebarTagsList );
