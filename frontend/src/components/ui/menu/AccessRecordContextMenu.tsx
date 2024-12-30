import { TrafficLevel } from '@enums';
import { buttonBaseClasses, Divider, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { AccessRecord, IpClassifyRequest, SimpleContextMenu } from '@types';
import { ArchiveOutlined, ArticleOutlined, DeleteOutline, Filter1Outlined, LocalOfferOutlined, OpenInBrowser, TagOutlined } from '@mui/icons-material';
import { createSx } from '@theme';
import { AccessRecordTrafficLevelSubContextMenu } from '@components/ui/menu';

const sx = createSx({
  menu: {
    [`& .${buttonBaseClasses.root}`]: {
      '&:focus-visible': {
        outline: 'none',
        outlineOffset: 'unset'
      }
    }
  }
});

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
