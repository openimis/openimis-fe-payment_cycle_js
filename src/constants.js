export const RIGHT_PAYMENT_CYCLE_SEARCH = 200001;
export const RIGHT_PAYMENT_CYCLE_CREATE = 200002;
export const PAYMENT_CYCLE_ROUTE_PAYMENT_CYCLES_PAYMENT_CYCLE = 'paymentCycle.route.paymentCycle';

export const DEFAULT_DEBOUNCE_TIME = 500;
export const DEFAULT_PAGE_SIZE = 10;
export const CONTAINS_LOOKUP = 'Icontains';
export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];
export const EMPTY_STRING = '';
export const ENUM_PREFIX_LENGTH = 2;

export const RIGHT_BILL_SEARCH = 156101;
export const RIGHT_BILL_CREATE = 156102;
export const RIGHT_BILL_UPDATE = 156103;
export const RIGHT_BILL_DELETE = 156104;

export const INVOICE_BILL_ROUTE = 'bill.route.bill';
export const GET_SUBJECT_AND_THIRDPARTY_TYPE_PICKER_REF = 'bill.util.getSubjectAndThirdpartyTypePicker';

export const MODULE_NAME = 'paymentCycle';

export const PAYMENT_CYCLE_BILLS_LIST_TAB_VALUE = 'paymentCycleBillsTab';

export const PAYMENT_CYCLE_TABS_LABEL_CONTRIBUTION_KEY = 'paymentCycle.TabPanel.label';
export const PAYMENT_CYCLE_TABS_PANEL_CONTRIBUTION_KEY = 'paymentCycle.TabPanel.panel';

export const STATUS = {
  DRAFT: '0',
  VALIDATED: '1',
  PAYED: '2',
  CANCELLED: '3',
  DELETED: '4',
  SUSPENDED: '5',
};

export const PAYMENT_CYCLES_QUANTITY_LIMIT = 15;

export const PAYMENT_CYCLE_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
};

export const PAYMENT_CYCLE_STATUS_LIST = [
  PAYMENT_CYCLE_STATUS.PENDING, PAYMENT_CYCLE_STATUS.ACTIVE, PAYMENT_CYCLE_STATUS.SUSPENDED,
];

export const PAYMENT_CYCLE_TASK_TAB_VALUE = 'paymentCycleTaskTab';
export const PAYMENT_CYCLE_BENEFITS_TAB_VALUE = 'paymentCycleBenefitsTab';

export const BASIC_FIELDS = [
  { id: 'first_name', name: 'first_name' },
  { id: 'last_name', name: 'last_name' },
  { id: 'dob', name: 'dob' },
];

export const PAYMENT_DEDUPLICATION_DIALOG_CONTRIBUTION_KEY = 'paymentCycle.deduplicationFieldSelectionDialog';
