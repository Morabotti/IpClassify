import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DateRangeWindow, Text } from '@components/common';
import { Clear } from '@mui/icons-material';
import { Box, Chip, ClickAwayListener, Select, MenuItem, TextField, Checkbox, FormControlLabel, inputBaseClasses, Autocomplete, buttonBaseClasses, autocompleteClasses } from '@mui/material';
import { createSx, MaterialSxProps, selector } from '@theme';
import { DateQueryWithLabel, TagEntry, TagFilterOption, TagOption, TagValue } from '@types';
import { getDefaultInputValue } from '@utils/tagUtils';

const inputHeight = 25;

const sx = createSx({
  editingSelect: {
    height: inputHeight,
    padding: '0px 12px',
    lineHeight: `${inputHeight}px`,
    '& > div': {
      pr: 2
    },
    [selector.on(inputBaseClasses.focused)]: {
      outline: 0
    }
  },
  editingInput: {
    '& > div': {
      height: inputHeight,
      padding: '0px 12px',
      lineHeight: `${inputHeight}px`,
      fontSize: t => t.typography.body2.fontSize,
      [selector.on(inputBaseClasses.focused)]: {
        outline: 0
      }
    }
  },
  editingAutocomplete: {
    width: 170,
    '& > div > div': {
      height: inputHeight,
      lineHeight: `${inputHeight}px`,
      pr: `16px !important`,
      [selector.on(inputBaseClasses.focused)]: {
        outline: 0
      }
    },
    [selector.onChild(autocompleteClasses.endAdornment)]: {
      right: '0 !important'
    },
    [selector.onChildElement('button', buttonBaseClasses.root)]: {
      border: 'none',
      background: 'transparent'
    }
  },
  readOnly: {
    fontSize: t => t.typography.body2.fontSize,
    color: t => t.palette.grey[500],
    bgcolor: t => t.palette.grey[100]
  }
});

interface Props {
  entry: TagEntry;
  option: TagFilterOption | null;
  values: TagValue[];
  availableOptions?: TagFilterOption[];
  isDefault?: boolean;
  editing?: boolean;
  inputSelectWidth?: number;
  onDelete?: () => void;
  onClick?: () => void;
  onChange?: (set: TagEntry) => void;
  onSubmit?: (values: TagValue[], e?: React.MouseEvent | React.TouchEvent) => void;
}

export const TagChip = ({
  entry,
  option: opt,
  values,
  availableOptions = [],
  isDefault,
  editing,
  inputSelectWidth,
  onClick,
  onDelete,
  onChange,
  onSubmit
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inputs, setInputs] = useState<unknown[]>([]);

  useEffect(() => {
    if (editing || (!isDefault && values.length === 0)) {
      const newValues = values.map(i => i.value);
      setInputs(newValues.length === 0
        ? opt?.key instanceof Array
          ? opt.key.map(() => getDefaultInputValue(opt))
          : [getDefaultInputValue(opt)]
        : newValues
      );
    }
  }, [values, editing, isDefault, opt]);

  const handleOnChangeValue = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => prev.map((i, j) => j === index ? e.target.value : i));
  };

  const handleOnChangeCustom = (index: number, value: unknown) => {
    setInputs(prev => prev.map((i, j) => j === index ? value : i));
  };

  const handleSubmit = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (!opt || !onSubmit) return;

    const isArray = (opt.key instanceof Array);

    if (isArray ? opt.key.length !== inputs.length : inputs.length === 0) {
      return;
    }

    const submitValues: TagValue[] = isArray
      ? (opt.key as string[]).map((key, index) => ({ key, value: inputs[index] }))
      : [{ key: opt.key as string, value: inputs[0] }];

    return onSubmit(submitValues, e);
  }, [onSubmit, opt, inputs]);

  const handleEnterSubmit = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      handleSubmit();
    }
  }, [handleSubmit]);

  const onCleanDefault = () => {
    if (!opt || !onSubmit) return;

    onSubmit(opt.key instanceof Array
      ? values.map(i => ({ key: i.key, value: null }))
      : [{ key: opt.key as string, value: null }]
    );
  };

  const handleDateRangeChange = (set: DateQueryWithLabel | null, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onSubmit || !opt) return;
    e.stopPropagation();
    e.preventDefault();

    const output: TagValue[] = [
      { key: opt.key[0], value: set?.after ?? null },
      { key: opt.key[1], value: set?.before ?? null }
    ];

    const label = set?.label === 'Custom' ? null : (set?.label || null);

    if (opt.key instanceof Array && opt.key[2]) {
      output.push({ key: opt.key[2], value: label });
    }

    setInputs(output.length === 3
      ? [set?.after ?? null, set?.before ?? null, label]
      : [set?.after ?? null, set?.before ?? null]
    );
    onSubmit(output, e);
  };

  if (entry.id === null || opt === null || editing || (!isDefault && values.length === 0)) {
    return (
      <ClickAwayListener
        onClickAway={e => handleSubmit(e as unknown as (React.MouseEvent | React.TouchEvent))}
        mouseEvent='onMouseDown'
      >
        <Chip
          color='primary'
          onClick={onClick}
          variant='outlined'
          ref={ref}
          size='medium'
          data-entry-id={entry.id}
          onDelete={isDefault ? onCleanDefault : onDelete}
          deleteIcon={<Clear />}
          label={(
            <>
              <Box display='flex' gap={0.5} alignItems='center'>
                {isDefault ? (
                  <Text>{opt?.label ?? entry.id}</Text>
                ) : (
                  <Select
                    autoFocus={entry.id === null}
                    size='small'
                    variant='outlined'
                    color='primary'
                    disabled={isDefault}
                    value={entry.id ?? ''}
                    onChange={e => onChange?.({ id: e.target.value })}
                    sx={[sx.editingSelect, { width: inputSelectWidth }] as MaterialSxProps}
                  >
                    {(opt ? [opt, ...availableOptions] : availableOptions).map(opt => (
                      <MenuItem dense key={opt.id} value={opt.id}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                <Text color='primary' fontWeight={600}> = </Text>
                {(!opt || opt.type === 'number' || opt.type === 'string') ? inputs.map((input, index) => (
                  <TextField
                    key={`${entry.id}-${index}-input`}
                    variant='outlined'
                    color='primary'
                    size='small'
                    autoFocus={entry.id !== null}
                    type={opt?.type === 'number' ? 'number' : 'text'}
                    value={typeof input === 'number' || typeof input === 'string' ? input : ''}
                    disabled={opt === null}
                    placeholder={opt?.placeHolderHelper}
                    onChange={handleOnChangeValue(index)}
                    onKeyDown={handleEnterSubmit}
                    sx={sx.editingInput}
                  />
                )) : opt.type === 'boolean' ? (
                  <FormControlLabel
                    key={`${opt.id}-boolean`}
                    control={(
                      <Checkbox
                        size='small'
                        color='primary'
                        sx={{ m: 0.75 }}
                        checked={!!inputs[0]}
                      />
                    )}
                    sx={{ ml: -0.5, mr: 0 }}
                    checked={!!inputs[0]}
                    onChange={() => handleOnChangeCustom(0, !inputs[0])}
                    label={opt.formatValue?.(inputs[0]) ?? (inputs[0] ? 'True' : 'False')}
                  />
                ) : opt.type === 'option' ? (
                  <Autocomplete
                    key={`${opt.id}-option`}
                    options={opt.options as TagOption[] ?? []}
                    autoFocus={entry.id !== null}
                    value={((typeof inputs[0] === 'boolean') ? null : (inputs[0] || null)) as TagOption}
                    isOptionEqualToValue={(o: TagOption, v) => o?.value === v}
                    onChange={(e, data) => handleOnChangeCustom(0, data?.value ?? null)}
                    loading={opt.options === undefined}
                    size='small'
                    color='primary'
                    noOptionsText='No options found'
                    openOnFocus
                    autoHighlight
                    disableClearable
                    blurOnSelect
                    includeInputInList
                    sx={sx.editingAutocomplete}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={opt?.placeHolderHelper}
                      />
                    )}
                  />
                ) : opt.type === 'auto-complete' ? (
                  <Autocomplete
                    key={`${opt.id}-option`}
                    options={opt.options?.map(i => i.value) ?? []}
                    autoFocus={entry.id !== null}
                    inputValue={((typeof inputs[0] === 'boolean') ? '' : (inputs[0] || '')) as string}
                    onInputChange={(e, text) => handleOnChangeCustom(0, text)}
                    loading={opt.options === undefined}
                    size='small'
                    color='primary'
                    noOptionsText='Unknown'
                    disableClearable
                    autoSelect
                    autoComplete
                    blurOnSelect
                    freeSolo
                    sx={sx.editingAutocomplete}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={opt?.placeHolderHelper}
                      />
                    )}
                  />
                ) : (
                  <Text fontSize='sm' fontWeight={600} sx={{ color: 'primary.main' }}>
                    {(values.length !== 0 ? (opt.formatValue
                      ? opt.formatValue(opt.key instanceof Array ? inputs : inputs[0])
                      : opt.key instanceof Array ? inputs : inputs[0])
                      : opt.emptyValue ?? 'All selected') as React.ReactNode}
                  </Text>
                )}
              </Box>
              {!!opt && inputs.length !== 0 && opt.type === 'date-range' && (
                <DateRangeWindow
                  // eslint-disable-next-line react-compiler/react-compiler
                  element={ref.current}
                  baseValues={{
                    after: inputs?.[0] as number ?? null,
                    before: inputs?.[1] as number ?? null,
                    label: inputs?.[2] as string ?? null
                  }}
                  onChange={handleDateRangeChange}
                  showClear
                  open
                />
              )}
            </>
          )}
        />
      </ClickAwayListener>
    );
  }

  const isArray = opt.key instanceof Array;
  const hasValues = values.length !== 0;
  const formattedValue = hasValues ? opt.formatValue
    ? opt.formatValue(isArray ? values.map(i => i.value) : values[0].value)
    : isArray ? values.map(i => i.value).join(', ') : values[0].value
    : (opt.emptyValue ?? 'All selected');

  return (
    <Chip
      color='default'
      onClick={onClick}
      variant='outlined'
      data-entry-id={entry.id}
      sx={sx.readOnly}
      deleteIcon={<Clear />}
      onDelete={(!isDefault || hasValues)
        ? (isDefault && onSubmit) ? onCleanDefault : onDelete
        : undefined}
      label={(
        <>
          {`${hasValues ? opt.label : opt.emptyLabel ?? opt.label} = `}
          <b>{formattedValue as React.ReactNode}</b>
        </>
      )}
    />
  );
};
