/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';
import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { noop, sum, values } from 'lodash';

/**
 * Internal dependencies
 */
import {
	DESERIALIZE,
	SERIALIZE,
} from 'state/action-types';
import { testSchema } from './mocks/schema';
import useMockery from 'test/helpers/use-mockery';

describe( 'utils', () => {
	const currentState = deepFreeze( {
			test: [ 'one', 'two', 'three' ]
		} ),
		actionSerialize = { type: SERIALIZE },
		actionDeserialize = { type: DESERIALIZE };
	let createReducer;
	let extendAction;
	let keyedReducer;
	let reducer;
	let withSchemaValidation;

	useMockery( ( mockery ) => {
		mockery.registerMock( 'lib/warn', noop );

		( {
			createReducer,
			extendAction,
			keyedReducer,
			withSchemaValidation,
		} = require( 'state/utils' ) );
	} );

	describe( 'extendAction()', () => {
		it( 'should return an updated action object, merging data', () => {
			const action = extendAction( {
				type: 'ACTION_TEST',
				meta: {
					preserve: true
				}
			}, {
				meta: {
					ok: true
				}
			} );

			expect( action ).to.eql( {
				type: 'ACTION_TEST',
				meta: {
					preserve: true,
					ok: true
				}
			} );
		} );

		it( 'should return an updated action thunk, merging data on dispatch', () => {
			const dispatch = spy();
			const action = extendAction(
				( thunkDispatch ) => thunkDispatch( {
					type: 'ACTION_TEST',
					meta: {
						preserve: true
					}
				} ),
				{
					meta: {
						ok: true
					}
				}
			);

			action( dispatch );
			expect( dispatch ).to.have.been.calledWithExactly( {
				type: 'ACTION_TEST',
				meta: {
					preserve: true,
					ok: true
				}
			} );
		} );

		it( 'should return an updated nested action thunk, merging data on dispatch', () => {
			const dispatch = spy();
			const action = extendAction(
				( thunkDispatch ) => thunkDispatch(
					( nestedThunkDispatch ) => nestedThunkDispatch( {
						type: 'ACTION_TEST',
						meta: {
							preserve: true
						}
					} )
				),
				{
					meta: {
						ok: true
					}
				}
			);

			action( dispatch );
			dispatch.getCall( 0 ).args[ 0 ]( dispatch );
			expect( dispatch ).to.have.been.calledWithExactly( {
				type: 'ACTION_TEST',
				meta: {
					preserve: true,
					ok: true
				}
			} );
		} );
	} );

	describe( '#createReducer()', () => {
		context( 'only default behavior', () => {
			before( () => {
				reducer = createReducer();
			} );

			it( 'should return a function', () => {
				expect( reducer ).to.be.a.function;
			} );

			it( 'should return initial state when invalid action passed', () => {
				const invalidAction = {};

				expect(
					reducer( currentState, invalidAction )
				).to.be.deep.equal( currentState );
			} );

			it( 'should return initial state when unknown action type passed', () => {
				const unknownAction = {
					type: 'UNKNOWN'
				};

				expect(
					reducer( currentState, unknownAction )
				).to.be.deep.equal( currentState );
			} );

			it( 'should return default null state when serialize action type passed', () => {
				expect(
					reducer( currentState, actionSerialize )
				).to.be.null;
			} );

			it( 'should return default null state when deserialize action type passed', () => {
				expect(
					reducer( currentState, actionDeserialize )
				).to.be.null;
			} );

			it( 'should throw an error when passed an undefined type', () => {
				expect( () => reducer( undefined, { type: undefined } ) ).to.throw;
			} );
		} );

		context( 'with reducers and default state provided', () => {
			const initialState = {},
				TEST_ADD = 'TEST_ADD';

			before( () => {
				reducer = createReducer( initialState, {
					[ TEST_ADD ]: ( state, action ) => {
						return {
							test: [ ...state.test, action.value ]
						};
					}
				} );
			} );

			it( 'should return default {} state when SERIALIZE action type passed', () => {
				expect(
					reducer( currentState, actionSerialize )
				).to.be.equal( initialState );
			} );

			it( 'should return default {} state when DESERIALIZE action type passed', () => {
				expect(
					reducer( currentState, actionDeserialize )
				).to.be.equal( initialState );
			} );

			it( 'should add new value to test array when acc action passed', () => {
				const addAction = {
					type: TEST_ADD,
					value: 'four'
				};

				const newState = reducer( currentState, addAction );

				expect( newState ).to.not.equal( currentState );
				expect( newState ).to.be.eql( {
					test: [ 'one', 'two', 'three', 'four' ]
				} );
			} );
		} );

		context( 'with schema provided', () => {
			const initialState = {};

			before( () => {
				reducer = createReducer( initialState, {}, testSchema );
			} );

			it( 'should return initial state when serialize action type passed', () => {
				expect(
					reducer( currentState, actionSerialize )
				).to.be.deep.equal( currentState );
			} );

			it( 'should return initial state when valid initial state and deserialize action type passed', () => {
				expect(
					reducer( currentState, actionDeserialize )
				).to.be.deep.equal( currentState );
			} );

			it( 'should return default state when invalid initial state and deserialize action type passed', () => {
				expect(
					reducer( { invalid: 'state' }, actionDeserialize )
				).to.be.deep.equal( initialState );
			} );
		} );

		context( 'with default actions overrides', () => {
			const overriddenState = { overridden: 'state' };

			before( () => {
				reducer = createReducer( null, {
					[ SERIALIZE ]: () => overriddenState,
					[ DESERIALIZE ]: () => overriddenState
				} );
			} );

			it( 'should return overridden state when serialize action type passed', () => {
				expect(
					reducer( currentState, actionSerialize )
				).to.be.deep.equal( overriddenState );
			} );

			it( 'should return overridden state when deserialize action type passed', () => {
				expect(
					reducer( currentState, actionDeserialize )
				).to.be.deep.equal( overriddenState );
			} );
		} );

		it( 'should cache the serialize result on custom serialization behavior', () => {
			const monitor = stub().returnsArg( 0 );

			reducer = createReducer( [], {
				[ SERIALIZE ]: monitor,
				TEST_ADD: ( state ) => [ ...state, state.length ]
			}, testSchema );

			let state;
			state = reducer( state, { type: SERIALIZE } );
			state = reducer( state, { type: SERIALIZE } );
			state = reducer( state, { type: 'TEST_ADD' } );
			state = reducer( state, { type: SERIALIZE } );
			state = reducer( state, { type: SERIALIZE } );
			state = reducer( state, { type: 'TEST_ADD' } );
			state = reducer( state, { type: SERIALIZE } );

			expect( monitor ).to.have.been.calledThrice;
			expect( state ).to.eql( [ 0, 1 ] );
		} );
	} );

	describe( '#keyedReducer', () => {
		const grow = name => ( { type: 'GROW', name } );

		const age = ( state = 0, action ) =>
			'GROW' === action.type
				? state + 1
				: state;

		const prevState = deepFreeze( {
			Bonobo: 13,
		} );

		it( 'should only accept string-type key names', () => {
			expect( () => keyedReducer( null, age ) ).to.throw( TypeError );
			expect( () => keyedReducer( undefined, age ) ).to.throw( TypeError );
			expect( () => keyedReducer( [], age ) ).to.throw( TypeError );
			expect( () => keyedReducer( {}, age ) ).to.throw( TypeError );
			expect( () => keyedReducer( true, age ) ).to.throw( TypeError );
			expect( () => keyedReducer( 10, age ) ).to.throw( TypeError );
			expect( () => keyedReducer( 15.4, age ) ).to.throw( TypeError );
			expect( () => keyedReducer( '', age ) ).to.throw( TypeError );
			expect( () => keyedReducer( 'key', age ) ).to.not.throw( TypeError );
		} );

		it( 'should only accept a function as the reducer argument', () => {
			expect( () => keyedReducer( 'key', null ) ).to.throw( TypeError );
			expect( () => keyedReducer( 'key', undefined ) ).to.throw( TypeError );
			expect( () => keyedReducer( 'key', [] ) ).to.throw( TypeError );
			expect( () => keyedReducer( 'key', {} ) ).to.throw( TypeError );
			expect( () => keyedReducer( 'key', true ) ).to.throw( TypeError );
			expect( () => keyedReducer( 'key', 10 ) ).to.throw( TypeError );
			expect( () => keyedReducer( 'key', 15.4 ) ).to.throw( TypeError );
			expect( () => keyedReducer( 'key', '' ) ).to.throw( TypeError );
			expect( () => keyedReducer( 'key' ) ).to.throw( TypeError );
			expect( () => keyedReducer( 'key', () => {} ).to.not.throw( TypeError ) );
		} );

		it( 'should create keyed state given simple reducers', () => {
			const keyed = keyedReducer( 'name', age );
			expect( keyed( undefined, grow( 'Calypso' ) ) ).to.eql( {
				Calypso: 1
			} );
		} );

		it( 'should only affect the keyed item in a collection', () => {
			const keyed = keyedReducer( 'name', age );
			expect( keyed( prevState, grow( 'Calypso' ) ) ).to.eql( {
				Bonobo: 13,
				Calypso: 1,
			} );
		} );

		it( 'should skip if no key is provided in the action', () => {
			const keyed = keyedReducer( 'name', age );
			expect( keyed( prevState, { type: 'GROW' } ) ).to.equal( prevState );
		} );

		it( 'should handle falsey keys', () => {
			const keyed = keyedReducer( 'name', age );
			expect( keyed( { [ 0 ]: 10 }, grow( 0 ) ) ).to.eql( { '0': 11 } );
		} );

		it( 'should handle coerced-to-string keys', () => {
			const keyed = keyedReducer( 'name', age );
			expect( keyed( { '10': 10 }, grow( '10' ) ) ).to.eql( { '10': 11 } );
			expect( keyed( { [ 10 ]: 10 }, grow( '10' ) ) ).to.eql( { '10': 11 } );
			expect( keyed( { [ 10 ]: 10 }, grow( 10 ) ) ).to.eql( { '10': 11 } );
			expect( keyed( { '10': 10 }, grow( 10 ) ) ).to.eql( { '10': 11 } );
		} );

		it( 'should return without changes if no actual changes occur', () => {
			const keyed = keyedReducer( 'name', age );
			expect( keyed( prevState, { type: 'STAY', name: 'Bonobo' } ) ).to.equal( prevState );
		} );

		it( 'should not initialize a state if no changes and not keyed (simple state)', () => {
			const keyed = keyedReducer( 'name', age );
			expect( keyed( prevState, { type: 'STAY', name: 'Calypso' } ) ).to.equal( prevState );
		} );

		it( 'should pass along SERIALIZE actions to items in collection', () => {
			const serializing = ( state = 0, { type } ) => {
				if ( SERIALIZE === type ) {
					return `age:${ state }`;
				}

				return 'GROW' === type
					? state + 1
					: state;
			};
			const keyed = keyedReducer( 'name', serializing );

			expect( keyed( prevState, { type: SERIALIZE } ) ).to.eql( { Bonobo: 'age:13' } );
		} );

		it( 'should return initial state on DESERIALIZE if no deserializer given', () => {
			const keyed = keyedReducer( 'name', age );

			expect( keyed( undefined, { type: DESERIALIZE } ) ).to.eql( {} );
			expect( keyed( prevState, { type: DESERIALIZE } ) ).to.eql( {} );
		} );

		it( 'should pass along DESERIALIZE actions to items in collection', () => {
			const deserializing = ( state = 0, { type } ) => {
				if ( DESERIALIZE === type ) {
					// age:1 -> 1
					return parseInt( state.slice( 4 ), 10 );
				}

				return 'GROW' === type
					? state + 1
					: state;
			};
			const keyed = keyedReducer( 'name', deserializing, { deserializer: ( state, mapper ) => mapper( state ) } );

			expect( keyed( { Bonobo: 'age:13' }, { type: DESERIALIZE } ) ).to.eql( { Bonobo: 13 } );
		} );

		it( 'should serialize entire collection if serializer given', () => {
			const serializing = ( state = 0, { type } ) =>
				SERIALIZE === type
					? state * 2
					: state;
			const ageSum = ( o, mapper ) => sum( values( mapper( o ) ) );
			const keyed = keyedReducer( 'name', serializing, { serializer: ageSum } );

			expect( keyed( {
				Bonobo: 13,
				Lemur: 5,
			}, { type: SERIALIZE } ) ).to.equal( 26 + 10 );
		} );

		it( 'should deserialize entire collection if deserializer given', () => {
			const deserializing = ( state = 0, { type } ) =>
				DESERIALIZE === type
					? state * 2
					: state;

			const stored = '{"Bonobo":13}';
			const unpack = ( s, mapper ) => mapper( JSON.parse( s ) );
			const keyed = keyedReducer( 'name', deserializing, { deserializer: unpack } );

			expect( keyed( stored, { type: DESERIALIZE } ) ).to.eql( { Bonobo: 26 } );
		} );

		it( 'should not pass through deserialization if not intended', () => {
			const deserializing = ( state = 0, { type } ) =>
				DESERIALIZE === type
					? state * 2
					: state;

			const custom = keyedReducer( 'name', deserializing, { deserializer: state => state } );
			expect( custom( prevState, { type: DESERIALIZE } ) ).to.equal( prevState );
		} );

		it( 'should not pass through serialization if not intended', () => {
			const serializing = ( state = 0, { type } ) =>
				SERIALIZE === type
					? state * 2
					: state;

			const serialized = keyedReducer( 'name', serializing );
			expect( serialized( { Bonobo: 13 }, { type: SERIALIZE } ) ).to.eql( { Bonobo: 26 } );

			const custom = keyedReducer( 'name', serializing, { serializer: state => state } );
			expect( custom( prevState, { type: SERIALIZE } ) ).to.equal( prevState );
		} );
	} );

	describe( '#withSchemaValidation', () => {
		const load = { type: DESERIALIZE };
		const normal = { type: 'NORMAL' };
		const schema = {
			type: 'number',
			minimum: 0,
		};

		const age = ( state = 0, action ) =>
			'GROW' === action.type
				? state + 1
				: state;

		it( 'should invalidate DESERIALIZED state', () => {
			const validated = withSchemaValidation( schema, age );

			expect( validated( -5, load ) ).to.equal( 0 );
		} );

		it( 'should not invalidate normal state', () => {
			const validated = withSchemaValidation( schema, age );

			expect( validated( -5, normal ) ).to.equal( -5 );
		} );

		it( 'should validate initial state', () => {
			const validated = withSchemaValidation( schema, age );

			expect( validated( 5, load ) ).to.equal( 5 );
		} );
	} );
} );
