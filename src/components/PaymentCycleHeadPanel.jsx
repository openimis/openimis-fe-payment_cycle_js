import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { Divider, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  FormattedMessage,
  FormPanel,
  PublishedComponent,
  ValidatedTextInput,
  withModulesManager,
} from '@openimis/fe-core';
import PaymentCycleStatusPicker from '../pickers/PaymentCycleStatusPicker';
import { codeSetValid, codeValidationCheck, codeValidationClear } from '../actions';

const StyledPaymentCycleHeadPanel = styled('div')(({ theme }) => ({
  '& .tableTitle': theme.table.title,
  '& .item': theme.paper.item,
  '& .fullHeight': {
    height: '100%',
  },
}));

const renderHeadPanelTitle = () => (
  <Grid container className="tableTitle">
    <Grid>
      <Grid
        container
        align="center"
        justify="center"
        direction="column"
        className="fullHeight"
      >
        <Grid>
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
      readOnly,
      isCodeValid,
      isCodeValidating,
      codeValidationError,
      codeValidationErrorMessage,
    } = this.props;
    const paymentCycle = { ...edited };
    return (
      <StyledPaymentCycleHeadPanel>
        {renderHeadPanelTitle()}
        <Divider />
        <Grid container className="item">
          <Grid size={3} className="item">
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
          <Grid size={3} className="item">
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
          <Grid size={3} className="item">
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
          <Grid size={3} className="item">
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
      </StyledPaymentCycleHeadPanel>
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

export { StyledPaymentCycleHeadPanel };
export default withModulesManager(
  connect(mapStateToProps)(injectIntl(PaymentCycleHeadPanel)),
);
