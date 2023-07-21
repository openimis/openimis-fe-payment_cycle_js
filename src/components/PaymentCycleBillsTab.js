import React from 'react';
import { Tab } from '@material-ui/core';
import { PublishedComponent, useTranslations } from '@openimis/fe-core';
import { MODULE_NAME, PAYMENT_CYCLE_BILLS_LIST_TAB_VALUE } from '../constants';
import getBillSearcher from '../contributions/getBillSearcher';

function PaymentCycleBillsTabLabel({
  onChange, tabStyle, isSelected, modulesManager,
}) {
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  return (
    <Tab
      onChange={onChange}
      className={tabStyle(PAYMENT_CYCLE_BILLS_LIST_TAB_VALUE)}
      selected={isSelected(PAYMENT_CYCLE_BILLS_LIST_TAB_VALUE)}
      value={PAYMENT_CYCLE_BILLS_LIST_TAB_VALUE}
      label={formatMessage('PaymentCycleBillsTab.label')}
    />
  );
}

function PaymentCycleBillsTabPanel({ value, rights }) {
  const { BillSearcher } = getBillSearcher();
  return (
    <PublishedComponent
      pubRef="policyHolder.TabPanel"
      module="paymentCycle"
      index={PAYMENT_CYCLE_BILLS_LIST_TAB_VALUE}
      value={value}
    >
      <BillSearcher rights={rights} />
    </PublishedComponent>
  );
}

export { PaymentCycleBillsTabLabel, PaymentCycleBillsTabPanel };
