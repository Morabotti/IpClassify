import { TrafficLevel } from '@enums';
import { buttonBaseClasses, Divider, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { AccessRecord, IpClassifyRequest, SimpleContextMenu } from '@types';
import { ArchiveOutlined, ArticleOutlined, DeleteOutline, Filter1Outlined, LocalOfferOutlined, OpenInBrowser, TagOutlined } from '@mui/icons-material';
import { createSx, selector } from '@theme';
import { NestedMenuItem } from '@components/ui/menu';
import { TrafficLevelChip } from '@components/common';

const sx = createSx({
  menu: {
    [selector.onChild(buttonBaseClasses.root)]: {
      '&:focus-visible': {
        outline: 'none',
        outlineOffset: 'unset'
      }
    }
  }
});

export const AccessRecordTrafficLevelSubContextMenu = ({
  parentOpen,
  label,
  icon,
  selected,
  onSelect
}: {
  parentOpen: boolean;
  label: string;
  icon: React.ReactNode;
  selected?: TrafficLevel | null;
  onSelect: (set: TrafficLevel) => void;
}) => {
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

interface Props {
  contextMenu: SimpleContextMenu<AccessRecord>;
  onView: (set: AccessRecord) => void;
  onFilter: (set: AccessRecord) => void;
  onClassify: (set: IpClassifyRequest) => void;
  onClose: () => void;
}

export const AccessRecordContextMenu = ({
  contextMenu,
  onClassify,
  onClose,
  onFilter,
  onView
}: Props) => {
  const handleMethod = (cb: (set: AccessRecord) => void) => () => {
    if (!contextMenu.item) return;
    cb(contextMenu.item);
    onClose();
  };

  const handleClassify = (level: TrafficLevel, onlyThis: boolean, updateHistory: boolean) => {
    if (!contextMenu.item) return;
    onClassify({
      ip: contextMenu.item.ip,
      id: onlyThis ? contextMenu.item.id : null,
      updateHistory: onlyThis ? false : updateHistory,
      level
    });
    onClose();
  };

  return (
    <Menu
      sx={sx.menu}
      open={contextMenu.open}
      onClose={onClose}
      anchorReference='anchorPosition'
      anchorPosition={
        (contextMenu.open && contextMenu.mouseY && contextMenu.mouseX)
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
      onContextMenu={e => {
        e.preventDefault();
        onClose();
      }}
    >
      <MenuItem onClick={handleMethod(onView)}>
        <ListItemIcon>
          <OpenInBrowser />
        </ListItemIcon>
        Open IP details
      </MenuItem>
      <MenuItem onClick={handleMethod(onFilter)}>
        <ListItemIcon>
          <Filter1Outlined />
        </ListItemIcon>
        Filter by IP
      </MenuItem>
      <Divider sx={{ my: 0.5 }} />
      <AccessRecordTrafficLevelSubContextMenu
        parentOpen={contextMenu.open}
        label='Classify record as'
        icon={<ArticleOutlined />}
        onSelect={level => handleClassify(level, true, false)}
        selected={!contextMenu.item?.danger && !contextMenu.item?.warning
          ? TrafficLevel.NORMAL
          : contextMenu.item?.warning
            ? TrafficLevel.WARNING
            : TrafficLevel.DANGER}
      />
      <AccessRecordTrafficLevelSubContextMenu
        parentOpen={contextMenu.open}
        label='Classify IP as'
        icon={<LocalOfferOutlined />}
        onSelect={level => handleClassify(level, false, false)}
      />
      <AccessRecordTrafficLevelSubContextMenu
        parentOpen={contextMenu.open}
        label='Classify IP records as'
        icon={<ArchiveOutlined />}
        onSelect={level => handleClassify(level, false, true)}
      />
      <Divider sx={{ my: 0.5 }} />
      <MenuItem disabled>
        <ListItemIcon>
          <TagOutlined />
        </ListItemIcon>
        Create rule
      </MenuItem>
      <MenuItem disabled>
        <ListItemIcon>
          <DeleteOutline />
        </ListItemIcon>
        Delete IP record
      </MenuItem>
    </Menu>
  );
};
