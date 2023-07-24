import {
  graphql, formatMutation, formatPageQueryWithCount,
} from '@openimis/fe-core';
import { ERROR, REQUEST, SUCCESS } from './utils/action-type';
import { ACTION_TYPE, MUTATION_SERVICE } from './reducer';

const PAYMENT_CYCLE_FULL_PROJECTION = () => [
  'id',
  'runYear',
  'runMonth',
];
export const generatePaymentCycle = (filters, clientMutationLabel, clientMutationDetails = null) => {
  const { month, year } = filters;
  const input = `
    month: ${month}
    year: ${year}
  `;
  const mutation = formatMutation(
    MUTATION_SERVICE.PAYMENT_CYCLE.PROCESS,
    input,
    clientMutationLabel,
    clientMutationDetails,
  );
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.GENERATE_PAYMENT_CYCLE), ERROR(ACTION_TYPE.MUTATION)],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      clientMutationDetails: clientMutationDetails ? JSON.stringify(clientMutationDetails) : null,
      requestedDateTime,
    },
  );
};

export function fetchPaymentCycles(modulesManager, params) {
  const payload = formatPageQueryWithCount('paymentCycle', params, PAYMENT_CYCLE_FULL_PROJECTION());
  return graphql(payload, ACTION_TYPE.SEARCH_PAYMENT_CYCLES);
}

export function fetchPaymentCycle(modulesManager, params) {
  console.log(modulesManager, params);
}

export function clearPaymentCycle() {}
