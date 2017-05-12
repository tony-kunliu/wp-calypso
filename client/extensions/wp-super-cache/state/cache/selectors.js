/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Returns true if we are deleting the cache for the specified site ID, false otherwise.
 *
 * @param  {Object}  state Global state tree
 * @param  {Number}  siteId Site ID
 * @return {Boolean} Whether the cache is being deleted
 */
export function isDeletingCache( state, siteId ) {
	return get( state, [ 'extensions', 'wpSuperCache', 'cache', 'deleteStatus', siteId, 'deleting' ], false );
}

/**
 * Returns true if the cache delete request was successful.
 *
 * @param  {Object}  state Global state tree
 * @param  {Number}  siteId Site ID
 * @return {Boolean} Whether the cache delete request was successful
 */
export function isCacheDeleteSuccessful( state, siteId ) {
	return getCacheDeleteStatus( state, siteId ) === 'success';
}

/**
 * Returns the status of the last cache delete request.
 *
 * @param  {Object}  state Global state tree
 * @param  {Number}  siteId Site ID
 * @return {String}  Delete request status (pending, success or error)
 */
export function getCacheDeleteStatus( state, siteId ) {
	return get( state, [ 'extensions', 'wpSuperCache', 'cache', 'deleteStatus', siteId, 'status' ] );
}

/**
 * Returns the cache test results for the specified site ID.
 *
 * @param  {Object} state Global state tree
 * @param  {Number} siteId Site ID
 * @return {Object} Cache test results
 */
export function getCacheTestResults( state, siteId ) {
	return get( state, [ 'extensions', 'wpSuperCache', 'cache', 'items', siteId ] );
}
