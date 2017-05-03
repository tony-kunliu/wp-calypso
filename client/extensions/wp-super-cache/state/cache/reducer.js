/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { createReducer } from 'state/utils';
import {
	WP_SUPER_CACHE_DELETE_CACHE,
	WP_SUPER_CACHE_DELETE_CACHE_FAILURE,
	WP_SUPER_CACHE_DELETE_CACHE_SUCCESS,
	WP_SUPER_CACHE_PRELOAD_CACHE,
	WP_SUPER_CACHE_PRELOAD_CACHE_CANCEL,
	WP_SUPER_CACHE_PRELOAD_CACHE_CANCEL_FAILURE,
	WP_SUPER_CACHE_PRELOAD_CACHE_CANCEL_SUCCESS,
	WP_SUPER_CACHE_PRELOAD_CACHE_FAILURE,
	WP_SUPER_CACHE_PRELOAD_CACHE_SUCCESS,
	WP_SUPER_CACHE_RECEIVE_TEST_CACHE_RESULTS,
	WP_SUPER_CACHE_TEST_CACHE,
	WP_SUPER_CACHE_TEST_CACHE_FAILURE,
	WP_SUPER_CACHE_TEST_CACHE_SUCCESS,
} from '../action-types';

/**
 * Returns the updated deleting state after an action has been dispatched.
 * Deleting state tracks whether the cache for a site is currently being deleted.
 *
 * @param  {Object} state Current deleting state
 * @param  {Object} action Action object
 * @return {Object} Updated deleting state
 */
const deleteStatus = createReducer( {}, {
	[ WP_SUPER_CACHE_DELETE_CACHE ]: ( state, { siteId } ) => ( {
		...state,
		[ siteId ]: {
			deleting: true,
			status: 'pending',
		}
	} ),
	[ WP_SUPER_CACHE_DELETE_CACHE_SUCCESS ]: ( state, { siteId } ) => ( {
		...state,
		[ siteId ]: {
			deleting: false,
			status: 'success',
		}
	} ),
	[ WP_SUPER_CACHE_DELETE_CACHE_FAILURE ]: ( state, { siteId } ) => ( {
		...state,
		[ siteId ]: {
			deleting: false,
			status: 'error',
		}
	} )
} );

/**
 * Returns the updated cache testing state after an action has been dispatched.
 * Testing state tracks whether the cache test for a site is currently in progress.
 *
 * @param  {Object} state Current cache testing state
 * @param  {Object} action Action object
 * @return {Object} Updated cache testing state
 */
const testStatus = createReducer( {}, {
	[ WP_SUPER_CACHE_TEST_CACHE ]: ( state, { siteId } ) => ( {
		...state,
		[ siteId ]: {
			testing: true,
			status: 'pending',
		}
	} ),
	[ WP_SUPER_CACHE_TEST_CACHE_SUCCESS ]: ( state, { siteId } ) => ( {
		...state,
		[ siteId ]: {
			testing: false,
			status: 'success',
		}
	} ),
	[ WP_SUPER_CACHE_TEST_CACHE_FAILURE ]: ( state, { siteId } ) => ( {
		...state,
		[ siteId ]: {
			testing: false,
			status: 'error',
		}
	} )
} );

/**
 * Returns the updated preload state after an action has been dispatched.
 * Preloading state tracks whether the preload for a site is currently in progress.
 *
 * @param  {Object} state Current preload state
 * @param  {Object} action Action object
 * @return {Object} Updated preload state
 */
const preloadStatus = createReducer( {}, {
	[ WP_SUPER_CACHE_PRELOAD_CACHE ]: ( state, { siteId } ) => ( {
		...state,
		[ siteId ]: {
			preloading: true,
			status: 'pending',
		}
	} ),
	[ WP_SUPER_CACHE_PRELOAD_CACHE_SUCCESS ]: ( state, { siteId } ) => ( {
		...state,
		[ siteId ]: {
			preloading: false,
			status: 'success',
		}
	} ),
	[ WP_SUPER_CACHE_PRELOAD_CACHE_FAILURE ]: ( state, { siteId } ) => ( {
		...state,
		[ siteId ]: {
			preloading: false,
			status: 'error',
		}
	} )
} );

/**
 * Returns the updated preload cancel state after an action has been dispatched.
 * Cancel preloading state tracks whether the preload for a site is currently being cancelled.
 *
 * @param  {Object} state Current cancel preload state
 * @param  {Object} action Action object
 * @return {Object} Updated cancel preload state
 */
const preloadCancelStatus = createReducer( {}, {
	[ WP_SUPER_CACHE_PRELOAD_CACHE_CANCEL ]: ( state, { siteId } ) => ( {
		...state,
		[ siteId ]: {
			cancelling: true,
			status: 'pending',
		}
	} ),
	[ WP_SUPER_CACHE_PRELOAD_CACHE_CANCEL_SUCCESS ]: ( state, { siteId } ) => ( {
		...state,
		[ siteId ]: {
			cancelling: false,
			status: 'success',
		}
	} ),
	[ WP_SUPER_CACHE_PRELOAD_CACHE_CANCEL_FAILURE ]: ( state, { siteId } ) => ( {
		...state,
		[ siteId ]: {
			cancelling: false,
			status: 'error',
		}
	} )
} );

/**
 * Tracks the cache test results for a particular site.
 *
 * @param  {Object} state Current cache test results
 * @param  {Object} action Action object
 * @return {Object} Updated cache test results
 */
const items = createReducer( {}, {
	[ WP_SUPER_CACHE_RECEIVE_TEST_CACHE_RESULTS ]: ( state, { siteId, results } ) => ( { ...state, [ siteId ]: results } ),
} );

export default combineReducers( {
	deleteStatus,
	items,
	preloadCancelStatus,
	preloadStatus,
	testStatus,
} );
