import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect, useSelector, useDispatch } from 'react-redux';
import {
  Form, Helmet, useTranslations, useModulesManager, useHistory,
} from '@openimis/fe-core';
import { EMPTY_STRING, MODULE_NAME } from '../constants';
import PaymentCycleHeadPanel from '../components/PaymentCycleHeadPanel';
import PaymentCycleTab from '../components/PaymentCycleTab';
import { clearPaymentCycle, clearPaymentCycleBills, fetchPaymentCycle } from '../actions';

const useStyles = makeStyles((theme) => ({
  page: theme.page,
}));

function PaymentCyclePage({ paymentCycle, paymentCycleUuid }) {
  const rights = useSelector((store) => store.core.user.i_user.rights ?? []);
  const classes = useStyles();
  const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const history = useHistory();
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);
  const back = () => history.goBack();

  const titleParams = (paymentCycle) => ({
    code: paymentCycle?.code ?? EMPTY_STRING,
  });

  const clearDataOnPageUnmount = () => {
    dispatch(clearPaymentCycle());
    dispatch(clearPaymentCycleBills());
  };

  useEffect(() => {
    if (paymentCycleUuid) {
      dispatch(fetchPaymentCycle(modulesManager, { paymentCycleUuid }));
    }
    return clearDataOnPageUnmount;
  }, [paymentCycleUuid]);

  return (
    <div className={classes.page}>
      <Helmet title={formatMessageWithValues('paymentCycle.PaymentCyclePage.title', titleParams(paymentCycle))} />
      <Form
        module="paymentCycle"
        title={formatMessageWithValues('paymentCycle.PaymentCyclePage.title', titleParams(paymentCycle))}
        titleParams={titleParams(paymentCycle)}
        openDirty
        edited={paymentCycle}
        back={back}
        HeadPanel={PaymentCycleHeadPanel}
        Panels={[PaymentCycleTab]}
        paymentCycleUuid={paymentCycleUuid}
        formatMessage={formatMessage}
        rights={rights}
        saveTooltip={formatMessage('saveButton.tooltip')}
      />
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  paymentCycleUuid: props.match.params.payment_cycle_uuid,
  paymentCycle: state.paymentCycle.paymentCycle,
  fetchingPaymentCycle: state.paymentCycle.fetchingPaymentCycle,
  errorPaymentCycle: state.paymentCycle.errorPaymentCycle,
  fetchedPaymentCycle: state.paymentCycle.fetchedPaymentCycle,
});

export default connect(mapStateToProps, null)(PaymentCyclePage);
