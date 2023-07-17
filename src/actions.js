import {
    graphql, formatMutation, formatPageQueryWithCount
} from "@openimis/fe-core";
import {ERROR, REQUEST, SUCCESS} from "./utils/action-type";
import {ACTION_TYPE} from "./reducer";

const PAYMENT_CYCLE_FULL_PROJECTION = () => [
    'id'
];
export const generatePaymentCycle = (filters, clientMutationLabel, clientMutationDetails = null) => {
    const {month, year} = filters;
    let input = `
    month: ${month}
    year: ${year}
  `
    let mutation = formatMutation("generatePaymentCycle", input, clientMutationLabel, clientMutationDetails);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.GENERATE_PAYMENT_CYCLE), ERROR(ACTION_TYPE.MUTATION)],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            clientMutationDetails: !!clientMutationDetails ? JSON.stringify(clientMutationDetails) : null,
            requestedDateTime
        }
    )
}

export function fetchPaymentCycles(modulesManager, params) {
    const payload = formatPageQueryWithCount('paymentCycle', params, PAYMENT_CYCLE_FULL_PROJECTION());
    return graphql(payload, ACTION_TYPE.SEARCH_PAYMENT_CYCLES);
}