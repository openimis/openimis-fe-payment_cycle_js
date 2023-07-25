import {
  graphql, formatMutation, formatPageQueryWithCount, graphqlWithVariables,
} from '@openimis/fe-core';
import {
  CLEAR, ERROR, REQUEST, SUCCESS,
} from './utils/action-type';
import { ACTION_TYPE, MUTATION_SERVICE } from './reducer';

const BILL_FULL_PROJECTION = [
  'id',
  'isDeleted',
  'jsonExt',
  'dateCreated',
  'dateUpdated',
  'dateValidFrom',
  'dateValidTo',
  'replacementUuid',
  'thirdpartyType',
  'thirdpartyTypeName',
  'thirdpartyId',
  'thirdparty',
  'codeTp',
  'code',
  'codeExt',
  'dateDue',
  'datePayed',
  'amountDiscount',
  'amountNet',
  'amountTotal',
  'taxAnalysis',
  'status',
  'currencyTpCode',
  'currencyCode',
  'note',
  'terms',
  'paymentReference',
  'subjectType',
  'subjectTypeName',
  'subjectId',
  'subject',
  'dateBill',
];

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

export function fetchPaymentCycle(modulesManager, variables) {
  return graphqlWithVariables(
    `
    query getPaymentCycle ($paymentCycleUuid: String ) {
      paymentCycle(id: $paymentCycleUuid) {
        edges {
          node {
            id,
            runYear,
            runMonth,
          }
        }
      }
    }
      `,
    variables,
    ACTION_TYPE.GET_PAYMENT_CYCLE,
  );
}

export const clearPaymentCycle = (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GET_PAYMENT_CYCLE),
  });
};

export function fetchPaymentCycleBills(params) {
  const payload = formatPageQueryWithCount('bill', params, BILL_FULL_PROJECTION);
  return graphql(payload, ACTION_TYPE.GET_PAYMENT_CYCLE_BILLS);
}
