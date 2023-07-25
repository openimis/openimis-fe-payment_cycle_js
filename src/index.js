/* eslint-disable import/prefer-default-export */
/* eslint-disable camelcase */

import React from 'react';
import { FormattedMessage } from '@openimis/fe-core';
import { LocalOffer } from '@material-ui/icons';
import messages_en from './translations/en.json';
import reducer from './reducer';
// import { RIGHT_PAYMENT_CYCLE_SEARCH } from './constants';
import PaymentCyclesPage from './pages/PaymentCyclesPage';
import PaymentCyclePage from './pages/PaymentCyclePage';
import { PaymentCycleBillsTabLabel, PaymentCycleBillsTabPanel } from './components/PaymentCycleBillsTab';

const ROUTE_PAYMENT_CYCLES = 'paymentCycles';
const ROUTE_PAYMENT_CYCLE = 'paymentCycles/paymentCycle';

const DEFAULT_CONFIG = {
  translations: [{ key: 'en', messages: messages_en }],
  reducers: [{ key: 'paymentCycle', reducer }],
  refs: [
    { key: 'paymentCycle.route.paymentCycles', ref: ROUTE_PAYMENT_CYCLES },
    { key: 'paymentCycle.route.paymentCycle', ref: ROUTE_PAYMENT_CYCLE },
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
      // filter: rights => rights.includes(RIGHT_PAYMENT_CYCLE_SEARCH)
    },
  ],
  'paymentCycle.TabPanel.label': [PaymentCycleBillsTabLabel],
  'paymentCycle.TabPanel.panel': [PaymentCycleBillsTabPanel],
};

export const PaymentCycleModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
