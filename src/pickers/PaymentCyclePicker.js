import React, { useState } from 'react';
import { TextField, Tooltip } from '@material-ui/core';

import {
  Autocomplete, useModulesManager, useTranslations, useGraphqlQuery,
} from '@openimis/fe-core';
import { PAYMENT_CYCLES_QUANTITY_LIMIT } from '../constants';

function PaymentCyclePicker(props) {
  const {
    multiple,
    required,
    label,
    nullLabel,
    withLabel = false,
    placeholder,
    withPlaceholder = false,
    readOnly,
    value,
    onChange,
    filter,
    filterSelectedOptions,
  } = props;

  const modulesManager = useModulesManager();
  const [filters, setFilters] = useState({ isDeleted: false });
  const [currentString, setCurrentString] = useState('');
  const { formatMessage, formatMessageWithValues } = useTranslations('paymentCycle', modulesManager);

  const { isLoading, data, error } = useGraphqlQuery(
    `
    query PaymentCyclePicker(
    $search: String, $first: Int, $isDeleted: Boolean
    ) {
      paymentCycle(search: $search, first: $first, isDeleted: $isDeleted) {
        edges {
          node {
            id
            runYear
            runMonth
          }
        }
      }
    }
  `,
    filters,
    { skip: true },
  );

  const paymentCycles = data?.paymentCycle?.edges.map((edge) => edge.node) ?? [];
  const shouldShowTooltip = paymentCycles?.length >= PAYMENT_CYCLES_QUANTITY_LIMIT && !value && !currentString;

  return (
    <Autocomplete
      multiple={multiple}
      error={error}
      readOnly={readOnly}
      options={paymentCycles ?? []}
      isLoading={isLoading}
      value={value}
      getOptionLabel={(option) => `${option.runYear} ${formatMessage(`month${option.runMonth}`)}`}
      onChange={(value) => onChange(value, value ? `${value.runYear} ${value.runMonth}` : null)}
      setCurrentString={setCurrentString}
      filterOptions={filter}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={(search) => setFilters({ first: PAYMENT_CYCLES_QUANTITY_LIMIT, search, isDeleted: false })}
      renderInput={(inputProps) => (
        <Tooltip
          title={
            shouldShowTooltip
              ? formatMessageWithValues('BenefitPlansPicker.aboveLimit', { limit: PAYMENT_CYCLES_QUANTITY_LIMIT })
              : ''
        }
        >
          <TextField
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
            {...inputProps}
            required={required}
            label={(withLabel && (label || nullLabel)) || formatMessage('PaymentCycle')}
            placeholder={(withPlaceholder && placeholder) || formatMessage('PaymentCyclePicker.placeholder')}
          />
        </Tooltip>
      )}
    />
  );
}

export default PaymentCyclePicker;
