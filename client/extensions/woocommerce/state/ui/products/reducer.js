/**
 * External dependencies
 */
import { combineReducersWithPersistence } from 'state/utils';

/**
 * Internal dependencies
 */
import edits from './edits-reducer';
import variations from './variations/reducer';

export default combineReducersWithPersistence( {
	edits,
	variations,
} );
