/**
 * External dependencies
 */
import { combineReducersWithPersistence } from 'state/utils';

/**
 * Internal dependencies
 */
import courses from './courses/reducer';
import directly from './directly/reducer';
import ticket from './ticket/reducer';

export default combineReducersWithPersistence( {
	courses,
	directly,
	ticket,
} );
