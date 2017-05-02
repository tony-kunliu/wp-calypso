/**
 * External dependencies
 */
import { combineReducersWithPersistence } from 'state/utils';

/**
 * Internal dependencies
 */
import keyring from './keyring/reducer';
import publicize from './publicize/reducer';
import services from './services/reducer';

export default combineReducersWithPersistence( {
	keyring,
	publicize,
	services,
} );
