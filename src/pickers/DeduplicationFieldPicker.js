import React, { useState } from 'react';
import { useTranslations, Autocomplete } from '@openimis/fe-core';
import { BASIC_FIELDS } from '../constants';

function DeduplicationFieldPicker({
  readOnly,
  value,
  onChange,
  required,
  multiple = true,
  placeholder,
  withLabel,
  withPlaceholder,
  label,
  filterOptions,
  filterSelectedOptions,
  globalSchema,
}) {
  const [searchString, setSearchString] = useState();
  const { formatMessage } = useTranslations('deduplication');

  let parsedSchema = globalSchema;
  if (typeof globalSchema === 'string') {
    try {
      parsedSchema = JSON.parse(globalSchema);
    } catch (error) {
      parsedSchema = null;
    }
  }

  // eslint-disable-next-line max-len
  const schemaFields = parsedSchema?.properties ? Object.keys(parsedSchema.properties).map((key) => ({ id: key, name: key })) : [];
  const possibleFields = [...BASIC_FIELDS, ...schemaFields];

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      placeholder={placeholder ?? formatMessage('deduplication.deduplicate.fields.placeholder')}
      label={label ?? formatMessage('deduplication.deduplicate.fields')}
      error={[]}
      withLabel={withLabel}
      withPlaceholder={withPlaceholder}
      readOnly={readOnly}
      options={possibleFields}
      isLoading={false}
      value={value}
      getOptionLabel={(o) => o?.name}
      onChange={(option) => onChange(option, option?.name)}
      filterOptions={filterOptions}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={() => setSearchString(searchString)}
    />
  );
}

export default DeduplicationFieldPicker;
