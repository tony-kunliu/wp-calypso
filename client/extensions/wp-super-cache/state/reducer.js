/**
 * External dependencies
 */
import { combineReducersWithPersistence } from 'state/utils';

/**
 * Internal dependencies
 */
import notices from './notices/reducer';
import settings from './settings/reducer';

export default combineReducersWithPersistence( {
	notices,
	settings,
} );
