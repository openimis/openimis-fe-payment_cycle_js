import React from 'react';
import { injectIntl } from 'react-intl';
import {
  PublishedComponent,
} from '@openimis/fe-core';
import {
  Grid,
} from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles';
import { defaultFilterStyles } from '../utils/styles';

function PaymentCycleFilter({
  classes, filters, onChangeFilters,
}) {
  const filterValue = (filterName) => filters?.[filterName]?.value;

  return (
    <Grid container className={classes.form}>
      <Grid item xs={2} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="paymentCycle"
          label="label.dateValidFrom"
          value={filterValue('dateValidFrom_Gte')}
          onChange={(v) => onChangeFilters([
            {
              id: 'dateValidFrom_Gte',
              value: v,
              filter: `dateValidFrom_Gte: "${v}T00:00:00.000Z"`,
            },
          ])}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="paymentCycle"
          label="label.dateValidTo"
          value={filterValue('dateValidTo_Lte')}
          onChange={(v) => onChangeFilters([
            {
              id: 'dateValidTo_Lte',
              value: v,
              filter: `dateValidTo_Lte: "${v}T00:00:00.000Z"`,
            },
          ])}
        />
      </Grid>
    </Grid>
  );
}

export default injectIntl(withTheme(withStyles(defaultFilterStyles)(PaymentCycleFilter)));
