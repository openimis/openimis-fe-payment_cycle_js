import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  TableContainer, TableHead, TableBody, Table, TableCell, TableRow, Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { useModulesManager, ProgressOrError, useTranslations } from '@openimis/fe-core';
import { MODULE_NAME } from '../../constants';

const StyledDeduplicationSummaryTable = styled('div')(({ theme }) => ({
  '& .footer': {
    marginInline: 16,
    marginBlock: 12,
  },
  '& .headerTitle': theme.table?.title ?? {},
  '& .actionCell': {
    width: 60,
  },
  '& .header': theme.table?.header ?? {},
}));

const DEDUPLICATION_SUMMARY_HEADERS = [
  'deduplication.deduplicationSummaryTable.group',
  'deduplication.deduplicationSummaryTable.duplicates',
];

function DeduplicationSummaryTable({
  columnParam, paymentCycle, fetchDeduplicationSummary, setSummary,
}) {
  const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const {
    fetchingDeduplicationBenefitSummary, deduplicationBenefitSummary, errorDeduplicationBenefitSummary,
  } = useSelector((store) => store.paymentCycle);

  useEffect(() => {
    const params = [columnParam, `paymentCycleId: "${paymentCycle}"`];
    dispatch(fetchDeduplicationSummary(params));
  }, []);

  useEffect(() => {
    setSummary(deduplicationBenefitSummary);
  }, [deduplicationBenefitSummary]);

  function reshapeColumnValues(inputString) {
    const columnValues = JSON.parse(inputString);
    const formattedValues = Object.entries(columnValues).map(([key, value]) => {
      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const formattedValue = value !== null ? value : 'null';
      return `${formattedKey}: ${formattedValue}`;
    });
    const resultString = formattedValues.join(', ');
    return resultString;
  }

  return (
    <StyledDeduplicationSummaryTable>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead className="header">
            <TableRow className="headerTitle">
              {DEDUPLICATION_SUMMARY_HEADERS.map((header) => (
                <TableCell key={header}>
                  {' '}
                  {formatMessage(header)}
                  {' '}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <ProgressOrError progress={fetchingDeduplicationBenefitSummary} error={errorDeduplicationBenefitSummary} />
            {deduplicationBenefitSummary?.map((result) => (
              <TableRow key={result?.uuid}>
                <TableCell>
                  {' '}
                  {reshapeColumnValues(result.columnValues)}
                  {' '}
                </TableCell>
                <TableCell>
                  {' '}
                  {result.count}
                  {' '}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledDeduplicationSummaryTable>
  );
}

export default DeduplicationSummaryTable;
