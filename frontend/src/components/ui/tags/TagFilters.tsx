import { useMemo, useState } from 'react';
import { createSx, MaterialSxProps } from '@theme';
import { TagEntry, TagFilterOption, TagValue } from '@types';
import { Box, Chip, Tooltip } from '@mui/material';
import { TagChip } from '@components/ui/tags';
import { Add, FilterAlt } from '@mui/icons-material';

const _sx = createSx({
  container: {
    display: 'flex',
    gap: 1
  },
  onAdd: {
    display: 'flex',
    alignItems: 'center',
    color: t => t.palette.grey[500],
    bgcolor: t => t.palette.grey[100],
    '& > span': { display: 'flex', alignItems: 'center' }
  }
});

interface Props {
  options: TagFilterOption[];
  values?: TagValue[];
  defaultEntries?: TagEntry[];
  entries?: TagEntry[];
  sx?: MaterialSxProps;
  inputSelectWidth?: number;
  onAdd: () => void;
  onUpdate: (index: number, set: TagEntry) => void;
  onDelete: (index: number) => void;
  onSubmit: (values: TagValue[]) => void;
}

export const TagFilters = ({
  options,
  values = [],
  defaultEntries,
  entries,
  sx,
  inputSelectWidth,
  onAdd,
  onUpdate,
  onDelete,
  onSubmit
}: Props) => {
  const [editing, setEditing] = useState<string | null>(null);

  const availableOptions = useMemo(() => {
    return options.filter(i => !entries?.find(x => x.id === i.id)
      && !defaultEntries?.find(x => x.id === i.id));
  }, [options, entries, defaultEntries]);

  const handleUpdateEntry = (index: number) => (set: TagEntry) => {
    onUpdate(index, set);
  };

  const handleSubmit = (set: TagValue[], e?: React.MouseEvent | React.TouchEvent) => {
    if (!e?.target) {
      setEditing(null);
      onSubmit(set);
      return;
    }

    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON') {
      // Other chip that is not currently being edited.
      if (target.parentElement?.hasAttribute('data-entry-id')) {
        const nextEntryId = target.parentElement.getAttribute('data-entry-id');
        setEditing(nextEntryId);
      }
      else {
        setEditing(null);
      }

      if (target.parentElement?.hasAttribute('data-entry-action')) {
        const nextAction = target.parentElement.getAttribute('data-entry-action');
        if (nextAction === 'add') {
          onAdd();
        }
      }
    }
    else {
      setEditing(null);
    }

    onSubmit(set);
  };

  const newDisabled = availableOptions.length === 0 || availableOptions.length - (entries?.filter(i => !i.id).length ?? 0) <= 0;

  return (
    <Box sx={[_sx.container, sx] as MaterialSxProps}>
      {defaultEntries?.map(entry => {
        const opt = options.find(i => i.id === entry.id) as TagFilterOption;
        const optValues = values.filter(i => opt.key instanceof Array
          ? opt.key.includes(i.key)
          : opt.key === i.key);

        return (
          <TagChip
            key={entry.id}
            option={opt}
            values={optValues}
            entry={entry}
            editing={editing === entry.id}
            isDefault
            inputSelectWidth={inputSelectWidth}
            onSubmit={handleSubmit}
            onClick={() => setEditing(entry.id)}
          />
        );
      })}
      {entries?.map((entry, index) => {
        const opt = options.find(i => i.id === entry.id) as TagFilterOption;
        const optValues = values.filter(i => opt ? opt.key instanceof Array
          ? opt.key.includes(i.key)
          : opt.key === i.key
          : false);

        return (
          <TagChip
            key={index}
            option={opt ?? null}
            values={optValues}
            availableOptions={availableOptions}
            entry={entry}
            inputSelectWidth={inputSelectWidth}
            editing={editing === entry.id}
            onChange={handleUpdateEntry(index)}
            onDelete={() => onDelete(index)}
            onSubmit={handleSubmit}
            onClick={() => setEditing(entry.id)}
          />
        );
      })}
      <Tooltip title='Add new filter'>
        <Chip
          color='default'
          onClick={onAdd}
          data-entry-action='add'
          disabled={newDisabled}
          variant='outlined'
          sx={_sx.onAdd}
          label={(
            <>
              <FilterAlt />
              <Add />
            </>
          )}
        />
      </Tooltip>
    </Box>
  );
};
