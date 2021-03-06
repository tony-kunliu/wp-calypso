/**
 * Internal dependencies
 */
import error from './error-reducer';
import productCategories from './product-categories/reducer';
import {
	SERIALIZE,
	DESERIALIZE,
} from 'state/action-types';

const initialState = {};

const handlers = {
	...productCategories,
	...error,
};

export default function( state = initialState, action ) {
	const { type, payload } = action;
	const { siteId } = payload || {};
	const handler = handlers[ type ];

	// Necessary to ensure this data is not persisted.
	if ( type === SERIALIZE || type === DESERIALIZE ) {
		return initialState;
	}

	if ( handler ) {
		if ( ! siteId ) {
			throw new TypeError( `Action ${ type } handled by reducer, but no siteId set on action.` );
		}

		const siteState = state[ siteId ] || {};
		const newSiteState = handler( siteState, action );

		return { ...state, [ siteId ]: newSiteState };
	}

	return state;
}

