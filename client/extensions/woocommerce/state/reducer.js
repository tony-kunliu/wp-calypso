/**
 * External dependencies
 */
import { combineReducersWithPersistence } from 'state/utils';

/**
 * Internal dependencies
 */
import ui from './ui/reducer';

export default combineReducersWithPersistence( {
	ui
} );
