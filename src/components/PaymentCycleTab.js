import React, { useState } from 'react';
import { Paper, Grid } from '@material-ui/core';
import { Contributions } from '@openimis/fe-core';
import { makeStyles } from '@material-ui/styles';
import {
  PAYMENT_CYCLE_BILLS_LIST_TAB_VALUE,
  PAYMENT_CYCLE_TABS_LABEL_CONTRIBUTION_KEY,
  PAYMENT_CYCLE_TABS_PANEL_CONTRIBUTION_KEY,
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

function PaymentCycleTab({ rights, setConfirmedAction }) {
  const classes = useStyles();

  const [activeTab, setActiveTab] = useState(PAYMENT_CYCLE_BILLS_LIST_TAB_VALUE);

  const isSelected = (tab) => tab === activeTab;

  const tabStyle = (tab) => (isSelected(tab) ? classes.selectedTab : classes.unselectedTab);

  const handleChange = (_, tab) => setActiveTab(tab);

  return (
    <Paper className={classes.paper}>
      <Grid container className={`${classes.tableTitle} ${classes.tabs}`}>
        <Contributions
          contributionKey={PAYMENT_CYCLE_TABS_LABEL_CONTRIBUTION_KEY}
          rights={rights}
          value={activeTab}
          onChange={handleChange}
          isSelected={isSelected}
          tabStyle={tabStyle}
        />
      </Grid>
      <Contributions
        contributionKey={PAYMENT_CYCLE_TABS_PANEL_CONTRIBUTION_KEY}
        rights={rights}
        value={activeTab}
        setConfirmedAction={setConfirmedAction}
      />
    </Paper>
  );
}

export default PaymentCycleTab;
