import React from 'react';
import { bindActionCreators } from 'redux';
import { connect, useSelector } from 'react-redux';

import { IconButton, Tooltip } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';

import {
  Searcher, useHistory, useModulesManager, useTranslations, PublishedComponent,
} from '@openimis/fe-core';
import { fetchPaymentCycles } from '../actions';
import {
  DEFAULT_PAGE_SIZE,
  PAYMENT_CYCLE_ROUTE_PAYMENT_CYCLES_PAYMENT_CYCLE,
  RIGHT_PAYMENT_CYCLE_SEARCH,
  ROWS_PER_PAGE_OPTIONS,
} from '../constants';
import PaymentCycleFilter from './PaymentCycleFilter';
import PaymentCycleStatusPicker from '../pickers/PaymentCycleStatusPicker';

function PaymentCycleSearcher({
  fetchingPaymentCycles,
  fetchedPaymentCycles,
  fetchPaymentCycles,
  errorPaymentCycles,
  paymentCycles,
  paymentCyclesPageInfo,
  paymentCyclesTotalCount,
}) {
  const history = useHistory();
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues } = useTranslations('paymentCycle', modulesManager);
  const rights = useSelector((store) => store.core.user.i_user.rights ?? []);

  const headers = () => [
    'paymentCycle.code',
    'paymentCycle.startDate',
    'paymentCycle.endDate',
    'paymentCycle.status',
    'emptyLabel',
  ];
  const sorts = () => [
    ['startDate', true],
    ['endDate', true],
  ];

  const fetch = (params) => fetchPaymentCycles(modulesManager, params);

  const rowIdentifier = (paymentCycle) => paymentCycle.id;
  const openPaymentCycle = (paymentCycle) => rights.includes(RIGHT_PAYMENT_CYCLE_SEARCH) && history.push(
    `/${modulesManager.getRef(PAYMENT_CYCLE_ROUTE_PAYMENT_CYCLES_PAYMENT_CYCLE)}/${paymentCycle?.id}`,
  );

  const itemFormatters = () => [
    (paymentCycle) => paymentCycle?.code,
    (paymentCycle) => (
      <PublishedComponent
        pubRef="core.DatePicker"
        value={paymentCycle?.startDate}
        readOnly
      />
    ),
    (paymentCycle) => (
      <PublishedComponent
        pubRef="core.DatePicker"
        value={paymentCycle?.endDate}
        readOnly
      />
    ),
    (paymentCycle) => (
      <PaymentCycleStatusPicker
        value={paymentCycle?.status}
        required
        readOnly
      />
    ),
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

  const onDoubleClick = (paymentCycle) => openPaymentCycle(paymentCycle);

  const paymentCycleFilter = ({ filters, onChangeFilters }) => (
    <PaymentCycleFilter filters={filters} onChangeFilters={onChangeFilters} formatMessage={formatMessage} />
  );

  return (
    <Searcher
      module="paymentCycle"
      FilterPane={paymentCycleFilter}
      fetch={fetch}
      items={paymentCycles}
      itemsPageInfo={paymentCyclesPageInfo}
      fetchedItems={fetchedPaymentCycles}
      fetchingItems={fetchingPaymentCycles}
      errorItems={errorPaymentCycles}
      tableTitle={formatMessageWithValues('paymentCycle.searcherResultsTitle', { paymentCyclesTotalCount })}
      headers={headers}
      itemFormatters={itemFormatters}
      sorts={sorts}
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      defaultPageSize={DEFAULT_PAGE_SIZE}
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
