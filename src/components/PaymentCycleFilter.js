import React from 'react';
import { injectIntl } from 'react-intl';
import {
  // TextInput,
  PublishedComponent,
  // formatMessage
} from '@openimis/fe-core';
import {
  // FormControlLabel,
  Grid,
  // Checkbox
} from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles';
// import _debounce from 'lodash/debounce';
// import { DEFAULT_DEBOUNCE_TIME, EMPTY_STRING } from '../constants';
import { defaultFilterStyles } from '../utils/styles';

function PaymentCycleFilter({
  classes, filters, onChangeFilters,
}) {
//   const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFAULT_DEBOUNCE_TIME);

  const filterValue = (filterName) => filters?.[filterName]?.value;

  //   const filterTextFieldValue = (filterName) => filters?.[filterName]?.value ?? EMPTY_STRING;

  //   const onChangeStringFilter = (filterName, lookup = null) => (value) => {
  //     if (lookup) {
  //       debouncedOnChangeFilters([
  //         {
  //           id: filterName,
  //           value,
  //           filter: `${filterName}_${lookup}: "${value}"`,
  //         },
  //       ]);
  //     } else {
  //       onChangeFilters([
  //         {
  //           id: filterName,
  //           value,
  //           filter: `${filterName}: "${value}"`,
  //         },
  //       ]);
  //     }
  //   };

  return (
    <Grid container className={classes.form}>
      <Grid item xs={2} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="paymentCycle"
          label="label.dateValidFrom"
          value={filterValue('dateValidFrom')}
          onChange={(v) => onChangeFilters([
            {
              id: 'dateValidFrom',
              value: v,
              filter: `dateValidFrom: "${v}T00:00:00.000Z"`,
            },
          ])}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="paymentCycle"
          label="label.dateValidTo"
          value={filterValue('dateValidTo')}
          onChange={(v) => onChangeFilters([
            {
              id: 'dateValidTo',
              value: v,
              filter: `dateValidTo: "${v}T00:00:00.000Z"`,
            },
          ])}
        />
      </Grid>
    </Grid>
  );
}

export default injectIntl(withTheme(withStyles(defaultFilterStyles)(PaymentCycleFilter)));
