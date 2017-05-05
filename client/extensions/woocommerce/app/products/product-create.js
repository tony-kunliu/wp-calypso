/**
 * External dependencies
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { getCurrentlyEditingProduct } from '../../state/ui/products/selectors';
import { editProduct, editProductAttribute } from '../../state/ui/products/actions';
import ProductForm from './product-form';
import ProductHeader from './product-header';

class ProductCreate extends Component {

	componentDidMount() {
		const { product } = this.props;

		if ( ! product ) {
			this.props.editProduct( null, {
				type: 'simple'
			} );
		}
	}

	componentWillUnmount() {
		// TODO: Remove the product we added here from the edit state.
	}

	onTrash = () => {
		// TODO: Add action dispatch to trash this product.
	}

	onDuplicate = () => {
		// TODO: Add action dispatch to duplicate this product.
	}

	onSave = () => {
		// TODO: Add action dispatch to save this product.
	}

	render() {
		const { product } = this.props;

		return (
			<div className="woocommerce products__page">
				<ProductHeader
					onTrash={ this.onTrash }
					onDuplicate={ this.onDuplicate }
					onSave={ this.onSave }
				/>
				<ProductForm
					product={ product || { type: 'simple' } }
					editProduct={ this.props.editProduct }
					editProductAttribute={ this.props.editProductAttribute }
				/>
			</div>
		);
	}
}

function mapStateToProps( state ) {
	const product = getCurrentlyEditingProduct( state );

	return {
		product,
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			editProduct,
			editProductAttribute,
		},
		dispatch
	);
}

export default connect( mapStateToProps, mapDispatchToProps )( ProductCreate );
