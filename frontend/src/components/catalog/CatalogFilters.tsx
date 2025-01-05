import { TagFilters } from '@components/ui/tags';
import { Search } from '@mui/icons-material';
import { Box, Divider, InputAdornment, Paper, TextField } from '@mui/material';
import { createSx } from '@theme';
import { TagEntry, TagFilterOption, TagValue } from '@types';

const sx = createSx({
  paper: {
    display: 'flex'
  },
  input: {
    width: 280
  }
});

interface Props {
  search: string;
  tagEntries: TagEntry[];
  tagValues: TagValue[];
  tagOptions: TagFilterOption[];
  defaultTagEntries: TagEntry[];
  onAddEntry: () => void;
  onDeleteEntry: (index: number) => void;
  onUpdateEntry: (index: number, set: TagEntry) => void;
  onSubmitValues: (values: TagValue[]) => void;
  onSearchChange: (set: string) => void;
}

export const CatalogFilters = ({
  search,
  tagOptions,
  tagValues,
  tagEntries,
  defaultTagEntries,
  onAddEntry,
  onDeleteEntry,
  onUpdateEntry,
  onSubmitValues,
  onSearchChange
}: Props) => {
  return (
    <Paper square variant='outlined' sx={sx.paper}>
      <Box py={1} mx={2}>
        <TextField
          size='small'
          placeholder='Search... (WIP)'
          sx={sx.input}
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position='start'>
                  <Search />
                </InputAdornment>
              )
            }
          }}
        />
      </Box>
      <Divider orientation='vertical' />
      <Box py={1} mx={2} ml={1.5} display='flex' alignItems='center'>
        <TagFilters
          options={tagOptions}
          values={tagValues}
          entries={tagEntries}
          defaultEntries={defaultTagEntries}
          onAdd={onAddEntry}
          onDelete={onDeleteEntry}
          onUpdate={onUpdateEntry}
          onSubmit={onSubmitValues}
          inputSelectWidth={200}
        />
      </Box>
    </Paper>
  );
};
