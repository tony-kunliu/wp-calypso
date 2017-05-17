/**
 * Internal dependencies
 */
import { combineReducers } from 'redux';
import { keyedReducer } from 'state/utils';
import status from './status/reducer';

const siteReducer = combineReducers( {
	status,
} );

export default keyedReducer( 'siteId', siteReducer );

