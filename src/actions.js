import {
  graphql, formatMutation, formatPageQueryWithCount, graphqlWithVariables, formatGQLString,
} from '@openimis/fe-core';
import {
  CLEAR, ERROR, REQUEST, SUCCESS, VALID,
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
  'code',
  'startDate',
  'endDate',
  'status',
];

function formatPaymentCycleGQL(paymentCycle) {
  return `
    ${paymentCycle?.id ? `id: "${paymentCycle.id}"` : ''}
    ${paymentCycle?.code ? `code: "${formatGQLString(paymentCycle.code)}"` : ''}
    ${paymentCycle?.startDate ? `startDate: "${formatGQLString(paymentCycle.startDate)}"` : ''}
    ${paymentCycle?.endDate ? `endDate: "${formatGQLString(paymentCycle.endDate)}"` : ''}
    ${paymentCycle?.status ? `status: ${formatGQLString(paymentCycle.status)}` : ''}`;
}

export function createPaymentCycle(paymentCycle, clientMutationLabel) {
  const mutation = formatMutation(
    MUTATION_SERVICE.PAYMENT_CYCLE.CREATE,
    formatPaymentCycleGQL(paymentCycle),
    clientMutationLabel,
  );
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.CREATE_PAYMENT_CYCLE), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.CREATE_PAYMENT_CYCLE,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function updatePaymentCycle(paymentCycle, clientMutationLabel) {
  const mutation = formatMutation(
    MUTATION_SERVICE.PAYMENT_CYCLE.UPDATE,
    formatPaymentCycleGQL(paymentCycle),
    clientMutationLabel,
  );
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.UPDATE_PAYMENT_CYCLE), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.CREATE_PAYMENT_CYCLE,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function fetchPaymentCycles(modulesManager, params) {
  const payload = formatPageQueryWithCount('paymentCycle', params, PAYMENT_CYCLE_FULL_PROJECTION());
  return graphql(payload, ACTION_TYPE.SEARCH_PAYMENT_CYCLES);
}

export function fetchPaymentCycle(modulesManager, variables) {
  return graphqlWithVariables(
    `
    query getPaymentCycle ($paymentCycleUuid: ID ) {
      paymentCycle(id: $paymentCycleUuid) {
        edges {
          node {
            id,
            code,
            startDate,
            endDate,
            status,
          }
        }
      }
    }
      `,
    variables,
    ACTION_TYPE.GET_PAYMENT_CYCLE,
  );
}

export const clearPaymentCycle = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GET_PAYMENT_CYCLE),
  });
};

export function fetchPaymentCycleBills(params) {
  const payload = formatPageQueryWithCount('bill', params, BILL_FULL_PROJECTION);
  return graphql(payload, ACTION_TYPE.GET_PAYMENT_CYCLE_BILLS);
}

export const clearPaymentCycleBills = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GET_PAYMENT_CYCLE_BILLS),
  });
};

export function codeValidationCheck(mm, variables) {
  return graphqlWithVariables(
    `
    query ($code: String!) {
      paymentCycleCodeValidity(code: $code) {
        isValid
        errorCode
        errorMessage
      }
    }
    `,
    variables,
    ACTION_TYPE.PAYMENT_CYCLE_CODE_VALIDATION_FIELDS,
  );
}

export function codeSetValid() {
  return (dispatch) => {
    dispatch({ type: VALID(ACTION_TYPE.PAYMENT_CYCLE_CODE_VALIDATION_FIELDS) });
  };
}

export function codeValidationClear() {
  return (dispatch) => {
    dispatch({ type: CLEAR(ACTION_TYPE.PAYMENT_CYCLE_CODE_VALIDATION_FIELDS) });
  };
}
