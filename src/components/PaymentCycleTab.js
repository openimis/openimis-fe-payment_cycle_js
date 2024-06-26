import React, { useState } from 'react';
import { Paper, Grid } from '@material-ui/core';
import { Contributions } from '@openimis/fe-core';
import { makeStyles } from '@material-ui/styles';
import {
  PAYMENT_CYCLE_BENEFITS_TAB_VALUE,
  PAYMENT_CYCLE_TABS_LABEL_CONTRIBUTION_KEY,
  PAYMENT_CYCLE_TABS_PANEL_CONTRIBUTION_KEY,
  PAYMENT_DEDUPLICATION_DIALOG_CONTRIBUTION_KEY,
} from '../constants';

const useStyles = makeStyles((theme) => ({
  paper: theme.paper.paper,
  tableTitle: theme.table.title,
  tabs: {
    display: 'flex',
    alignItems: 'center',
  },
  selectedTab: {
    borderBottom: '4px solid white',
  },
  unselectedTab: {
    borderBottom: '4px solid transparent',
  },
  button: {
    marginLeft: 'auto',
    padding: theme.spacing(1),
    fontSize: '0.875rem',
    textTransform: 'none',
  },
}));

function PaymentCycleTab({ rights, setConfirmedAction, paymentCycleUuid }) {
  const classes = useStyles();

  const [activeTab, setActiveTab] = useState(PAYMENT_CYCLE_BENEFITS_TAB_VALUE);

  const isSelected = (tab) => tab === activeTab;

  const tabStyle = (tab) => (isSelected(tab) ? classes.selectedTab : classes.unselectedTab);

  const handleChange = (_, tab) => setActiveTab(tab);

  return (
    <Paper className={classes.paper}>
      <Grid container className={`${classes.tableTitle} ${classes.tabs}`}>
        <div style={{ width: '100%' }}>
          <div style={{ float: 'left' }}>
            <Contributions
              contributionKey={PAYMENT_CYCLE_TABS_LABEL_CONTRIBUTION_KEY}
              rights={rights}
              value={activeTab}
              onChange={handleChange}
              isSelected={isSelected}
              tabStyle={tabStyle}
              paymentCycleUuid={paymentCycleUuid}
            />
          </div>
          <div style={{ float: 'right', paddingRight: '16px' }}>
            <Contributions
              contributionKey={PAYMENT_DEDUPLICATION_DIALOG_CONTRIBUTION_KEY}
              paymentCycle={paymentCycleUuid}
            />
          </div>
        </div>
      </Grid>
      <Contributions
        contributionKey={PAYMENT_CYCLE_TABS_PANEL_CONTRIBUTION_KEY}
        rights={rights}
        value={activeTab}
        setConfirmedAction={setConfirmedAction}
        paymentCycleUuid={paymentCycleUuid}
      />
    </Paper>
  );
}

export default PaymentCycleTab;
