import React from 'react';
import { injectIntl } from 'react-intl';
import { PublishedComponent, TextInput, GRID_RESPONSIVE_STANDARD } from '@openimis/fe-core';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import _debounce from 'lodash/debounce';
import { DEFAULT_DEBOUNCE_TIME, EMPTY_STRING, CONTAINS_LOOKUP } from '../constants';
import PaymentCycleStatusPicker from '../pickers/PaymentCycleStatusPicker';

const StyledPaymentCycleFilter = styled('div')(({ theme }) => ({
  '& .form': {
    padding: theme.spacing(1),
  },
  '& .item': {
    padding: theme.spacing(1),
  },
}));

function PaymentCycleFilter({
  filters, onChangeFilters,
}) {
  const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFAULT_DEBOUNCE_TIME);
  const filterValue = (filterName) => filters?.[filterName]?.value;

  const filterTextFieldValue = (filterName) => filters?.[filterName]?.value ?? EMPTY_STRING;

  const onChangeStringFilter = (filterName, lookup = null) => (value) => {
    if (lookup) {
      debouncedOnChangeFilters([
        {
          id: filterName,
          value,
          filter: `${filterName}_${lookup}: "${value}"`,
        },
      ]);
    } else {
      onChangeFilters([
        {
          id: filterName,
          value,
          filter: `${filterName}: "${value}"`,
        },
      ]);
    }
  };

  return (
    <StyledPaymentCycleFilter>
      <Grid container className="form">
        <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
          <TextInput
            module="paymentCycle"
            label="label.code"
            value={filterTextFieldValue('code')}
            onChange={onChangeStringFilter('code', CONTAINS_LOOKUP)}
          />
        </Grid>
        <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
          <PublishedComponent
            pubRef="core.DatePicker"
            module="paymentCycle"
            label="label.dateValidFrom"
            value={filterValue('dateValidFrom_Gte')}
            onChange={(v) => onChangeFilters([
              {
                id: 'startDate_Gte',
                value: v,
                filter: `startDate_Gte: "${v}"`,
              },
            ])}
          />
        </Grid>
        <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
          <PublishedComponent
            pubRef="core.DatePicker"
            module="paymentCycle"
            label="label.dateValidTo"
            value={filterValue('dateValidTo_Lte')}
            onChange={(v) => onChangeFilters([
              {
                id: 'endDate_Lte',
                value: v,
                filter: `endDate_Lte: "${v}"`,
              },
            ])}
          />
        </Grid>
        <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
          <PaymentCycleStatusPicker
            module="paymentCycle"
            label="label.status"
            withNull
            value={filterValue('status')}
            onChange={(value) => onChangeFilters([
              {
                id: 'status',
                value,
                filter: value ? `status: ${value}` : '',
              },
            ])}
          />
        </Grid>
      </Grid>
    </StyledPaymentCycleFilter>
  );
}

export { StyledPaymentCycleFilter };
export default injectIntl(PaymentCycleFilter);
