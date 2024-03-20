import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect, useSelector, useDispatch } from 'react-redux';
import {
  Form, Helmet, useTranslations, useModulesManager, useHistory, journalize,
} from '@openimis/fe-core';
import _ from 'lodash';
import { EMPTY_STRING, MODULE_NAME } from '../constants';
import PaymentCycleHeadPanel from '../components/PaymentCycleHeadPanel';
import {
  clearPaymentCycle,
  createPaymentCycle,
  fetchPaymentCycle,
  updatePaymentCycle,
} from '../actions';

const useStyles = makeStyles((theme) => ({
  page: theme.page,
}));

function PaymentCyclePage({ paymentCycleUuid }) {
  const rights = useSelector((store) => store.core.user.i_user.rights ?? []);
  const classes = useStyles();
  const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const history = useHistory();
  const [editedPaymentCycle, setEditedPaymentCycle] = useState({});
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);
  const paymentCycle = useSelector((state) => state.paymentCycle.paymentCycle);
  const isPaymentCycleCodeValid = useSelector(
    (state) => state?.paymentCycle?.validationFields?.paymentCycleCode?.isValid,
  );
  const mutation = useSelector((state) => state?.paymentCycle?.mutation);
  const submittingMutation = useSelector((state) => state?.paymentCycle?.submittingMutation);

  const prevSubmittingMutationRef = useRef();

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      dispatch(journalize(mutation));
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });
  const back = () => history.goBack();

  const titleParams = (paymentCycle) => ({
    code: paymentCycle?.code ?? EMPTY_STRING,
  });

  const clearDataOnPageUnmount = () => {
    dispatch(clearPaymentCycle());
    dispatch(clearPaymentCycleBills());
  };

  const getPanels = () => [];

  useEffect(() => {
    if (paymentCycleUuid) {
      dispatch(fetchPaymentCycle(modulesManager, { paymentCycleUuid }));
    }
    return clearDataOnPageUnmount;
  }, [paymentCycleUuid]);

  useEffect(() => {
    if (paymentCycle) {
      setEditedPaymentCycle(paymentCycle);
    }
  }, [paymentCycle]);

  const save = () => {
    if (paymentCycleUuid) {
      dispatch(updatePaymentCycle(
        editedPaymentCycle,
        formatMessageWithValues('paymentCycle.update.mutationLabel', titleParams(paymentCycle)),
      ));
    } else {
      dispatch(createPaymentCycle(
        editedPaymentCycle,
        formatMessageWithValues('paymentCycle.create.mutationLabel', titleParams(paymentCycle)),
      ));
    }
  };

  const isMandatoryFieldsEmpty = () => !(
    editedPaymentCycle?.code
    && editedPaymentCycle?.startDate
    && editedPaymentCycle?.endDate
    && editedPaymentCycle?.status
  );

  const isValid = () => (
    (editedPaymentCycle?.code ? isPaymentCycleCodeValid : true)
  );

  const doesPaymentPlanChange = () => !_.isEqual(paymentCycle, editedPaymentCycle);

  const canSave = () => !isMandatoryFieldsEmpty() && doesPaymentPlanChange() && isValid();

  return (
    <div className={classes.page}>
      <Helmet title={formatMessageWithValues('paymentCycle.PaymentCyclePage.title', titleParams(paymentCycle))} />
      <Form
        module="paymentCycle"
        title={formatMessageWithValues('paymentCycle.PaymentCyclePage.title', titleParams(paymentCycle))}
        titleParams={titleParams(paymentCycle)}
        openDirty
        edited={editedPaymentCycle}
        onEditedChanged={setEditedPaymentCycle}
        back={back}
        save={save}
        canSave={canSave}
        HeadPanel={PaymentCycleHeadPanel}
        Panels={getPanels()}
        paymentCycleUuid={paymentCycleUuid}
        formatMessage={formatMessage}
        rights={rights}
        saveTooltip={formatMessage('saveButton.tooltip')}
        readOnly={paymentCycleUuid}
      />
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  paymentCycleUuid: props.match.params.payment_cycle_uuid,
});

export default connect(mapStateToProps, null)(PaymentCyclePage);
