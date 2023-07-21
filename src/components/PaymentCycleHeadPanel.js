import React from 'react';
import { Grid, Divider, Typography } from '@material-ui/core';
import {
  withModulesManager,
  FormPanel,
  TextInput,
  PublishedComponent,
  //   TextAreaInput,
  FormattedMessage,
  //   formatMessage,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: '100%',
  },
});

const renderHeadPanelTitle = (classes) => (
  <Grid container className={classes.tableTitle}>
    <Grid item>
      <Grid
        container
        align="center"
        justify="center"
        direction="column"
        className={classes.fullHeight}
      >
        <Grid item>
          <Typography>
            <FormattedMessage module="paymentCycle" id="paymentCycle.PaymentCycleHeadPanel.subtitle" />
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

class PaymentCycleHeadPanel extends FormPanel {
  render() {
    const {
      edited,
      classes,
      readOnly = true,
    } = this.props;
    const paymentCycle = { ...edited };
    return (
      <>
        {renderHeadPanelTitle(classes)}
        <Divider />
        <Grid container className={classes.item}>
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module="paymentCycle"
              label="PaymentCycleHeadPanel.label.id"
              readOnly={readOnly}
              value={paymentCycle?.id}
              onChange={(source) => this.updateAttribute('paymentCycle', source)}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="paymentCycle"
              label="label.dateValidFrom"
              readOnly={readOnly}
              value={paymentCycle?.dateValidFrom}
              onChange={(dateValidFrom) => this.updateAttribute('dateValidFrom', dateValidFrom)}
              // NOTE: maxDate cannot be passed if dateValidTo does not exist.
              // Passing any other falsy value will block months manipulation.
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...(paymentCycle.dateValidTo ? { maxDate: paymentCycle.dateValidTo } : null)}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="paymentCycle"
              label="label.dateValidTo"
              readOnly={readOnly}
              value={paymentCycle?.dateValidTo}
              onChange={(dateValidTo) => this.updateAttribute('dateValidTo', dateValidTo)}
              minDate={paymentCycle?.dateValidFrom ?? new Date()}
            />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(PaymentCycleHeadPanel))));
