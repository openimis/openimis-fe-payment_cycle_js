/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Contributions } from '@openimis/fe-core';
import { PAYMENT_CYCLE_BILL_SEARCHER } from '../constants';

function BillSearcher(props) {
  return (
    <Contributions
      contributionKey={PAYMENT_CYCLE_BILL_SEARCHER}
      {...props}
    />
  );
}

const getBillSearcher = () => ({ BillSearcher });

export default getBillSearcher;
