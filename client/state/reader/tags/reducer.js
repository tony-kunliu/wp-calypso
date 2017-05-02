/**
 * External dependencies
 */
import { combineReducersWithPersistence } from 'state/utils';

/**
 * Internal dependencies
 */
import images from './images/reducer';
import items from './items/reducer';

export default combineReducersWithPersistence( {
	images,
	items,
} );
