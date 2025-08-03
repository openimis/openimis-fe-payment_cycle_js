import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { formatMessage } from '@openimis/fe-core';
import { styled } from '@mui/material/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeduplicationSummaryTable from '../tables/DeduplicationSummaryTable';
import { createDeduplicationTasks, fetchDeduplicationSummary } from '../../actions';

const StyledDeduplicationSummaryDialog = styled('div')(({ theme }) => ({
  '& .item': theme.paper.item,
}));

function DeduplicationSummaryDialog({
  intl,
  paymentCycle,
  handleClose,
  showSummaryDialog,
  setShowSummaryDialog,
  selectedValues,
  createDeduplicationTasks,
}) {
  const [summary, setSummary] = useState();
  if (!paymentCycle) return null;

  const columns = selectedValues.map((value) => value.id);
  const columnParam = `columns: ${JSON.stringify(columns)}`;

  const onDeduplicationTasksClick = () => {
    if (summary) {
      // eslint-disable-next-line max-len
      createDeduplicationTasks(summary, paymentCycle, formatMessage(intl, 'deduplication', 'deduplicate.mutation.createTasks'));
    }
    setShowSummaryDialog(false);
  };

  return (
    <StyledDeduplicationSummaryDialog>
      <Dialog
        open={showSummaryDialog}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: 900,
            maxWidth: 900,
          },
        }}
      >
        <DialogTitle
          style={{
            marginTop: '10px',
          }}
        >
          {formatMessage(intl, 'deduplication', 'deduplicate.summary.title')}
        </DialogTitle>
        <DialogContent>
          <DeduplicationSummaryTable
            columnParam={columnParam}
            paymentCycle={paymentCycle}
            fetchDeduplicationSummary={fetchDeduplicationSummary}
            setSummary={setSummary}
          />
        </DialogContent>
        <DialogActions
          style={{
            display: 'inline',
            paddingLeft: '10px',
            marginTop: '25px',
            marginBottom: '15px',
          }}
        >
          <div>
            <div style={{ float: 'left' }}>
              <Button
                onClick={() => onDeduplicationTasksClick()}
                variant="outlined"
                autoFocus
                disabled={!summary}
                style={{ margin: '0 16px' }}
              >
                {formatMessage(intl, 'deduplication', 'deduplicate.button.createDeduplicationReviewTask')}
              </Button>
            </div>
            <div style={{
              float: 'right',
              paddingRight: '16px',
            }}
            >
              <Button
                onClick={handleClose}
                variant="outlined"
                autoFocus
                style={{ margin: '0 16px' }}
              >
                {formatMessage(intl, 'deduplication', 'deduplicate.button.cancel')}
              </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </StyledDeduplicationSummaryDialog>
  );
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  confirmed: state.core.confirmed,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createDeduplicationTasks,
}, dispatch);

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(DeduplicationSummaryDialog),
);
