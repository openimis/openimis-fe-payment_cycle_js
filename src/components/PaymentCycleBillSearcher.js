import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { IconButton, Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import {
  Searcher,
  useHistory,
  useModulesManager,
  useTranslations,
  PublishedComponent,
} from '@openimis/fe-core';
import { fetchPaymentCycleBills } from '../actions';
import {
  DEFAULT_PAGE_SIZE,
  GET_SUBJECT_AND_THIRDPARTY_TYPE_PICKER_REF,
  INVOICE_BILL_ROUTE,
  RIGHT_BILL_SEARCH,
  RIGHT_BILL_UPDATE,
  ROWS_PER_PAGE_OPTIONS,
} from '../constants';
import PaymentCycleBillFilter from './PaymentCycleBillFilter';

function PaymentCycleBillSearcher({
  rights,
  paymentCycleUuid,
  fetchPaymentCycleBills,
  fetchingBills,
  fetchedBills,
  errorBills,
  bills,
  billsPageInfo,
  billsTotalCount,
}) {
  const history = useHistory();
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues } = useTranslations('paymentCycle', modulesManager);

  const openBill = (bill) => rights.includes(RIGHT_BILL_SEARCH) && history.push(
    `/${modulesManager.getRef(INVOICE_BILL_ROUTE)}/${bill?.uuid}`,
  );

  const onDoubleClick = (bill) => openBill(bill);

  const fetch = (params) => fetchPaymentCycleBills(params);

  const headers = () => {
    const headers = [
      'bills.subject',
      'bills.thirdparty',
      'bills.code',
      'bills.dateBill',
      'bills.amountTotal',
      'bills.status.label',
    ];
    if (rights.includes(RIGHT_BILL_UPDATE)) {
      headers.push('emptyLabel');
    }
    return headers;
  };

  const getSubjectAndThirdpartyTypePicker = modulesManager.getRef(GET_SUBJECT_AND_THIRDPARTY_TYPE_PICKER_REF);

  const itemFormatters = () => {
    const formatters = [
      (bill) => getSubjectAndThirdpartyTypePicker(modulesManager, bill?.subjectTypeName, bill?.subject),
      (bill) => getSubjectAndThirdpartyTypePicker(modulesManager, bill?.thirdpartyTypeName, bill?.thirdparty),
      (bill) => bill?.code,
      (bill) => bill?.dateBill,
      (bill) => bill?.amountTotal,
      (bill) => (
        <PublishedComponent
          pubRef="invoice.InvoiceStatusPicker"
          module="paymentCycle"
          label="status"
          value={bill?.status}
          readOnly
        />
      ),
    ];
    if (rights.includes(RIGHT_BILL_UPDATE)) {
      formatters.push((bill) => (
        <Tooltip title={formatMessage('tooltip.edit')}>
          <IconButton
            onClick={(e) => e.stopPropagation() && openBill(bill)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      ));
    }
    return formatters;
  };

  const rowIdentifier = (bill) => bill.id;

  const sorts = () => [
    ['subjectType', true],
    ['thirdpartyType', true],
    ['code', true],
    ['dateBill', true],
    ['amountTotal', true],
    ['status', true],
  ];

  const defaultFilters = () => ({
    isDeleted: {
      value: false,
      filter: 'isDeleted: false',
    },
    thirdpartyId: {
      value: paymentCycleUuid,
      filter: `thirdpartyId: "${paymentCycleUuid}"`,
    },
  });

  return (
    <div>
      <Searcher
        module="paymentCycle"
        FilterPane={PaymentCycleBillFilter}
        fetch={fetch}
        items={bills}
        itemsPageInfo={billsPageInfo}
        fetchingItems={fetchingBills}
        fetchedItems={fetchedBills}
        errorItems={errorBills}
        tableTitle={formatMessageWithValues('bills.searcherResultsTitle', { billsTotalCount })}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        rowIdentifier={rowIdentifier}
        onDoubleClick={onDoubleClick}
        defaultFilters={defaultFilters()}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  fetchingBills: state.paymentCycle.fetchingPaymentCycleBills,
  fetchedBills: state.paymentCycle.fetchedPaymentCycleBills,
  errorBills: state.paymentCycle.errorPaymentCycleBills,
  bills: state.paymentCycle.paymentCycleBills,
  billsPageInfo: state.paymentCycle.paymentCyclesBillsPageInfo,
  billsTotalCount: state.paymentCycle.paymentCyclesBillsTotalCount,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  { fetchPaymentCycleBills },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(PaymentCycleBillSearcher);
