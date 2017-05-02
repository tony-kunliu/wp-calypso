/**
 * External dependencies
 */
import { combineReducersWithPersistence } from 'state/utils';

/**
 * Internal dependencies
 */
import suggestions from './suggestions/reducer';

export default combineReducersWithPersistence( {
	suggestions
} );
