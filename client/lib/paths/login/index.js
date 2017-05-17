/**
 * Internal dependencies
 */
import { addQueryArgs } from 'lib/url';
import config, { isEnabled } from 'config';

export function login( { native, redirectTo, twoFactorAuthType } = {} ) {
	let url = config( 'login_url' );

	if ( native && isEnabled( 'wp-login' ) ) {
		url = '/log-in';

		if ( twoFactorAuthType ) {
			url += '/' + twoFactorAuthType;
		}
	}

	return redirectTo
		? addQueryArgs( { redirect_to: redirectTo }, url )
		: url;
}
