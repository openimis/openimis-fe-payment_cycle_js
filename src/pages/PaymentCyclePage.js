import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect, useDispatch } from 'react-redux';
import {
    Form, Helmet, useTranslations, useModulesManager, useHistory,
} from '@openimis/fe-core';
import PaymentCycleHeadPanel from '../components/PaymentCycleHeadPanel';
import { EMPTY_STRING } from '../constants';
import {
    fetchTaskGroup, clearTaskGroup
} from '../actions';

const useStyles = makeStyles((theme) => ({
    page: theme.page,
}));

function PaymentCyclePage({
    rights, paymentCycle, paymentCycleUuid
}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const modulesManager = useModulesManager();
    const history = useHistory();
    const { formatMessage, formatMessageWithValues } = useTranslations('paymentCycle', modulesManager);
    const back = () => history.goBack();

    const titleParams = (paymentCycle) => ({
        id: paymentCycle?.id ?? EMPTY_STRING,
    });

    useEffect(() => {
        if (paymentCycleUuid) {
            dispatch(fetchTaskGroup(modulesManager, { paymentCycleUuid }));
        }
    }, [paymentCycleUuid]);

    useEffect(() => () => dispatch(clearTaskGroup()), []);

    return (
        <div className={classes.page}>
            <Helmet title={formatMessageWithValues('taskGroup.detailsPage.title', titleParams(paymentCycle))} />
            <Form
                module="tasksManagement"
                title={formatMessageWithValues('taskGroup.detailsPage.title', titleParams(paymentCycle))}
                titleParams={titleParams(paymentCycle)}
                openDirty
                edited={paymentCycle}
                back={back}
                HeadPanel={TaskGroupHeadPanel}
                formatMessage={formatMessage}
                rights={rights}
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

export default connect(mapStateToProps)(PaymentCyclePage);
