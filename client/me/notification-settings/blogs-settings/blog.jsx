/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import { getSite } from 'state/sites/selectors';
import Card from 'components/card';
import Header from './header';
import SettingsForm from 'me/notification-settings/settings-form';

class BlogSettings extends Component {
	static propTypes = {
		site: PropTypes.object.isRequired,
		devices: PropTypes.object,
		disableToggle: PropTypes.bool,
		settings: PropTypes.instanceOf( Immutable.Map ).isRequired,
		hasUnsavedChanges: PropTypes.bool.isRequired,
		onToggle: PropTypes.func.isRequired,
		onSave: PropTypes.func.isRequired,
		onSaveToAll: PropTypes.func.isRequired
	};

	state = { isExpanded: false };

	onToggle = () => {
		const isExpanded = ! this.state.isExpanded;
		this.setState( { isExpanded } );
	};

	render() {
		const {
			site,
			site: { ID: sourceId },
			settings,
			disableToggle,
			devices,
			hasUnsavedChanges,
			onToggle,
			onSave,
			onSaveToAll
		} = this.props;

		const { isExpanded } = this.state;

		const styles = classNames( 'notification-settings-blog-settings', {
			'is-compact': ! isExpanded,
			'is-expanded': isExpanded
		} );

		return (
			<Card className={ styles }>
				<Header
					{ ...{ site, settings, disableToggle } }
					onToggle={ this.onToggle } />
				{ ( () => {
					if ( isExpanded || disableToggle ) {
						return <SettingsForm
							{ ...{
								sourceId,
								devices,
								settings,
								hasUnsavedChanges,
								isApplyAllVisible: ! disableToggle,
								onToggle,
								onSave,
								onSaveToAll
							} }
							settingKeys={ [ 'new_comment', 'comment_like', 'post_like', 'follow', 'achievement', 'mentions' ] } />;
					}
				} )() }
			</Card>
		);
	}
}

const mapStateToProps = ( state, { siteId } ) => ( {
	site: getSite( state, siteId )
} );

export default connect( mapStateToProps )( BlogSettings );
