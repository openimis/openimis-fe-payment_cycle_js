import React from 'react';
import { useSelector } from 'react-redux';
import {
  Helmet,
  useTranslations, useModulesManager, useHistory, withTooltip,
} from '@openimis/fe-core';
import { makeStyles } from '@material-ui/styles';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {
  MODULE_NAME,
  RIGHT_PAYMENT_CYCLE_SEARCH, PAYMENT_CYCLE_ROUTE_PAYMENT_CYCLES_PAYMENT_CYCLE, RIGHT_PAYMENT_CYCLE_CREATE,
} from '../constants';
import PaymentCycleSearcher from '../components/PaymentCycleSearcher';

const useStyles = makeStyles((theme) => ({
  page: theme.page,
  fab: theme.fab,
}));

function PaymentCyclesPage() {
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const history = useHistory();
  const rights = useSelector((store) => store.core.user.i_user.rights ?? []);
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);

  const onCreate = () => history.push(
    `/${modulesManager.getRef(PAYMENT_CYCLE_ROUTE_PAYMENT_CYCLES_PAYMENT_CYCLE)}`,
  );

  return (
    <div className={classes.page}>
      <Helmet title={formatMessage('paymentCycle.page.title')} />
      {rights.includes(RIGHT_PAYMENT_CYCLE_SEARCH)
            && <PaymentCycleSearcher />}
      {rights.includes(RIGHT_PAYMENT_CYCLE_CREATE)
            && withTooltip(
              <div className={classes.fab}>
                <Fab color="primary" onClick={onCreate}>
                  <AddIcon />
                </Fab>
              </div>,
              formatMessage('createButton.tooltip'),
            )}
    </div>
  );
}

export default PaymentCyclesPage;
