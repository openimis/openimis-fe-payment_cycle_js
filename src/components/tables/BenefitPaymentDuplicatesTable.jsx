/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  FormattedMessage,
} from '@openimis/fe-core';

const StyledBenefitPaymentDuplicatesTable = styled('div')(({ theme }) => ({
  '& .paper': theme.paper?.paper ?? {},
  '& .table': theme.table ?? {},
  '& .tableTitle': theme.table?.title ?? {},
  '& .tableHeader': theme.table?.header ?? {},
  '& .tableRow': theme.table?.row ?? {},
  '& .title': theme.paper?.title ?? {},
  '& .tableDisabledRow': theme.table?.disabledRow ?? {},
  '& .tableDisabledCell': theme.table?.disabledCell ?? {},
  '& .tableContainer': {
    overflow: 'auto',
  },
  '& .hoverableCell': {
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
    cursor: 'pointer',
  },
  '& .selectedCell': {
    backgroundColor: '#a1caf1',
  },
  '& .checkboxCell': {
    textAlign: 'center',
  },
  '& .deactivatedRow': {
    opacity: 0.5,
  },
  '& .strikethrough': {
    textDecoration: 'line-through',
  },
}));

function BenefitPaymentDuplicatesTable({
  headers, rows, completedData, setAdditionalData, businessData,
}) {
  const shouldCrossText = (rowIndex) => rows[rowIndex]?.is_deleted;
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleted, setIsDeleted] = useState(!!completedData);

  useEffect(() => {
    if (businessData && businessData.count !== businessData.ids.length) {
      setSelectedRows([]);
      setIsDeleted(true);
    }
  }, [businessData]);

  const handleCheckboxChange = (rowIndex) => {
    const newSelectedRows = [...selectedRows];
    const index = newSelectedRows.indexOf(rowIndex);
    if (index !== -1) {
      newSelectedRows.splice(index, 1);
    } else {
      newSelectedRows.push(rowIndex);
    }
    if (newSelectedRows.length < rows.length) {
      setSelectedRows(newSelectedRows);
      const benefitIds = newSelectedRows.map((idx) => rows[idx].benefitId);
      const additionalDataString = `{\\"benefitIds\\": ${JSON.stringify(benefitIds).replace(/"/g, '\\"')}}`;
      // eslint-disable-next-line object-shorthand
      setAdditionalData(additionalDataString);
    }
  };

  const shouldDisableCell = (rowIndex) => selectedRows.includes(rowIndex);

  return (
    <StyledBenefitPaymentDuplicatesTable>
      <div className="tableContainer">
        <TableContainer className="paper">
          <Table size="small" className="table" aria-label="dynamic table">
            <TableHead className="header">
              <TableRow className="header">
                <TableCell key="checkbox-header-merge" className="checkboxCell">
                  <FormattedMessage module="paymentCycle" id="PaymentDuplicatesTable.merge.header" />
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
                  className="tableRow"
                >
                  <TableCell key={`checkbox-cell-${rowIndex}`} className="checkboxCell">
                    <Checkbox
                      color="primary"
                      checked={selectedRows.includes(rowIndex)}
                      onChange={() => handleCheckboxChange(rowIndex)}
                      disabled={isDeleted || (selectedRows.length === rows.length - 1 && !selectedRows.includes(rowIndex))}
                    />
                  </TableCell>
                  {headers.map((header, headerIndex) => (
                    <TableCell
                      key={headerIndex}
                      className={`} 
                      ${shouldDisableCell(rowIndex) || isDeleted ? 'tableDisabledCell' : ''}
                      ${shouldCrossText(rowIndex) ? 'strikethrough' : ''}
                      `}
                    >
                      {row[header]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </StyledBenefitPaymentDuplicatesTable>
  );
}

export default BenefitPaymentDuplicatesTable;
