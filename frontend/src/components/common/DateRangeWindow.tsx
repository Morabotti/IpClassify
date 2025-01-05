import { Popper, ClickAwayListener } from '@mui/base';
import { Box, Button, Radio, Stack, Divider, Paper, FormControlLabel, RadioGroup, Grow } from '@mui/material';
import { Text } from '@components/common';
import dayjs from 'dayjs';
import { Fragment, useEffect, useState } from 'react';
import { DateTimeField } from '@mui/x-date-pickers';
import { createSx } from '@theme';
import { DateField, DateQueryWithLabel, DateRangeState } from '@types';

const beforeFields: DateField[] = [
  { label: 'Last 1 day', after: -1, before: 0 },
  { label: 'Last 7 days', after: -7, before: 0 },
  { label: 'Last 1 month', after: -30, before: 0 },
  { label: 'Last 3 months', after: -90, before: 0 },
  { label: 'Last 6 months', after: -183, before: 0 },
  { label: 'Last 1 year', after: -365, before: 0 }
];

const smallFields: DateField[] = [
  { label: 'Last 30 mins', after: -30, before: 0 },
  { label: 'Last 1 hour', after: -60, before: 0 },
  { label: 'Last 4 hours', after: -(60 * 4), before: 0 },
  { label: 'Last 8 hours', after: -(60 * 8), before: 0 },
  { label: 'Last 12 hours', after: -(60 * 12), before: 0 }
];

const toState = (set: DateQueryWithLabel): DateRangeState => {
  return {
    label: set.label ?? 'Custom',
    after: set.after ? dayjs(set.after) : null,
    before: set.before ? dayjs(set.before) : null
  };
};

const toQuery = (set: DateRangeState): DateQueryWithLabel => {
  return {
    label: set.label ?? 'Custom',
    after: set.after?.valueOf() ?? null,
    before: set.before?.valueOf() ?? null
  };
};

const sx = createSx({
  paper: {
    p: 2,
    gap: 1,
    display: 'flex',
    flexDirection: 'column',
    width: 350
  },
  radioElement: {
    p: 0.75
  },
  input: {
    '& label': {
      backgroundColor: t => t.palette.background.paper,
      pr: 0.5,
      pl: 0.5
    }
  }
});

interface Props {
  element: HTMLElement | null;
  open: boolean;
  baseValues: DateQueryWithLabel;
  showClear?: boolean;
  onChange: (set: DateQueryWithLabel | null, e: React.MouseEvent<HTMLButtonElement>) => void;
  onClose?: () => void;
}

export const DateRangeWindow = ({
  element,
  open,
  baseValues,
  showClear,
  onChange,
  onClose
}: Props) => {
  const [tempQuery, setTempQuery] = useState<DateRangeState>(toState(baseValues));

  useEffect(() => {
    if (open) return;
    setTempQuery(toState(baseValues));
  }, [baseValues, open]);

  const onSetRelative = (
    relativeAfter: null | number,
    relativeBefore: null | number,
    units: 'days' | 'minutes',
    label: string
  ) => {
    setTempQuery({
      label: label,
      after: relativeAfter !== null
        ? (units === 'days' ? dayjs().startOf('day').add(relativeAfter, units) : dayjs().add(relativeAfter, units))
        : null,
      before: relativeBefore !== null
        ? (units === 'days' ? dayjs().endOf('day').add(relativeBefore, units) : dayjs().add(relativeBefore, units))
        : null
    });
  };

  if (!element) {
    return <Fragment />;
  }

  return (
    <Popper
      role={undefined}
      open={open}
      anchorEl={element}
      placement='bottom-start'
      style={{ zIndex: 1250 }}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 0]
          }
        }
      ]}
    >
      <ClickAwayListener onClickAway={onClose ? onClose : () => {}}>
        <Grow in={open} timeout={150}>
          <Paper sx={sx.paper} elevation={8}>
            <Box>
              <Text variant='body1' gutterBottom fontWeight={600}>Select date range: </Text>
              <Box display='flex' mx={1}>
                <Box display='flex' flexDirection='column' width='100%'>
                  <RadioGroup>
                    {beforeFields.map((field, index) => (
                      <FormControlLabel
                        key={`big-${index}`}
                        checked={field.label === tempQuery.label}
                        control={<Radio size='small' sx={sx.radioElement} />}
                        label={field.label}
                        onChange={() => onSetRelative(field.after, field.before, 'days', field.label)}
                      />
                    ))}
                  </RadioGroup>
                </Box>
                <Box display='flex' flexDirection='column' width='100%'>
                  <RadioGroup>
                    {smallFields.map((field, index) => (
                      <FormControlLabel
                        key={`small-${index}`}
                        checked={field.label === tempQuery.label}
                        control={<Radio size='small' sx={sx.radioElement} />}
                        label={field.label}
                        onChange={() => onSetRelative(field.after, field.before, 'minutes', field.label)}
                      />
                    ))}
                    <FormControlLabel
                      control={<Radio size='small' sx={sx.radioElement} />}
                      label='Custom'
                      checked={tempQuery.label === 'Custom'}
                      onChange={() => onSetRelative(-10, 0, 'minutes', 'Custom')}
                    />
                  </RadioGroup>
                </Box>
              </Box>
            </Box>
            <Divider />
            <Box gap={2} display='flex' flexDirection='column' my={0.5}>
              <DateTimeField
                label='Filter after'
                value={tempQuery?.after ?? null}
                size='small'
                fullWidth
                format='DD/MM/YYYY HH:mm'
                sx={sx.input}
                onChange={(after) => setTempQuery(prev => ({ ...prev, after }))}
              />
              <DateTimeField
                label='Filter before'
                value={tempQuery?.before ?? null}
                size='small'
                fullWidth
                format='DD/MM/YYYY HH:mm'
                sx={sx.input}
                onChange={(before) => setTempQuery(prev => ({ ...prev, before }))}
              />
            </Box>
            <Divider />
            <Stack direction='row-reverse' gap={1}>
              <Button
                variant='contained'
                color='secondary'
                size='small'
                onClick={(e) => onChange(toQuery(tempQuery), e)}
                disableElevation
              >
                Enter
              </Button>
              {onClose && (
                <Button
                  variant='contained'
                  color='primary'
                  size='small'
                  onClick={onClose}
                  disableElevation
                >
                  Close
                </Button>
              )}
              {showClear && (
                <Button
                  variant='contained'
                  color='error'
                  size='small'
                  onClick={e => onChange({ label: '', after: null, before: null }, e)}
                  disableElevation
                >
                  Clear
                </Button>
              )}
            </Stack>
          </Paper>
        </Grow>
      </ClickAwayListener>
    </Popper>
  );
};
