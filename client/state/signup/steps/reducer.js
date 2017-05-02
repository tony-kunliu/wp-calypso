/**
 * External dependencies
 */
import { combineReducersWithPersistence } from 'state/utils';

/**
 * Internal dependencies
 */
import siteTitle from './site-title/reducer';
import survey from './survey/reducer';

export default combineReducersWithPersistence( {
	siteTitle,
	survey,
} );
