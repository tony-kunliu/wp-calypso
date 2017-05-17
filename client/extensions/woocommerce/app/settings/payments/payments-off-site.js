/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

import { getSelectedSiteId } from 'state/ui/selectors';
import { getPaymentMethodsGroup } from '../../../state/wc-api/settings/payments/selectors';
import { fetchPaymentMethods } from '../../../state/wc-api/settings/payments/actions';

/**
 * Internal dependencies
 */

import ExtendedHeader from '../../../components/extended-header';
import Table from '../../../components/table/table';
import TableHeader from '../../../components/table/table-header';
import TableRowField from '../../../components/table/table-row-field';
import TableRows from '../../../components/table/table-rows';
import PaymentMethodRow from './payment-method-row';

class SettingsPaymentsOffSite extends Component {
	static propTypes = {
		siteId: PropTypes.number.isRequired,
		paymentMethods: PropTypes.array,
		fetchPaymentMethods: PropTypes.func.isRequired,
	};

	componentDidMount() {
		const { siteId } = this.props;
		this.props.fetchPaymentMethods( siteId );
	}

	renderMethodRow = ( method ) => {
		return (
			<PaymentMethodRow key={ method.title } method={ method } />
		);
	}

	render() {
		const { translate, paymentMethods } = this.props;

		return (
			<div>
				<ExtendedHeader
					label={ translate( 'Off-site credit card payment methods' ) }
					description={
						translate(
							'Off-site payment methods involve sending the customer to a ' +
							'third party web site to complete payment, like PayPal. More ' +
							'information'
						)
					} />
					<Table>
						<TableHeader>
							<TableRowField className="payments__methods-column-method">
								{ translate( 'Method' ) }
							</TableRowField>
							<TableRowField className="payments__methods-column-fees">
								{ translate( 'Fees' ) }
							</TableRowField>
							<TableRowField className="payments__methods-column-settings">
							</TableRowField>
						</TableHeader>
						<TableRows>
							{ paymentMethods && paymentMethods.map( this.renderMethodRow ) }
						</TableRows>
					</Table>
			</div>
		);
	}
}

function mapStateToProps( state ) {
	const siteId = getSelectedSiteId( state );
	const paymentMethods = getPaymentMethodsGroup( state, siteId, 'off-site' );
	return {
		paymentMethods,
		siteId,
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			fetchPaymentMethods
		},
		dispatch
	);
}

export default localize( connect( mapStateToProps, mapDispatchToProps )( SettingsPaymentsOffSite ) );
