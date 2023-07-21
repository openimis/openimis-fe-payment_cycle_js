import React from 'react';
import {
  Helmet,
  //   withTooltip,
  useTranslations, useModulesManager,
//   useHistory,
} from '@openimis/fe-core';
import { makeStyles } from '@material-ui/styles';
// import { useSelector } from 'react-redux';
import {
//   RIGHT_PAYMENT_CYCLE_CREATE,
  MODULE_NAME,
//   RIGHT_PAYMENT_CYCLE_SEARCH,
} from '../constants';
import PaymentCycleLauncher from '../components/PaymentCycleLauncher';
import PaymentCycleSearcher from '../components/PaymentCycleSearcher';

const useStyles = makeStyles((theme) => ({
  page: theme.page,
  fab: theme.fab,
}));

function PaymentCyclesPage() {
  const modulesManager = useModulesManager();
  const classes = useStyles();
  //   const rights = useSelector((store) => store.core.user.i_user.rights ?? []);
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);

  return (
    <div className={classes.page}>
      <Helmet title={formatMessage('paymentCycle.page.title')} />
      {// rights.includes(RIGHT_PAYMENT_CYCLE_CREATE) &&
        <PaymentCycleLauncher className={classes.section} />
            }
      {// rights.includes(RIGHT_PAYMENT_CYCLE_SEARCH) &&
        <PaymentCycleSearcher className={classes.section} />
            }
    </div>
  );
}

export default PaymentCyclesPage;
