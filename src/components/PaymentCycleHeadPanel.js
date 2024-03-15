import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { Divider, Grid, Typography } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';

import {
  FormattedMessage,
  FormPanel,
  PublishedComponent,
  ValidatedTextInput,
  withModulesManager,
} from '@openimis/fe-core';
import PaymentCycleStatusPicker from '../pickers/PaymentCycleStatusPicker';
import { codeSetValid, codeValidationCheck, codeValidationClear } from '../actions';

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
  shouldValidate = (inputValue) => {
    const { code } = this.props;
    return inputValue !== code;
  };

  render() {
    const {
      edited,
      classes,
      readOnly,
      isCodeValid,
      isCodeValidating,
      codeValidationError,
      codeValidationErrorMessage,
    } = this.props;
    const paymentCycle = { ...edited };
    return (
      <>
        {renderHeadPanelTitle(classes)}
        <Divider />
        <Grid container className={classes.item}>
          <Grid item xs={3} className={classes.item}>
            <ValidatedTextInput
              module="paymentCycle"
              label="PaymentCycleHeadPanel.label.code"
              required
              readOnly={readOnly}
              value={paymentCycle?.code}
              onChange={(v) => this.updateAttribute('code', v)}
              itemQueryIdentifier="code"
              codeTakenLabel={codeValidationErrorMessage}
              shouldValidate={this.shouldValidate}
              isValid={isCodeValid}
              isValidating={isCodeValidating}
              validationError={codeValidationError}
              action={codeValidationCheck}
              clearAction={codeValidationClear}
              setValidAction={codeSetValid}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              value={paymentCycle?.startDate}
              required
              readOnly={readOnly}
              module="paymentCycle"
              label="PaymentCycleHeadPanel.label.startDate"
              onChange={(v) => this.updateAttribute('startDate', v)}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              value={paymentCycle?.endDate}
              required
              readOnly={readOnly}
              module="paymentCycle"
              label="PaymentCycleHeadPanel.label.endDate"
              onChange={(v) => this.updateAttribute('endDate', v)}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <PaymentCycleStatusPicker
              value={paymentCycle?.status}
              required
              withNull={false}
              module="paymentCycle"
              label="PaymentCycleHeadPanel.label.status"
              onChange={(v) => this.updateAttribute('status', v)}
            />
          </Grid>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isCodeValid: state.paymentCycle.validationFields?.paymentCycleCode?.isValid,
  isCodeValidating: state.paymentCycle.validationFields?.paymentCycleCode?.isValidating,
  codeValidationError: state.paymentCycle.validationFields?.paymentCycleCode?.validationError,
  codeValidationErrorMessage: state.paymentCycle.validationFields?.paymentCycleCode?.validationErrorMessage,
  code: state.paymentCycle?.paymentCycle?.code,
});

export default withModulesManager(
  connect(mapStateToProps)(injectIntl(withTheme(withStyles(styles)(PaymentCycleHeadPanel)))),
);
