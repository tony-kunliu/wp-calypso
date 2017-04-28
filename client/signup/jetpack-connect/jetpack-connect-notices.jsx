/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Notice from 'components/notice';

class JetpackConnectNotices extends Component {
	static propTypes = {
		noticeType: PropTypes.oneOf( [
			'alreadyConnected',
			'alreadyConnectedByOtherUser',
			'alreadyOwned',
			'defaultAuthorizeError',
			'isDotCom',
			'jetpackIsValid',
			'notActiveJetpack',
			'notConnectedJetpack',
			'notExists',
			'notJetpack',
			'notWordPress',
			'outdatedJetpack',
			'retryAuth',
			'retryingAuth',
			'secretExpired',
			'wordpress.com',
		] ).isRequired,
		onDismissClick: PropTypes.func,
	};

	getNotice() {
		const {
			noticeType,
			onDismissClick,
			translate,
		} = this.props;

		const noticeDefaults = {
			icon: 'notice',
			onDismissClick,
			showDismiss: !! onDismissClick,
			status: 'is-error',
			text: translate( 'That\'s not a valid url.' ),
		};

		switch ( noticeType ) {
			case 'notExists':
				return (
					<Notice { ...noticeDefaults } />
				);

			case 'isDotCom':
				return (
					<Notice
						{ ...noticeDefaults }
						icon="block"
						text={ translate( 'That\'s a WordPress.com site, so you don\'t need to connect it.' ) }
					/>
				);

			case 'notWordPress':
				return (
					<Notice
						{ ...noticeDefaults }
						icon="block"
						text={ translate( 'That\'s not a WordPress site.' ) }
					/>
				);

			case 'notActiveJetpack':
				return (
					<Notice
						{ ...noticeDefaults }
						icon="block"
						text={ translate( 'Jetpack is deactivated.' ) }
					/>
				);

			case 'outdatedJetpack':
				return (
					<Notice
						{ ...noticeDefaults }
						icon="block"
						text={ translate( 'You must update Jetpack before connecting.' ) }
					/>
				);

			case 'notConnectedJetpack':
				return (
					<Notice
						{ ...noticeDefaults }
						icon="link-break"
						text={ translate( 'Jetpack is currently disconnected.' ) }
					/>
				);

			case 'alreadyOwned':
				return (
					<Notice
						{ ...noticeDefaults }
						icon="plugins"
						status="is-success"
						text={ translate( 'Jetpack is connected.' ) }
					/>
				);

			case 'notJetpack':
				return (
					<Notice
						{ ...noticeDefaults }
						icon="status"
						status="is-noticeType"
						text={ translate( 'Jetpack couldn\'t be found.' ) }
					/>
				);

			case 'alreadyConnected':
				return (
					<Notice
						{ ...noticeDefaults }
						icon="status"
						status="is-success"
						text={ translate( 'This site is already connected!' ) }
					/>
				);

			case 'wordpress.com':
				return (
					<Notice
						{ ...noticeDefaults }
						icon="status"
						status="is-warning"
						text={ translate( 'Oops, that\'s us.' ) }
					/>
				);

			case 'retryingAuth':
				return (
					<Notice
						{ ...noticeDefaults }
						status="is-warning"
						text={ translate( 'Error authorizing. Page is refreshing for an other attempt.' ) }
					/>
				);

			case 'retryAuth':
				return (
					<Notice
						{ ...noticeDefaults }
						status="is-warning"
						text={ translate( 'In some cases, authorization can take a few attempts. Please try again.' ) }
						/>
				);

			case 'secretExpired':
				return (
					<Notice
						{ ...noticeDefaults }
						text={ translate( 'Oops, that took a while. You\'ll have to try again.' ) }
					/>
				);

			case 'defaultAuthorizeError':
				return (
					<Notice
						{ ...noticeDefaults }
						text={ translate( 'Error authorizing your site. Please {{link}}contact support{{/link}}.', {
							components: { link: <a href="https://jetpack.com/contact-support" target="_blank" rel="noopener noreferrer" /> }
						} ) }
					/>
				);

			case 'alreadyConnectedByOtherUser':
				return (
					<Notice
						{ ...noticeDefaults }
						status="is-warning"
						text={ translate(
							'This site is already connected to a different WordPress.com user, ' +
							'you need to disconnect that user before you can connect another.'
						) }
					/>
				);
		}
	}

	render() {
		const notice = this.getNotice();
		if ( notice ) {
			return (
				<div className="jetpack-connect__notices-container">
					{ notice }
				</div>
			);
		}
		return null;
	}
}

export default localize( JetpackConnectNotices );
