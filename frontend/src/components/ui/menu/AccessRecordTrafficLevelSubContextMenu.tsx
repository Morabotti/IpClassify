import { TrafficLevel } from '@enums';
import { ListItemIcon, MenuItem } from '@mui/material';
import { NestedMenuItem } from './NestedMenuItem';
import { TrafficLevelChip } from '@components/common';

interface Props {
  parentOpen: boolean;
  label: string;
  icon: React.ReactNode;
  selected?: TrafficLevel | null;
  onSelect: (set: TrafficLevel) => void;
}

export const AccessRecordTrafficLevelSubContextMenu = ({
  parentOpen,
  label,
  icon,
  selected,
  onSelect
}: Props) => {
  return (
    <NestedMenuItem
      parentMenuOpen={parentOpen}
      label={label}
      leftIcon={icon}
    >
      <MenuItem
        onClick={() => onSelect(TrafficLevel.NORMAL)}
        disabled={selected === TrafficLevel.NORMAL}
        selected={selected === TrafficLevel.NORMAL}
      >
        <ListItemIcon>
          <TrafficLevelChip short level={TrafficLevel.NORMAL} size='small' />
        </ListItemIcon>
        Normal
      </MenuItem>
      <MenuItem
        onClick={() => onSelect(TrafficLevel.WARNING)}
        disabled={selected === TrafficLevel.WARNING}
        selected={selected === TrafficLevel.WARNING}
      >
        <ListItemIcon>
          <TrafficLevelChip short level={TrafficLevel.WARNING} size='small' />
        </ListItemIcon>
        Warning
      </MenuItem>
      <MenuItem
        onClick={() => onSelect(TrafficLevel.DANGER)}
        disabled={selected === TrafficLevel.DANGER}
        selected={selected === TrafficLevel.DANGER}
      >
        <ListItemIcon>
          <TrafficLevelChip short level={TrafficLevel.DANGER} size='small' />
        </ListItemIcon>
        Danger
      </MenuItem>
    </NestedMenuItem>
  );
};
