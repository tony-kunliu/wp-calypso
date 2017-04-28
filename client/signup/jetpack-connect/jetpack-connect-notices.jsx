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

	getNoticeProps() {
		const {
			noticeType,
			onDismissClick,
			translate,
		} = this.props;

		const noticeProps = {
			icon: 'notice',
			onDismissClick,
			showDismiss: !! onDismissClick,
			status: 'is-error',
			text: translate( 'That\'s not a valid url.' ),
		};

		switch ( noticeType ) {
			case 'notExists':
				return noticeProps;

			case 'isDotCom':
				noticeProps.icon = 'block';
				noticeProps.text = translate( 'That\'s a WordPress.com site, so you don\'t need to connect it.' );
				return noticeProps;

			case 'notWordPress':
				noticeProps.icon = 'block';
				noticeProps.text = translate( 'That\'s not a WordPress site.' );
				return noticeProps;

			case 'notActiveJetpack':
				noticeProps.icon = 'block';
				noticeProps.text = translate( 'Jetpack is deactivated.' );
				return noticeProps;

			case 'outdatedJetpack':
				noticeProps.icon = 'block';
				noticeProps.text = translate( 'You must update Jetpack before connecting.' );
				return noticeProps;

			case 'notConnectedJetpack':
				noticeProps.icon = 'link-break';
				noticeProps.text = translate( 'Jetpack is currently disconnected.' );
				return noticeProps;

			case 'alreadyOwned':
				noticeProps.icon = 'plugins';
				noticeProps.status = 'is-success';
				noticeProps.text = translate( 'Jetpack is connected.' );
				return noticeProps;

			case 'notJetpack':
				noticeProps.icon = 'status';
				noticeProps.status = 'is-noticeType';
				noticeProps.text = translate( 'Jetpack couldn\'t be found.' );
				return noticeProps;

			case 'alreadyConnected':
				noticeProps.icon = 'status';
				noticeProps.status = 'is-success';
				noticeProps.text = translate( 'This site is already connected!' );
				return noticeProps;

			case 'wordpress.com':
				noticeProps.icon = 'status';
				noticeProps.status = 'is-warning';
				noticeProps.text = translate( 'Oops, that\'s us.' );
				return noticeProps;

			case 'retryingAuth':
				noticeProps.status = 'is-warning';
				noticeProps.text = translate( 'Error authorizing. Page is refreshing for an other attempt.' );
				return noticeProps;

			case 'retryAuth':
				noticeProps.status = 'is-warning';
				noticeProps.text = translate( 'In some cases, authorization can take a few attempts. Please try again.' );
				return noticeProps;

			case 'secretExpired':
				noticeProps.text = translate( 'Oops, that took a while. You\'ll have to try again.' );
				return noticeProps;

			case 'defaultAuthorizeError':
				noticeProps.text = translate( 'Error authorizing your site. Please {{link}}contact support{{/link}}.', {
					components: { link: <a href="https://jetpack.com/contact-support" target="_blank" rel="noopener noreferrer" /> }
				} );
				return noticeProps;

			case 'alreadyConnectedByOtherUser':
				noticeProps.status = 'is-warning';
				noticeProps.text = translate(
					'This site is already connected to a different WordPress.com user, ' +
					'you need to disconnect that user before you can connect another.'
				);
				return noticeProps;
		}
	}

	render() {
		const noticeProps = this.getNoticeProps();
		if ( noticeProps ) {
			return (
				<div className="jetpack-connect__notices-container">
					<Notice { ...noticeProps } />
				</div>
			);
		}
		return null;
	}
}

export default localize( JetpackConnectNotices );
