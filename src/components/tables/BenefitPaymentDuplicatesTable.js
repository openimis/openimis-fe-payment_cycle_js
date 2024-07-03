/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import {
  makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox,
} from '@material-ui/core';
import {
  FormattedMessage,
} from '@openimis/fe-core';

const useStyles = makeStyles((theme) => ({
  paper: theme.paper.paper,
  table: theme.table,
  tableTitle: theme.table.title,
  tableHeader: theme.table.header,
  tableRow: theme.table.row,
  title: theme.paper.title,
  tableDisabledRow: theme.table.disabledRow,
  tableDisabledCell: theme.table.disabledCell,
  tableContainer: {
    overflow: 'auto',
  },
  hoverableCell: {
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
    cursor: 'pointer',
  },
  selectedCell: {
    backgroundColor: '#a1caf1',
  },
  checkboxCell: {
    textAlign: 'center',
  },
  deactivatedRow: {
    opacity: 0.5,
  },
  strikethrough: {
    textDecoration: 'line-through',
  },
}));

function BenefitPaymentDuplicatesTable({
  headers, rows, completedData,
}) {
  const classes = useStyles();
  const [dontMergeRows, setDontMergeRows] = useState([]);
  const shouldDisableCell = (rowIndex) => dontMergeRows.includes(rowIndex);
  const shouldCrossText = (rowIndex) => rows[rowIndex]?.is_deleted;

  useEffect(() => {
    if (completedData) {
      const numberOfRows = Array.from(Array(rows.length).keys());
      setDontMergeRows(numberOfRows);
    }
  }, [completedData]);

  return (
    <div className={classes.tableContainer}>
      <TableContainer className={classes.paper}>
        <Table size="small" className={classes.table} aria-label="dynamic table">
          <TableHead className={classes.header}>
            <TableRow className={classes.header}>
              <TableCell key="checkbox-header-merge" className={classes.checkboxCell}>
                <FormattedMessage module="deduplication" id="BeneficiaryDuplicatesTable.merge.header" />
              </TableCell>
              <TableCell key="checkbox-header" className={classes.checkboxCell}>
                <FormattedMessage module="deduplication" id="BeneficiaryDuplicatesTable.checkbox.header" />
              </TableCell>
              {headers.map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={classes.tableRow}
              >
                <TableCell key={`checkbox-cell-${rowIndex}`} className={classes.checkboxCell}>
                  <Checkbox
                    color="primary"
                    onChange={() => {}}
                    disabled={shouldDisableCell(rowIndex)}
                  />
                </TableCell>
                {headers.map((header, headerIndex) => (
                  <TableCell
                    key={headerIndex}
                    className={`} 
                    ${shouldDisableCell(rowIndex) ? classes.tableDisabledCell : ''}
                    ${shouldCrossText(rowIndex) ? classes.strikethrough : ''}
                    `}
                  >
                    {row[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow
              className={classes.tableRow}
            >
              <TableCell className={classes.checkboxCell} />
              <TableCell className={classes.checkboxCell}>
                <FormattedMessage module="deduplication" id="BeneficiaryDuplicatesTable.output" />
              </TableCell>
              {headers.map((header, headerIndex) => (
                <TableCell
                  key={headerIndex}
                  className={`${classes.tableDisabledCell} 
                  ${completedData ? classes.selectedCell : ''}`}
                >
                  {rows[0][header]}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default BenefitPaymentDuplicatesTable;
