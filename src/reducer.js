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
import {
    CLEAR, ERROR, REQUEST, SUCCESS,
} from './utils/action-type';

export const ACTION_TYPE = {
    MUTATION: 'PAYMENT_CYCLE_MUTATION',
    SEARCH_PAYMENT_CYCLES: 'PAYMENT_CYCLE_PAYMENT_CYCLES',
    GET_PAYMENT_CYCLE: 'PAYMENT_CYCLE_PAYMENT_CYCLE',
    GENERATE_PAYMENT_CYCLE: 'PAYMENT_CYCLE_GENERATE_PAYMENT_CYCLE',
};

export const MUTATION_SERVICE = {
    PAYMENT_CYCLE: {
        CREATE: 'generatePaymentCycle',
    }
};

const STORE_STATE = {
    submittingMutation: false,
    mutation: {},
};

function reducer(
    state = STORE_STATE,
    action,
) {
    switch (action.type) {
        case REQUEST(ACTION_TYPE.MUTATION):
            return dispatchMutationReq(state, action);
        case SUCCESS(ACTION_TYPE.GENERATE_PAYMENT_CYCLE):
            return dispatchMutationResp(state, "generatePaymentCycle", action)
        case ERROR(ACTION_TYPE.MUTATION):
            return dispatchMutationErr(state, action);
        default:
            return state;
    }
}

export default reducer;
