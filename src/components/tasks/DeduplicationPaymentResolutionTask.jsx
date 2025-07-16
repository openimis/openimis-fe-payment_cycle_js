import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import BenefitPaymentDuplicatesTable from '../tables/BenefitPaymentDuplicatesTable';

const useStyles = makeStyles((theme) => ({
  paper: theme.paper.paper,
  title: theme.paper.title,
}));

function DeduplicationPaymentResolutionTaskDisplay({
  businessData, setAdditionalData, jsonExt,
}) {
  if (!businessData) return null;

  const classes = useStyles();
  const completedData = jsonExt?.additional_resolve_data
    ? Object.values(jsonExt.additional_resolve_data)[0].values
    : null;
  const benefits = (businessData?.ids || []).map((id) => {
    const {
      // eslint-disable-next-line camelcase
      individual, json_ext, uuid, ...rest
    } = id;
    return {
      ...rest,
      ...individual,
      // eslint-disable-next-line camelcase
      ...json_ext,
      individual: individual.uuid,
      benefitId: uuid,
    };
  });

  const headers = businessData?.headers || [];
  const individualIndex = headers.indexOf('individual');

  if (individualIndex !== -1) {
    headers.splice(individualIndex, 1);
    headers.unshift('individual');
  }

  benefits.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));

  return (
    <div>
      <Typography className={classes.title} style={{ textAlign: 'center' }}>
        {JSON.stringify(businessData?.column_values)}
        {' '}
        ,
        count:
        {' '}
        {businessData?.count}
      </Typography>
      <div>
        <BenefitPaymentDuplicatesTable
          headers={headers}
          rows={benefits}
          setAdditionalData={setAdditionalData}
          completedData={completedData}
          businessData={businessData}
        />

      </div>
    </div>
  );
}

const DeduplicationPaymentResolutionTaskTableHeaders = () => [];

const DeduplicationPaymentResolutionItemFormatters = () => [
  (businessData, jsonExt, formatterIndex, setAdditionalData) => (
    <DeduplicationPaymentResolutionTaskDisplay
      businessData={businessData}
      setAdditionalData={setAdditionalData}
      jsonExt={jsonExt}
    />
  ),
];

export { DeduplicationPaymentResolutionTaskTableHeaders, DeduplicationPaymentResolutionItemFormatters };
