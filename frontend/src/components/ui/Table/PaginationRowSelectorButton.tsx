import { LibraryBooksOutlined } from '@mui/icons-material';
import { Button, Menu, MenuItem } from '@mui/material';
import { MaterialSxProps, createSx } from '@theme';
import { useState } from 'react';

const _sx = createSx({
  button: {
    color: t => t.palette.text.primary,
    borderColor: 'rgba(0, 0, 0, 0.23)'
  },
  icon: {
    mr: 1,
    fontSize: '1.2rem'
  },
  open: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)'
  }
});

interface Props {
  rows: number;
  options?: number[];
  sx?: MaterialSxProps;
  onChange: (set: number) => void;
}

export const PaginationRowSelectorButton = ({
  rows,
  sx = {},
  options = [10, 20, 30, 50, 100, 150, 200, 300],
  onChange
}: Props) => {
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);

  const handleSelect = (set: number) => () => {
    onChange(set);
    setOpen(null);
  };

  return (
    <>
      <Button
        variant='outlined'
        color='inherit'
        sx={[_sx.button, (open && _sx.open), sx] as MaterialSxProps}
        onClick={(e) => setOpen(e.currentTarget)}
        size='small'
        startIcon={<LibraryBooksOutlined sx={_sx.icon} />}
      >
        {rows}
      </Button>
      <Menu
        anchorEl={open}
        open={!!open}
        onClose={() => setOpen(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        {options.map(option => (
          <MenuItem
            key={option}
            onClick={handleSelect(option)}
            selected={option === rows}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
