import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  connect,
  // useDispatch,
  useSelector,
} from 'react-redux';
import {
  Form, Helmet, useTranslations, useModulesManager, useHistory,
} from '@openimis/fe-core';
import { EMPTY_STRING, MODULE_NAME } from '../constants';
import PaymentCycleHeadPanel from '../components/PaymentCycleHeadPanel';
// import {
//   fetchPaymentCycle, clearPaymentCycle,
// } from '../actions';
import PaymentCycleTab from '../components/PaymentCycleTab';

const useStyles = makeStyles((theme) => ({
  page: theme.page,
}));

function PaymentCyclePage({ paymentCycle, paymentCycleUuid }) {
  const rights = useSelector((store) => store.core.user.i_user.rights ?? []);
  const classes = useStyles();
  //   const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const history = useHistory();
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);
  const back = () => history.goBack();

  const titleParams = (paymentCycle) => ({
    code: paymentCycle?.code ?? EMPTY_STRING,
  });

  useEffect(() => {
    if (paymentCycleUuid) {
      // dispatch(fetchPaymentCycle(modulesManager, { paymentCycleUuid }));
    }
  }, [paymentCycleUuid]);

  // useEffect(() => () => dispatch(clearPaymentCycle()), []);

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
