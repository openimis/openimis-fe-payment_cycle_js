import {
  describe, expect, it, vi,
} from 'vitest';

// fe-core's barrel imports itself, so the real helpers come from their defining modules.
vi.mock('@openimis/fe-core', async () => vi.importActual('@openimis/fe-core/helpers/api'));

const { default: reducer, ACTION_TYPE, MUTATION_SERVICE } = await import('./reducer');
const {
  CLEAR, ERROR, REQUEST, SUCCESS, VALID,
} = await import('./utils/action-type');
const { globalId, graphqlErrors, relayPage, serverError } = await import('@openimis/fe-core/testing');

const initial = () => reducer(undefined, { type: '@@INIT' });
const dispatch = (state, type, { payload, meta } = {}) => reducer(state, { type, payload, meta });
const respond = (state, actionType, data, meta) => dispatch(state, SUCCESS(actionType), { payload: { data }, meta });
const fail = (state, actionType, payload = serverError(500, 'Internal Server Error', 'boom')) => dispatch(
  state,
  ERROR(actionType),
  { payload },
);

const SERVER_ERROR = { code: 500, message: 'Internal Server Error', detail: 'boom' };

describe('payment cycle reducer', () => {
  describe('initialisation', () => {
    it('starts with nothing loaded and nothing in flight', () => {
      const state = initial();

      expect(state.submittingMutation).toBe(false);
      expect(state.paymentCycles).toEqual([]);
      expect(state.paymentCycle).toBeNull();
      expect(state.deduplicationBenefitSummary).toEqual([]);
      expect(state.globalSchema).toBeNull();
    });

    it('returns the same state object for an unrelated action', () => {
      const state = initial();

      expect(reducer(state, { type: 'SOMETHING_ELSE' })).toBe(state);
    });
  });

  describe('payment cycle search', () => {
    const page = {
      paymentCycle: relayPage(
        [
          { id: globalId('PaymentCycleGQLType', 'pc-1'), code: 'PC1', status: 'ACTIVE' },
          { id: globalId('PaymentCycleGQLType', 'pc-2'), code: 'PC2', status: 'PENDING' },
        ],
        { totalCount: 7, pageInfo: { hasNextPage: true, endCursor: 'cursor-2' } },
      ),
    };

    it('drops the previous page and the open cycle when a search starts', () => {
      const stale = {
        ...initial(),
        paymentCycles: [{ id: 'pc-1' }],
        paymentCyclesTotalCount: 1,
        paymentCycle: { id: 'pc-1' },
        errorPaymentCycles: SERVER_ERROR,
      };
      const state = dispatch(stale, REQUEST(ACTION_TYPE.SEARCH_PAYMENT_CYCLES));

      expect(state).toMatchObject({
        paymentCycles: [],
        paymentCyclesTotalCount: 0,
        paymentCyclesPageInfo: {},
        paymentCycle: null,
        errorPaymentCycles: null,
        fetchedPaymentCycles: false,
      });
    });

    // Currently fails: the request case sets fetchingPaymentCycles to false, so the
    // searcher never shows its progress indicator while a search is running.
    it.fails('marks the search as in flight', () => {
      expect(dispatch(initial(), REQUEST(ACTION_TYPE.SEARCH_PAYMENT_CYCLES)).fetchingPaymentCycles).toBe(true);
    });

    it('decodes the ids and records the count and cursors', () => {
      const state = respond(initial(), ACTION_TYPE.SEARCH_PAYMENT_CYCLES, page);

      expect(state.paymentCycles).toEqual([
        { id: 'pc-1', code: 'PC1', status: 'ACTIVE' },
        { id: 'pc-2', code: 'PC2', status: 'PENDING' },
      ]);
      expect(state.paymentCyclesTotalCount).toBe(7);
      expect(state.paymentCyclesPageInfo).toMatchObject({ totalCount: 7, hasNextPage: true, endCursor: 'cursor-2' });
      expect(state.fetchedPaymentCycles).toBe(true);
      expect(state.errorPaymentCycles).toBeNull();
    });

    it('counts zero when the server sends no page', () => {
      const state = respond(initial(), ACTION_TYPE.SEARCH_PAYMENT_CYCLES, { paymentCycle: null });

      expect(state.paymentCyclesTotalCount).toBe(0);
      expect(state.paymentCyclesPageInfo).toEqual({});
    });

    it('surfaces a data error', () => {
      const state = dispatch(initial(), SUCCESS(ACTION_TYPE.SEARCH_PAYMENT_CYCLES), {
        payload: { data: { paymentCycle: relayPage([]) }, ...graphqlErrors('bad filter') },
      });

      expect(state.errorPaymentCycles).toMatchObject({ detail: 'bad filter' });
    });

    it('formats a transport failure', () => {
      const state = fail(initial(), ACTION_TYPE.SEARCH_PAYMENT_CYCLES);

      expect(state.fetchingPaymentCycles).toBe(false);
      expect(state.errorPaymentCycles).toEqual(SERVER_ERROR);
    });
  });

  describe('single payment cycle', () => {
    it('forgets the previous cycle while the next one loads', () => {
      const loaded = { ...initial(), paymentCycle: { id: 'pc-1' }, fetchedPaymentCycle: true };

      expect(dispatch(loaded, REQUEST(ACTION_TYPE.GET_PAYMENT_CYCLE))).toMatchObject({
        paymentCycle: null,
        fetchingPaymentCycle: true,
        fetchedPaymentCycle: false,
        errorPaymentCycle: null,
      });
    });

    it('unwraps and decodes the first node', () => {
      const state = respond(initial(), ACTION_TYPE.GET_PAYMENT_CYCLE, {
        paymentCycle: relayPage([{ id: globalId('PaymentCycleGQLType', 'pc-1'), code: 'PC1' }]),
      });

      expect(state.paymentCycle).toEqual({ id: 'pc-1', code: 'PC1' });
      expect(state.fetchingPaymentCycle).toBe(false);
      expect(state.fetchedPaymentCycle).toBe(true);
    });

    it('holds no cycle when the lookup matched nothing', () => {
      expect(respond(initial(), ACTION_TYPE.GET_PAYMENT_CYCLE, { paymentCycle: relayPage([]) }).paymentCycle)
        .toBeFalsy();
    });

    it('formats a transport failure', () => {
      const state = fail(initial(), ACTION_TYPE.GET_PAYMENT_CYCLE);

      expect(state.fetchingPaymentCycle).toBe(false);
      expect(state.errorPaymentCycle).toEqual(SERVER_ERROR);
    });

    it('forgets the cycle on clear', () => {
      const loaded = { ...initial(), paymentCycle: { id: 'pc-1' }, fetchedPaymentCycle: true };

      expect(dispatch(loaded, CLEAR(ACTION_TYPE.GET_PAYMENT_CYCLE))).toMatchObject({
        paymentCycle: null,
        fetchedPaymentCycle: false,
        errorPaymentCycle: null,
      });
    });
  });

  describe('code validation', () => {
    const field = (state) => state.validationFields.paymentCycleCode;
    const TYPE = ACTION_TYPE.PAYMENT_CYCLE_CODE_VALIDATION_FIELDS;

    it('marks the code as being checked', () => {
      expect(field(dispatch(initial(), REQUEST(TYPE)))).toEqual({
        isValidating: true,
        isValid: false,
        validationErrorMessage: null,
        validationError: null,
      });
    });

    it.each([
      [true, null],
      [false, 'Code already exists'],
    ])('reports isValid=%s with the server message', (isValid, errorMessage) => {
      const state = respond(initial(), TYPE, { paymentCycleCodeValidity: { isValid, errorMessage } });

      expect(field(state)).toEqual({
        isValidating: false,
        isValid,
        validationErrorMessage: errorMessage,
        validationError: null,
      });
    });

    it('treats a transport failure as invalid', () => {
      expect(field(fail(initial(), TYPE))).toMatchObject({
        isValidating: false,
        isValid: false,
        validationError: SERVER_ERROR,
      });
    });

    it.each([
      ['clear', CLEAR(TYPE), false],
      ['set valid', VALID(TYPE), true],
    ])('resets the check on %s', (_label, type, isValid) => {
      const checked = respond(initial(), TYPE, { paymentCycleCodeValidity: { isValid: false, errorMessage: 'taken' } });

      expect(field(dispatch(checked, type))).toEqual({
        isValidating: false,
        isValid,
        validationErrorMessage: null,
        validationError: null,
      });
    });

    it('keeps the other validation fields', () => {
      const other = { ...initial(), validationFields: { somethingElse: { isValid: true } } };

      expect(dispatch(other, REQUEST(TYPE)).validationFields.somethingElse).toEqual({ isValid: true });
    });
  });

  describe('deduplication summary', () => {
    it('marks the summary in flight', () => {
      const state = dispatch(initial(), REQUEST(ACTION_TYPE.GET_DEDUPLICATION_BENEFIT_SUMMARY));

      expect(state.fetchingDeduplicationBenefitSummary).toBe(true);
      expect(state.fetchedDeduplicationBenefitSummary).toBe(false);
    });

    it('stores the rows as sent', () => {
      const rows = [{ count: 2, ids: ['b-1', 'b-2'], columnValues: '{"first_name": "Ada"}' }];
      const state = respond(initial(), ACTION_TYPE.GET_DEDUPLICATION_BENEFIT_SUMMARY, {
        benefitDeduplicationSummary: { rows },
      });

      expect(state.deduplicationBenefitSummary).toEqual(rows);
      expect(state.fetchedDeduplicationBenefitSummary).toBe(true);
      expect(state.errorDeduplicationBenefitSummary).toBeNull();
    });

    it('formats a transport failure', () => {
      const state = fail(initial(), ACTION_TYPE.GET_DEDUPLICATION_BENEFIT_SUMMARY);

      expect(state.fetchingDeduplicationBenefitSummary).toBe(false);
      expect(state.errorDeduplicationBenefitSummary).toEqual(SERVER_ERROR);
    });
  });

  describe('global schema', () => {
    it('takes the schema out of the wrapper', () => {
      const requested = dispatch(initial(), REQUEST(ACTION_TYPE.FETCH_GLOBAL_SCHEMA));
      expect(requested.fetchingGlobalSchema).toBe(true);

      const state = respond(requested, ACTION_TYPE.FETCH_GLOBAL_SCHEMA, { globalSchema: { schema: '{"a":1}' } });

      expect(state.globalSchema).toBe('{"a":1}');
      expect(state.fetchingGlobalSchema).toBe(false);
      expect(state.fetchedGlobalSchema).toBe(true);
    });

    it('formats a transport failure', () => {
      const state = fail(initial(), ACTION_TYPE.FETCH_GLOBAL_SCHEMA);

      expect(state.fetchingGlobalSchema).toBe(false);
      expect(state.errorGlobalSchema).toEqual(SERVER_ERROR);
    });

    it('forgets the schema on clear', () => {
      const loaded = { ...initial(), globalSchema: '{}', fetchedGlobalSchema: true };

      expect(dispatch(loaded, CLEAR(ACTION_TYPE.FETCH_GLOBAL_SCHEMA))).toMatchObject({
        globalSchema: null,
        fetchedGlobalSchema: false,
      });
    });
  });

  describe('mutations', () => {
    const submitting = () => dispatch(initial(), REQUEST(ACTION_TYPE.MUTATION), {
      meta: { clientMutationId: 'cmid-1', clientMutationLabel: 'Create payment cycle' },
    });

    it('records the request metadata while a mutation is in flight', () => {
      expect(submitting()).toMatchObject({
        submittingMutation: true,
        mutation: { id: 'cmid-1', clientMutationLabel: 'Create payment cycle' },
      });
    });

    it.each([
      [ACTION_TYPE.CREATE_PAYMENT_CYCLE, MUTATION_SERVICE.PAYMENT_CYCLE.CREATE],
      [ACTION_TYPE.UPDATE_PAYMENT_CYCLE, MUTATION_SERVICE.PAYMENT_CYCLE.UPDATE],
    ])('clears the in-flight flag and keeps the internal id of %s', (actionType, service) => {
      const state = respond(submitting(), actionType, { [service]: { internalId: 'internal-1' } });

      expect(state.submittingMutation).toBe(false);
      expect(state.mutation).toMatchObject({ id: 'internal-1', clientMutationId: 'cmid-1' });
    });

    it('clears the in-flight flag once the deduplication tasks are created', () => {
      const state = respond(submitting(), ACTION_TYPE.CREATE_PAYMENT_DEDUPLICATION_TASKS, {});

      expect(state.submittingMutation).toBe(false);
    });

    // Currently fails: the response is read under createPaymentDeduplicationTasks, but the
    // mutation the action sends — and so the key the server answers under — is
    // createDeduplicationPaymentTasks, so the internal id is always lost.
    it.fails('keeps the internal id of the deduplication tasks mutation', () => {
      const state = respond(submitting(), ACTION_TYPE.CREATE_PAYMENT_DEDUPLICATION_TASKS, {
        createDeduplicationPaymentTasks: { internalId: 'internal-1' },
      });

      expect(state.mutation.id).toBe('internal-1');
    });

    it('raises an alert when a mutation fails', () => {
      const state = fail(submitting(), ACTION_TYPE.MUTATION, { status: 500, statusText: 'Internal Server Error' });

      expect(JSON.parse(state.alert)).toEqual({ status: 500, statusText: 'Internal Server Error' });
    });

    // Currently fails: fe-core's dispatchMutationErr only sets the alert, so the page
    // never sees submittingMutation drop and never journals the failed mutation.
    it.fails('stops submitting once a mutation has failed', () => {
      expect(fail(submitting(), ACTION_TYPE.MUTATION).submittingMutation).toBe(false);
    });
  });

  describe('immutability', () => {
    it('does not mutate the state it was given', () => {
      const state = initial();
      const snapshot = JSON.stringify(state);

      respond(state, ACTION_TYPE.SEARCH_PAYMENT_CYCLES, {
        paymentCycle: relayPage([{ id: globalId('PaymentCycleGQLType', 'pc-1') }]),
      });
      dispatch(state, REQUEST(ACTION_TYPE.PAYMENT_CYCLE_CODE_VALIDATION_FIELDS));

      expect(JSON.stringify(state)).toBe(snapshot);
    });
  });
});
