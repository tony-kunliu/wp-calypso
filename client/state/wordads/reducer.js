/**
 * External dependencies
 */
import { combineReducersWithPersistence } from 'state/utils';

/**
 * Internal dependencies
 */
import approve from './approve/reducer';
import status from './status/reducer';

export default combineReducersWithPersistence( {
	approve,
	status
} );
