/* eslint-disable default-param-last */

import {
  dispatchMutationErr,
  dispatchMutationReq,
  dispatchMutationResp,
  formatGraphQLError,
  formatServerError,
  pageInfo,
  parseData,
  decodeId,
} from '@openimis/fe-core';
import { ENUM_PREFIX_LENGTH } from './constants';
import {
  CLEAR,
  ERROR, REQUEST, SUCCESS, VALID,
} from './utils/action-type';

export const ACTION_TYPE = {
  MUTATION: 'PAYMENT_CYCLE_MUTATION',
  SEARCH_PAYMENT_CYCLES: 'PAYMENT_CYCLE_PAYMENT_CYCLES',
  GET_PAYMENT_CYCLE: 'PAYMENT_CYCLE_PAYMENT_CYCLE',
  CREATE_PAYMENT_CYCLE: 'PAYMENT_CYCLE_CREATE_PAYMENT_CYCLE',
  UPDATE_PAYMENT_CYCLE: 'PAYMENT_CYCLE_UPDATE_PAYMENT_CYCLE',
  GET_PAYMENT_CYCLE_BILLS: 'PAYMENT_CYCLE_PAYMENT_CYCLE_BILLS',
  PAYMENT_CYCLE_CODE_VALIDATION_FIELDS: 'PAYMENT_CYCLE_CODE_VALIDATION_FIELDS',
  GET_DEDUPLICATION_BENEFIT_SUMMARY: 'PAYMENT_CYCLE_DEDUPLICATION_BENEFIT_SUMMARY',
  FETCH_GLOBAL_SCHEMA: 'PAYMENT_CYCLE_GLOBAL_SCHEMA',
};

export const MUTATION_SERVICE = {
  PAYMENT_CYCLE: {
    CREATE: 'createPaymentCycle',
    UPDATE: 'updatePaymentCycle',
  },
};

const getEnumValue = (enumElement) => enumElement?.substring(ENUM_PREFIX_LENGTH);

const STORE_STATE = {
  submittingMutation: false,
  mutation: {},
  fetchingPaymentCycles: false,
  fetchedPaymentCycles: false,
  errorPaymentCycles: null,
  paymentCycles: [],
  paymentCyclesPageInfo: {},
  paymentCyclesTotalCount: 0,
  fetchingPaymentCycle: false,
  fetchedPaymentCycle: false,
  paymentCycle: null,
  errorPaymentCycle: null,
  fetchingPaymentCycleBills: true,
  fetchedPaymentCycleBills: false,
  paymentCycleBills: [],
  errorPaymentCycleBills: null,
  paymentCyclesBillsPageInfo: {},
  paymentCyclesBillsTotalCount: 0,
  fetchingDeduplicationBenefitSummary: false,
  errorDeduplicationBenefitSummary: null,
  fetchedDeduplicationBenefitSummary: false,
  deduplicationBenefitSummary: [],
  fetchingGlobalSchema: false,
  fetchedGlobalSchema: false,
  globalSchema: null,
  errorGlobalSchema: null,
};

function reducer(
  state = STORE_STATE,
  action,
) {
  switch (action.type) {
    case REQUEST(ACTION_TYPE.SEARCH_PAYMENT_CYCLES):
      return {
        ...state,
        fetchingPaymentCycles: false,
        fetchedPaymentCycles: false,
        paymentCycles: [],
        errorPaymentCycles: null,
        paymentCyclesPageInfo: {},
        paymentCyclesTotalCount: 0,
        paymentCycle: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_PAYMENT_CYCLES):
      return {
        ...state,
        paymentCycles: parseData(action.payload.data.paymentCycle)?.map((paymentCycle) => ({
          ...paymentCycle,
          id: decodeId(paymentCycle.id),
        })),
        fetchingPaymentCycles: false,
        errorPaymentCycles: formatGraphQLError(action.payload),
        fetchedPaymentCycles: true,
        paymentCyclesPageInfo: pageInfo(action.payload.data.paymentCycle),
        paymentCyclesTotalCount: action.payload.data.paymentCycle?.totalCount ?? 0,
      };
    case ERROR(ACTION_TYPE.SEARCH_PAYMENT_CYCLES):
      return {
        ...state,
        fetchingPaymentCycles: false,
        errorPaymentCycles: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.GET_PAYMENT_CYCLE):
      return {
        ...state,
        fetchingPaymentCycle: true,
        fetchedPaymentCycle: false,
        paymentCycle: null,
        errorPaymentCycle: null,
      };
    case SUCCESS(ACTION_TYPE.GET_PAYMENT_CYCLE):
      return {
        ...state,
        fetchingPaymentCycle: false,
        fetchedPaymentCycle: true,
        paymentCycle: parseData(action.payload.data.paymentCycle)?.map((paymentCycle) => ({
          ...paymentCycle,
          id: decodeId(paymentCycle.id),
        }))?.[0],
        errorPaymentCycle: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.GET_PAYMENT_CYCLE):
      return {
        ...state,
        fetchingPaymentCycle: false,
        errorPaymentCycle: formatServerError(action.payload),
      };
    case CLEAR(ACTION_TYPE.GET_PAYMENT_CYCLE):
      return {
        ...state,
        fetchingPaymentCycle: true,
        fetchedPaymentCycle: false,
        paymentCycle: null,
        errorPaymentCycle: null,
      };
    case REQUEST(ACTION_TYPE.GET_PAYMENT_CYCLE_BILLS):
      return {
        ...state,
        fetchingPaymentCycleBills: true,
        fetchedPaymentCycleBills: false,
        paymentCycleBills: [],
        errorPaymentCycleBills: null,
      };
    case SUCCESS(ACTION_TYPE.GET_PAYMENT_CYCLE_BILLS):
      return {
        ...state,
        fetchingPaymentCycleBills: false,
        fetchedPaymentCycleBills: true,
        paymentCycleBills: parseData(action.payload.data.bill)?.map((bill) => ({
          ...bill,
          id: decodeId(bill.id),
          status: getEnumValue(bill?.status),
        })),
        errorPaymentCycleBills: formatGraphQLError(action.payload),
        paymentCyclesBillsPageInfo: pageInfo(action.payload.data.bill),
        paymentCyclesBillsTotalCount: action.payload.data.bill?.totalCount ?? 0,
      };
    case ERROR(ACTION_TYPE.GET_PAYMENT_CYCLE_BILLS):
      return {
        ...state,
        fetchingPaymentCycleBills: false,
        errorPaymentCycleBills: formatServerError(action.payload),
      };
    case CLEAR(ACTION_TYPE.GET_PAYMENT_CYCLE_BILLS):
      return {
        ...state,
        fetchingPaymentCycleBills: true,
        fetchedPaymentCycleBills: false,
        paymentCycleBills: [],
        errorPaymentCycleBills: null,
      };
    case REQUEST(ACTION_TYPE.PAYMENT_CYCLE_CODE_VALIDATION_FIELDS):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          paymentCycleCode: {
            isValidating: true,
            isValid: false,
            validationErrorMessage: null,
            validationError: null,
          },
        },
      };
    case SUCCESS(ACTION_TYPE.PAYMENT_CYCLE_CODE_VALIDATION_FIELDS):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          paymentCycleCode: {
            isValidating: false,
            isValid: action.payload?.data.paymentCycleCodeValidity.isValid,
            validationErrorMessage: action.payload?.data.paymentCycleCodeValidity.errorMessage,
            validationError: formatGraphQLError(action.payload),
          },
        },
      };
    case ERROR(ACTION_TYPE.PAYMENT_CYCLE_CODE_VALIDATION_FIELDS):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          paymentCycleCode: {
            isValidating: false,
            isValid: false,
            validationError: formatServerError(action.payload),
          },
        },
      };
    case CLEAR(ACTION_TYPE.PAYMENT_CYCLE_CODE_VALIDATION_FIELDS):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          paymentCycleCode: {
            isValidating: false,
            isValid: false,
            validationErrorMessage: null,
            validationError: null,
          },
        },
      };
    case VALID(ACTION_TYPE.PAYMENT_CYCLE_CODE_VALIDATION_FIELDS):
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          paymentCycleCode: {
            isValidating: false,
            isValid: true,
            validationErrorMessage: null,
            validationError: null,
          },
        },
      };
    case REQUEST(ACTION_TYPE.GET_DEDUPLICATION_BENEFIT_SUMMARY):
      return {
        ...state,
        fetchingDeduplicationBenefitSummary: true,
        fetchedDeduplicationBenefitSummary: false,
        deduplicationBenefitSummary: null,
      };
    case SUCCESS(ACTION_TYPE.GET_DEDUPLICATION_BENEFIT_SUMMARY):
      return {
        ...state,
        fetchingDeduplicationBenefitSummary: false,
        fetchedDeduplicationBenefitSummary: true,
        deduplicationBenefitSummary: action.payload.data.benefitDeduplicationSummary.rows?.map((row) => ({
          ...row,
        })),
        errorDeduplicationBenefitSummary: null,
      };
    case ERROR(ACTION_TYPE.GET_DEDUPLICATION_BENEFIT_SUMMARY):
      return {
        ...state,
        fetchingDeduplicationBenefitSummary: false,
        errorDeduplicationBenefitSummary: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.FETCH_GLOBAL_SCHEMA):
      return {
        ...state,
        fetchingGlobalSchema: true,
        fetchedGlobalSchema: false,
        globalSchema: null,
        errorGlobalSchema: null,
      };
    case SUCCESS(ACTION_TYPE.FETCH_GLOBAL_SCHEMA):
      return {
        ...state,
        fetchingGlobalSchema: false,
        fetchedGlobalSchema: true,
        globalSchema: action.payload.data.globalSchema.schema,
        errorGlobalSchema: null,
      };
    case ERROR(ACTION_TYPE.FETCH_GLOBAL_SCHEMA):
      return {
        ...state,
        fetchingGlobalSchema: false,
        errorGlobalSchema: formatServerError(action.payload),
      };
    case CLEAR(ACTION_TYPE.FETCH_GLOBAL_SCHEMA):
      return {
        ...state,
        fetchingGlobalSchema: false,
        fetchedGlobalSchema: false,
        globalSchema: null,
        errorGlobalSchema: null,
      };
    case REQUEST(ACTION_TYPE.MUTATION):
      return dispatchMutationReq(state, action);
    case SUCCESS(ACTION_TYPE.CREATE_PAYMENT_CYCLE):
      return dispatchMutationResp(state, MUTATION_SERVICE.PAYMENT_CYCLE.CREATE, action);
    case SUCCESS(ACTION_TYPE.UPDATE_PAYMENT_CYCLE):
      return dispatchMutationResp(state, MUTATION_SERVICE.PAYMENT_CYCLE.UPDATE, action);
    case ERROR(ACTION_TYPE.MUTATION):
      return dispatchMutationErr(state, action);
    default:
      return state;
  }
}

export default reducer;
