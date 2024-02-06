import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import {
  Paper, Grid, Divider, IconButton,
} from '@material-ui/core';
import {
  FormattedMessage,
  useTranslations,
  useModulesManager,
  PublishedComponent,
  coreConfirm,
  clearConfirm,
  journalize,
} from '@openimis/fe-core';
import SendIcon from '@material-ui/icons/Send';
import { fetchPaymentCycles, generatePaymentCycle } from '../actions';
import { YEAR_CEILING, YEAR_FLOOR } from '../constants';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(1),
  },
  paperHeader: theme.paper.header,
  paperHeaderTitle: theme.paper.title,
  paperHeaderAction: theme.paper.action,
  form: {
    padding: 0,
  },
  item: {
    padding: theme.spacing(1),
  },
  paperDivider: theme.paper.divider,
}));
function PaymentCycleLauncher({
  generatePaymentCycle,
  confirmed,
  coreConfirm,
  clearConfirm,
  mutation,
  submittingMutation,
  fetchPaymentCycles,
}) {
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage, formatMessageWithValues } = useTranslations('paymentCycle', modulesManager);
  const prevSubmittingMutationRef = useRef();
  const [filters, setFilters] = useState({});
  const min = new Date().getFullYear() - YEAR_FLOOR;
  const max = min + YEAR_CEILING;

  useEffect(() => {
    if (confirmed) {
      generatePaymentCycle(
        filters,
        formatMessageWithValues('paymentCycle.generate.mutationLabel', {
          year: filters.year,
          month: filters.monthString,
        }),
      );
    }
    return () => confirmed && clearConfirm(false);
  }, [confirmed]);

  useEffect(() => {
    console.log(submittingMutation);
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      journalize(mutation);
      if (mutation?.clientMutationId) {
        fetchPaymentCycles(modulesManager, [`clientMutationId: "${mutation.clientMutationId}"`]);
      }
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  const canLaunch = () => filters?.year && filters?.month;

  const launchPaymentCycle = () => {
    coreConfirm(
      formatMessage('paymentCycle.confirm.title'),
      formatMessageWithValues(
        'generatePaymentCycle.confirm.message',
        {
          year: filters.year,
          month: filters.monthString,
        },
      ),
    );
  };

  return (
    <Paper className={classes.paper}>
      <Grid container className={classes.paperHeader}>
        <Grid item xs={11} className={classes.paperHeaderTitle}>
          <FormattedMessage module="paymentCycle" id="paymentCycleLauncher.title" />
        </Grid>
        <Grid item xs={1}>
          <Grid container justify="flex-end">
            <Grid item className={classes.paperHeaderAction}>
              <IconButton disabled={!canLaunch()} onClick={launchPaymentCycle}>
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.YearPicker"
            module="paymentCycle"
            label="year"
            min={min}
            max={max}
            withNull={false}
            value={filters?.year}
            required
            onChange={(e) => setFilters({ ...filters, year: e })}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.MonthPicker"
            module="paymentCycle"
            label="month"
            value={filters?.month}
            withNull={false}
            required
            onChange={(value, string) => setFilters({ ...filters, month: value, monthString: string })}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

const mapStateToProps = (state) => ({
  confirmed: state.core.confirmed,
  submittingMutation: state.paymentCycle.submittingMutation,
  mutation: state.paymentCycle.mutation,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    generatePaymentCycle,
    fetchPaymentCycles,
    coreConfirm,
    clearConfirm,
    journalize,
  },
  dispatch,
);
export default connect(mapStateToProps, mapDispatchToProps)(PaymentCycleLauncher);
