/* eslint-disable import/prefer-default-export */
/* eslint-disable camelcase */

import React from 'react';

import { LocalOffer } from '@material-ui/icons';

import { FormattedMessage } from '@openimis/fe-core';
import { RIGHT_PAYMENT_CYCLE_SEARCH } from './constants';
import reducer from './reducer';
import messages_en from './translations/en.json';
import PaymentCyclesPage from './pages/PaymentCyclesPage';
import PaymentCyclePage from './pages/PaymentCyclePage';
import PaymentCyclePicker from './pickers/PaymentCyclePicker';
import { PaymentCycleTaskItemFormatters, PaymentCycleTaskTableHeaders } from './components/tasks/PaymentCycleTasks';
import { PaymentCycleTaskTabLabel, PaymentCycleTaskTabPanel } from './components/PaymentCycleTaskTabPanel';
import { PaymentCycleBenefitsTabLabel, PaymentCycleBenefitsTabPanel } from './components/PaymentCycleBenefitsTabPanel';

const ROUTE_PAYMENT_CYCLES = 'paymentCycles';
const ROUTE_PAYMENT_CYCLE = 'paymentCycles/paymentCycle';

const DEFAULT_CONFIG = {
  translations: [{ key: 'en', messages: messages_en }],
  reducers: [{ key: 'paymentCycle', reducer }],
  refs: [
    { key: 'paymentCycle.route.paymentCycles', ref: ROUTE_PAYMENT_CYCLES },
    { key: 'paymentCycle.route.paymentCycle', ref: ROUTE_PAYMENT_CYCLE },
    { key: 'paymentCycle.PaymentCyclePicker', ref: PaymentCyclePicker },
  ],
  'core.Router': [
    { path: ROUTE_PAYMENT_CYCLES, component: PaymentCyclesPage },
    { path: `${ROUTE_PAYMENT_CYCLE}/:payment_cycle_uuid?`, component: PaymentCyclePage },
  ],
  'invoice.MainMenu': [
    {
      text: <FormattedMessage module="paymentCycle" id="paymentCycles.page.title" />,
      icon: <LocalOffer />,
      route: `/${ROUTE_PAYMENT_CYCLES}`,
      filter: (rights) => rights.includes(RIGHT_PAYMENT_CYCLE_SEARCH),
    },
  ],
  'paymentCycle.TabPanel.label': [PaymentCycleBenefitsTabLabel, PaymentCycleTaskTabLabel],
  'paymentCycle.TabPanel.panel': [PaymentCycleBenefitsTabPanel, PaymentCycleTaskTabPanel],
  'tasksManagement.tasks': [{
    text: <FormattedMessage module="paymentCycle" id="paymentCycle.tasks.update.title" />,
    tableHeaders: PaymentCycleTaskTableHeaders,
    itemFormatters: PaymentCycleTaskItemFormatters,
    taskSource: ['PaymentCycleService'],
  }],
};

export const PaymentCycleModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
