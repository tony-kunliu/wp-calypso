/**
 * External dependencies
 */
import { combineReducersWithPersistence } from 'state/utils';

/**
 * Internal dependencies
 */
import sidebar from './sidebar/reducer';
import cardExpansions from './card-expansions/reducer';

export default combineReducersWithPersistence( {
	sidebar,
	cardExpansions,
} );
