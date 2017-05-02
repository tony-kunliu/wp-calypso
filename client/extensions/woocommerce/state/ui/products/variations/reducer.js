/**
 * External dependencies
 */
import { combineReducersWithPersistence } from 'state/utils';

/**
 * Internal dependencies
 */
import edits from './edits-reducer';

export default combineReducersWithPersistence( {
	edits
} );
