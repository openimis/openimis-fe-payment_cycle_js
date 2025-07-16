import React from 'react';
import { useSelector } from 'react-redux';
import { Tab } from '@material-ui/core';
import { PublishedComponent, useTranslations } from '@openimis/fe-core';
import {
  MODULE_NAME,
  PAYMENT_CYCLE_BENEFITS_TAB_VALUE,
} from '../constants';

function PaymentCycleBenefitsTabLabel({
  onChange, tabStyle, isSelected, modulesManager, paymentCycleUuid,
}) {
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  if (!paymentCycleUuid) {
    return null;
  }
  return (
    <Tab
      onChange={onChange}
      className={tabStyle(PAYMENT_CYCLE_BENEFITS_TAB_VALUE)}
      selected={isSelected(PAYMENT_CYCLE_BENEFITS_TAB_VALUE)}
      value={PAYMENT_CYCLE_BENEFITS_TAB_VALUE}
      label={formatMessage('PaymentCycleBenefitsTab.label')}
    />
  );
}

function PaymentCycleBenefitsTabPanel({ value, paymentCycleUuid }) {
  const rights = useSelector((store) => store?.core?.user?.i_user?.rights ?? []);
  return (
    <PublishedComponent
      pubRef="policyHolder.TabPanel"
      module="paymentCycle"
      index={PAYMENT_CYCLE_BENEFITS_TAB_VALUE}
      value={value}
    >
      {
                paymentCycleUuid && (
                <PublishedComponent
                  pubRef="payroll.benefitConsumptionPayrollSearcher"
                  module="paymentCycle"
                  paymentCycleUuid={paymentCycleUuid}
                  rights={rights}
                  showFilters={false}
                />
                )
            }
    </PublishedComponent>
  );
}

export { PaymentCycleBenefitsTabLabel, PaymentCycleBenefitsTabPanel };
