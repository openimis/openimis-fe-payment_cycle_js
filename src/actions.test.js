import {
  describe, expect, it, vi,
} from 'vitest';

// Only fe-core's two dispatchers are stubbed; the formatters are real, imported from
// their defining modules because fe-core's barrel imports itself.
const core = vi.hoisted(() => ({
  graphql: vi.fn((payload, type, meta) => ({ payload, type, meta })),
  graphqlWithVariables: vi.fn((operation, variables, type, meta) => ({
    operation, variables, type, meta,
  })),
}));

vi.mock('@openimis/fe-core', async () => ({
  ...(await vi.importActual('@openimis/fe-core/helpers/api')),
  ...(await vi.importActual('@openimis/fe-core/actions')),
  ...core,
}));

const actions = await import('./actions');
const { ACTION_TYPE } = await import('./reducer');
const {
  CLEAR, ERROR, REQUEST, SUCCESS, VALID,
} = await import('./utils/action-type');

const query = (result) => result.payload.replace(/\s+/g, ' ');

describe('payment cycle actions', () => {
  describe('queries', () => {
    it.each([
      ['fetchPaymentCycles', ACTION_TYPE.SEARCH_PAYMENT_CYCLES],
      ['fetchPaymentCycle', ACTION_TYPE.GET_PAYMENT_CYCLE],
    ])('%s asks for a counted page of payment cycles', (creator, actionType) => {
      const result = actions[creator]({}, ['first: 10']);

      expect(result.type).toBe(actionType);
      expect(query(result)).toContain('paymentCycle(first: 10) { totalCount');
      expect(query(result)).toContain('id,code,startDate,endDate,status');
    });

    it('asks for the deduplication summary rows', () => {
      const result = actions.fetchDeduplicationSummary(['paymentCycleId: "pc-1"', 'columns: ["dob"]']);

      expect(result.type).toBe(ACTION_TYPE.GET_DEDUPLICATION_BENEFIT_SUMMARY);
      expect(query(result)).toContain('benefitDeduplicationSummary(paymentCycleId: "pc-1",columns: ["dob"])');
      expect(query(result)).toContain('rows {count, ids, columnValues}');
    });

    it('asks for the global schema', () => {
      const result = actions.fetchGlobalSchema();

      expect(result.type).toBe(ACTION_TYPE.FETCH_GLOBAL_SCHEMA);
      expect(query(result)).toContain('globalSchema { schema }');
    });

    it('checks a code through a variable rather than inlining it', () => {
      const result = actions.codeValidationCheck({}, { code: 'PC"1' });

      expect(result.type).toBe(ACTION_TYPE.PAYMENT_CYCLE_CODE_VALIDATION_FIELDS);
      expect(result.operation.replace(/\s+/g, ' ')).toContain('paymentCycleCodeValidity(code: $code)');
      expect(result.variables).toEqual({ code: 'PC"1' });
    });
  });

  describe('thunks', () => {
    it.each([
      ['clearPaymentCycle', CLEAR(ACTION_TYPE.GET_PAYMENT_CYCLE)],
      ['codeSetValid', VALID(ACTION_TYPE.PAYMENT_CYCLE_CODE_VALIDATION_FIELDS)],
      ['codeValidationClear', CLEAR(ACTION_TYPE.PAYMENT_CYCLE_CODE_VALIDATION_FIELDS)],
    ])('%s dispatches %s', (creator, type) => {
      const dispatch = vi.fn();

      actions[creator]()(dispatch);

      expect(dispatch).toHaveBeenCalledExactlyOnceWith({ type });
    });
  });

  describe('payment cycle mutations', () => {
    const cycle = {
      id: 'pc-1',
      code: 'PC1',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      status: 'ACTIVE',
    };

    it.each([
      ['createPaymentCycle', 'createPaymentCycle', ACTION_TYPE.CREATE_PAYMENT_CYCLE],
      ['updatePaymentCycle', 'updatePaymentCycle', ACTION_TYPE.UPDATE_PAYMENT_CYCLE],
    ])('%s raises the request, its own success and the shared error type', (creator, mutationName, actionType) => {
      const result = actions[creator](cycle, 'label');

      expect(result.type).toEqual([REQUEST(ACTION_TYPE.MUTATION), SUCCESS(actionType), ERROR(ACTION_TYPE.MUTATION)]);
      expect(query(result)).toContain(`mutation ${mutationName}`);
      expect(query(result)).toContain(`clientMutationId: "${result.meta.clientMutationId}"`);
      expect(result.meta).toMatchObject({ clientMutationLabel: 'label' });
      expect(result.meta.requestedDateTime).toBeInstanceOf(Date);
    });

    it('records creation as the action type of a create', () => {
      expect(actions.createPaymentCycle(cycle, 'label').meta.actionType).toBe(ACTION_TYPE.CREATE_PAYMENT_CYCLE);
    });

    // Currently fails: updatePaymentCycle copies the create action type into its metadata,
    // so the journal records every update as a creation.
    it.fails('records the update as the action type of an update', () => {
      expect(actions.updatePaymentCycle(cycle, 'label').meta.actionType).toBe(ACTION_TYPE.UPDATE_PAYMENT_CYCLE);
    });

    it('sends every field, with the status as a bare enum', () => {
      const sent = query(actions.updatePaymentCycle(cycle, 'label'));

      expect(sent).toContain('id: "pc-1"');
      expect(sent).toContain('code: "PC1"');
      expect(sent).toContain('startDate: "2026-01-01"');
      expect(sent).toContain('endDate: "2026-01-31"');
      expect(sent).toContain('status: ACTIVE');
    });

    it('omits the fields that were never filled in', () => {
      const sent = query(actions.createPaymentCycle({ code: 'PC1' }, 'label'));

      expect(sent).toContain('code: "PC1"');
      expect(sent).not.toMatch(/\b(id|startDate|endDate|status):/);
    });
  });

  describe('deduplication tasks', () => {
    const summary = [
      { count: 2, ids: ['b-1', 'b-2'], columnValues: '{"first_name": "Ada"}' },
      { count: 3, ids: ['b-3', 'b-4', 'b-5'], columnValues: '{"first_name": "Bob"}' },
    ];

    it('raises the request, its own success and the shared error type', () => {
      const result = actions.createDeduplicationTasks(summary, 'pc-1', 'Create tasks');

      expect(result.type).toEqual([
        REQUEST(ACTION_TYPE.MUTATION),
        SUCCESS(ACTION_TYPE.CREATE_PAYMENT_DEDUPLICATION_TASKS),
        ERROR(ACTION_TYPE.MUTATION),
      ]);
      expect(result.meta.actionType).toBe(ACTION_TYPE.CREATE_PAYMENT_DEDUPLICATION_TASKS);
      expect(query(result)).toContain('mutation createDeduplicationPaymentTasks');
    });

    it('sends each summary row as an input object, with the JSON column values as a string', () => {
      const sent = query(actions.createDeduplicationTasks(summary, 'pc-1', 'Create tasks'));

      expect(sent).toContain(
        'summary: [{ count: 2, ids: ["b-1","b-2"], columnValues: "{\\"first_name\\": \\"Ada\\"}" }, '
        + '{ count: 3, ids: ["b-3","b-4","b-5"], columnValues: "{\\"first_name\\": \\"Bob\\"}" }], '
        + 'paymentCycle: "pc-1"',
      );
    });

    it.each([
      ['no summary', undefined],
      ['a summary that is not a list', { count: 1 }],
    ])('sends no task input for %s', (_label, value) => {
      const sent = query(actions.createDeduplicationTasks(value, 'pc-1', 'Create tasks'));

      expect(sent).not.toContain('summary:');
      expect(sent).not.toContain('paymentCycle:');
    });
  });
});
