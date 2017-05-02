/*
 This codemod updates

 import { combineReducers } from 'redux'; to
 import { combineReducersWithPersistence } from 'state/utils';

 and updates

 combineReducers( {
    //...
 } )

 with

 combineReducersWithPersistence( {
    //...
 } )
 */

module.exports = function(file, api) {
	// alias the jscodeshift API
	const j = api.jscodeshift;
	// parse JS code into an AST
	const root = j( file.source );

	const renameLiteral = ( newName ) => source => {
		j( source ).replaceWith(() => j.literal( newName ));
	};

	const renameIdentifier = ( newName) => imported => {
		j( imported ).replaceWith( () => j.identifier( newName ) );
	};

	const filterCombineReducer = ( importDeclaration ) => {
		if ( importDeclaration.value.source.value === 'redux' && importDeclaration.value.specifiers.length === 1 ) {
			return importDeclaration.value.specifiers[0].imported.name === 'combineReducers';
		}
		return false;
	};

	const importDeclarations = root.find(j.ImportDeclaration).filter( filterCombineReducer );
	importDeclarations.find(j.Identifier).forEach( renameIdentifier( 'combineReducersWithPersistence' ) );
	importDeclarations.find(j.Literal).forEach( renameLiteral(  'state/utils' ) );

	const combineReducerIdentifier = root.find( j.ExportDefaultDeclaration ).find( j.CallExpression ).find( j.Identifier ).filter(
		( identifier ) =>  identifier.value.name === 'combineReducers' && identifier.parentPath.name === 'declaration'
	);

	combineReducerIdentifier.forEach( renameIdentifier('combineReducersWithPersistence') );

	// print
	return root.toSource();
};
