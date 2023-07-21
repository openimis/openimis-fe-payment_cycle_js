import React from 'react';
import {
  Searcher, useHistory, useModulesManager, useTranslations,
} from '@openimis/fe-core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IconButton, Tooltip } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PaymentCycleFilter from './PaymentCycleFilter';
import {
  DEFAULT_PAGE_SIZE,
  PAYMENT_CYCLE_ROUTE_PAYMENT_CYCLES_PAYMENT_CYCLE,
  RIGHT_PAYMENT_CYCLE_SEARCH,
  ROWS_PER_PAGE_OPTIONS,
} from '../constants';
import { fetchPaymentCycles } from '../actions';

function PaymentCycleSearcher({
  rights,
  //   fetchingPaymentCycles,
  fetchedPaymentCycles,
  fetchPaymentCycles,
  errorPaymentCycles,
  //   paymentCycles,
  paymentCyclesPageInfo,
  paymentCyclesTotalCount,
}) {
  const history = useHistory();
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues } = useTranslations('paymentCycle', modulesManager);

  const headers = () => [
    'taskGroup.id',
    'emptyLabel',
  ];
  const sorts = () => [
    ['id', true],
  ];

  const fetch = (params) => fetchPaymentCycles(modulesManager, params);

  const rowIdentifier = (paymentCycle) => paymentCycle.id;
  const openPaymentCycle = (paymentCycle) => history.push(
    `/${modulesManager.getRef(PAYMENT_CYCLE_ROUTE_PAYMENT_CYCLES_PAYMENT_CYCLE)}/${paymentCycle?.uuid}`,
  );

  const itemFormatters = () => [
    (paymentCycle) => paymentCycle.id,
    (paymentCycle) => (
      <Tooltip title={formatMessage('viewDetailsButton.tooltip')}>
        <IconButton
          onClick={() => openPaymentCycle(paymentCycle)}
        >
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
    ),
  ];

  const onDoubleClick = (paymentCycle) => rights.includes(RIGHT_PAYMENT_CYCLE_SEARCH) && openPaymentCycle(paymentCycle);
  const paymentCycleFilter = ({ filters, onChangeFilters }) => (
    <PaymentCycleFilter filters={filters} onChangeFilters={onChangeFilters} formatMessage={formatMessage} />
  );

  const DUMMY_PAYMENT_CYCLE = [{ uuid: 1, code: 'PC-1' }];

  // TODO: Change fetchingItems and items.

  return (
    <Searcher
      module="paymentCycle"
      FilterPane={paymentCycleFilter}
      fetch={fetch}
      items={DUMMY_PAYMENT_CYCLE}
      itemsPageInfo={paymentCyclesPageInfo}
      fetchedItems={fetchedPaymentCycles}
      fetchingItems={false}
      errorItems={errorPaymentCycles}
      tableTitle={formatMessageWithValues('paymentCycle.searcherResultsTitle', { paymentCyclesTotalCount })}
      headers={headers}
      itemFormatters={itemFormatters}
      sorts={sorts}
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      defaultPageSize={DEFAULT_PAGE_SIZE}
      defaultOrderBy="code"
      rowIdentifier={rowIdentifier}
      onDoubleClick={onDoubleClick}
    />
  );
}

const mapStateToProps = (state) => ({
  fetchingPaymentCycles: state.paymentCycle.fetchingPaymentCycles,
  fetchedPaymentCycles: state.paymentCycle.fetchedPaymentCycles,
  errorPaymentCycles: state.paymentCycle.errorPaymentCycles,
  paymentCycles: state.paymentCycle.paymentCycles,
  paymentCyclesPageInfo: state.paymentCycle.paymentCyclesPageInfo,
  paymentCyclesTotalCount: state.paymentCycle.paymentCyclesTotalCount,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    fetchPaymentCycles,
  },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(PaymentCycleSearcher);
