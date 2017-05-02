/**
 * External dependencies
 */
import { combineReducersWithPersistence } from 'state/utils';

/**
 * Internal dependencies
 */
import posts from './posts/reducer';
import lists from './lists/reducer';

export default combineReducersWithPersistence( {
	posts,
	lists
} );
