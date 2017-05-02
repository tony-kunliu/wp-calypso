/**
 * External dependencies
 */
import { combineReducersWithPersistence } from 'state/utils';

/**
 * Internal dependencies
 */
import products from './products/reducer';

export default combineReducersWithPersistence( {
	products
} );
