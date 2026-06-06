/* eslint-disable import/prefer-default-export */
/* eslint-disable camelcase */

import React from 'react';


import { GetIconComponent, FormattedMessage } from '@openimis/fe-core';
import { RIGHT_PAYMENT_CYCLE_SEARCH } from './constants';
import reducer from './reducer';
import messages_en from './translations/en.json';
import PaymentCyclesPage from './pages/PaymentCyclesPage';
import PaymentCyclePage from './pages/PaymentCyclePage';
import PaymentCyclePicker from './pickers/PaymentCyclePicker';
import { PaymentCycleTaskItemFormatters, PaymentCycleTaskTableHeaders } from './components/tasks/PaymentCycleTasks';
import { PaymentCycleTaskTabLabel, PaymentCycleTaskTabPanel } from './components/PaymentCycleTaskTabPanel';
import { PaymentCycleBenefitsTabLabel, PaymentCycleBenefitsTabPanel } from './components/PaymentCycleBenefitsTabPanel';
import DeduplicationFieldSelectionDialog from './components/dialogs/DeduplicationFieldSelectionDialog';
import {
  DeduplicationPaymentResolutionItemFormatters,
  DeduplicationPaymentResolutionTaskTableHeaders,
} from './components/tasks/DeduplicationPaymentResolutionTask';
const LocalOfferIcon = GetIconComponent("LocalOffer");

const ROUTE_PAYMENT_CYCLES = 'paymentCycles';
const ROUTE_PAYMENT_CYCLE = 'paymentCycles/paymentCycle';

const DEFAULT_CONFIG = {
  translations: [{ key: 'en', messages: messages_en }],
  'paymentCycle.deduplicationFieldSelectionDialog': [
    DeduplicationFieldSelectionDialog,
  ],
  reducers: [{ key: 'paymentCycle', reducer }],
  refs: [
    { key: 'paymentCycle.route.paymentCycles', ref: ROUTE_PAYMENT_CYCLES },
    { key: 'paymentCycle.route.paymentCycle', ref: ROUTE_PAYMENT_CYCLE },
    { key: 'paymentCycle.PaymentCyclePicker', ref: PaymentCyclePicker },
  ],
  'core.Router': [
    { path: ROUTE_PAYMENT_CYCLES, text: "paymentCycle.paymentCycles.page.title", icon: "LocalOfferIcon",rights: [RIGHT_PAYMENT_CYCLE_SEARCH], id: 'legalAndFinance.paymentCycles', component: PaymentCyclesPage },
    { path: `${ROUTE_PAYMENT_CYCLE}/:payment_cycle_uuid?`, component: PaymentCyclePage },
  ],
  'invoice.MainMenu': [
    {
      route: ROUTE_PAYMENT_CYCLES,
      
    },
  ],
  'paymentCycle.TabPanel.label': [PaymentCycleBenefitsTabLabel, PaymentCycleTaskTabLabel],
  'paymentCycle.TabPanel.panel': [PaymentCycleBenefitsTabPanel, PaymentCycleTaskTabPanel],
  'tasksManagement.tasks': [{
    text: "paymentCycle.paymentCycle.tasks.update.title",
    tableHeaders: PaymentCycleTaskTableHeaders,
    itemFormatters: PaymentCycleTaskItemFormatters,
    taskSource: ['PaymentCycleService'],
  },
  {
    text: "paymentCycle.tasks.deduplication.title",
    tableHeaders: DeduplicationPaymentResolutionTaskTableHeaders,
    itemFormatters: DeduplicationPaymentResolutionItemFormatters,
    taskSource: ['CreateDeduplicationPaymentReviewTasksService'],
  }],
};

export const PaymentCycleModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
