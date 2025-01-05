import { TagFilters } from '@components/ui/tags';
import { accessRecordTagsOptions } from '@constants';
import { useTagFilters } from '@hooks';
import { Search } from '@mui/icons-material';
import { Box, Divider, InputAdornment, Paper, TextField } from '@mui/material';
import { createSx } from '@theme';

const sx = createSx({
  paper: {
    display: 'flex'
  }
});

export const CatalogFilters = () => {
  const tags = useTagFilters({
    options: accessRecordTagsOptions,
    defaultEntries: [{ id: 'createdAt' }]
  });

  return (
    <Paper square variant='outlined' sx={sx.paper}>
      <Box py={1} mx={2}>
        <TextField
          size='small'
          placeholder='Search...'
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
          options={tags.tagOptions}
          values={tags.tagValues}
          entries={tags.entries}
          onAdd={tags.onAddEntry}
          onDelete={tags.onDeleteEntry}
          onUpdate={tags.onUpdateEntry}
          onSubmit={tags.onSubmitValues}
          defaultEntries={tags.defaultEntries}
          inputSelectWidth={200}
        />
      </Box>
    </Paper>
  );
};
