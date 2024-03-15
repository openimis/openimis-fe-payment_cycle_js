import React from 'react';
import { FormattedMessage } from '@openimis/fe-core';

const PaymentCycleTaskTableHeaders = () => [
  <FormattedMessage module="paymentCycle" id="paymentCycle.code" />,
  <FormattedMessage module="paymentCycle" id="paymentCycle.startDate" />,
  <FormattedMessage module="paymentCycle" id="paymentCycle.endDate" />,
  <FormattedMessage module="paymentCycle" id="paymentCycle.status" />,
];

const PaymentCycleTaskItemFormatters = () => [
  (paymentCycle) => paymentCycle?.code,
  (paymentCycle) => paymentCycle?.startDate,
  (paymentCycle) => paymentCycle?.endDate,
  (paymentCycle) => paymentCycle?.status,
];

export { PaymentCycleTaskTableHeaders, PaymentCycleTaskItemFormatters };
