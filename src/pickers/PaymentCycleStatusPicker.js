import React from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';

import { PAYMENT_CYCLE_STATUS_LIST } from '../constants';

function PaymentCycleStatusPicker(props) {
  const {
    required, withNull, readOnly, onChange, value, nullLabel, withLabel,
  } = props;
  return (
    <ConstantBasedPicker
      module="paymentCycle"
      label="paymentCycle.paymentCycleStatusPicker"
      constants={PAYMENT_CYCLE_STATUS_LIST}
      required={required}
      withNull={withNull}
      readOnly={readOnly}
      onChange={onChange}
      value={value}
      nullLabel={nullLabel}
      withLabel={withLabel}
    />
  );
}

export default PaymentCycleStatusPicker;
