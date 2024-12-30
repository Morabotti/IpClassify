import { Menu, MenuProps, MenuItemProps, MenuItem, ListItemIcon, ListItemText, Box, buttonBaseClasses } from '@mui/material';
import { FocusEvent, HTMLAttributes, KeyboardEvent, RefAttributes, useImperativeHandle, useRef, useState } from 'react';
import { ChevronRight } from '@mui/icons-material';
import { MaterialSxProps, createSx } from '@theme';

const internalSx = createSx({
  rightIcon: theme => ({
    ml: 1.5,
    display: 'flex',
    color: theme.palette.text.secondary
  }),
  menuItem: {
    pr: 1
  },
  subMenu: {
    [`& .${buttonBaseClasses.root}`]: {
      '&:focus-visible': {
        outline: 'none',
        outlineOffset: 'unset'
      }
    }
  }
});

export type NestedMenuItemProps = Omit<MenuItemProps, 'button'> & {
  parentMenuOpen: boolean;
  component?: React.ElementType;
  label?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  tabIndex?: number;
  disabled?: boolean;
  button?: true;
  ref?: React.Ref<HTMLElement>;
  ContainerProps?: HTMLAttributes<HTMLElement> & RefAttributes<HTMLElement | null>;
  MenuProps?: Partial<Omit<MenuProps, 'children'>>;
};

export const NestedMenuItem = ({
  parentMenuOpen,
  label,
  rightIcon = <ChevronRight />,
  leftIcon = null,
  children,
  className,
  sx,
  tabIndex: tabIndexProp,
  ContainerProps: ContainerPropsProp = {},
  MenuProps = {},
  disabled,
  ref,
  ...MenuItemProps
}: NestedMenuItemProps) => {
  const { ref: containerRefProp, ...ContainerProps } = ContainerPropsProp;

  const menuItemRef = useRef<HTMLLIElement | null>(null);
  useImperativeHandle(ref, () => menuItemRef.current!);

  const containerRef = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(containerRefProp, () => containerRef.current as HTMLDivElement);

  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setIsSubMenuOpen(true);

    if (ContainerProps.onMouseEnter) {
      ContainerProps.onMouseEnter(e);
    }
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    setIsSubMenuOpen(false);

    if (ContainerProps.onMouseLeave) {
      ContainerProps.onMouseLeave(e);
    }
  };

  const isSubmenuFocused = () => {
    if (!menuContainerRef.current) return;
    const active = containerRef.current?.ownerDocument.activeElement ?? null;

    for (const child of menuContainerRef.current.children) {
      if (child === active) {
        return true;
      }
    }

    return false;
  };

  const handleFocus = (e: FocusEvent<HTMLElement>) => {
    if (e.target === containerRef.current) {
      setIsSubMenuOpen(true);
    }

    if (ContainerProps.onFocus) {
      ContainerProps.onFocus(e);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      return;
    }

    if (isSubmenuFocused()) {
      e.stopPropagation();
    }

    const active = containerRef.current?.ownerDocument.activeElement;

    if (e.key === 'ArrowLeft' && isSubmenuFocused()) {
      containerRef.current?.focus();
    }

    if (e.key === 'ArrowRight' && e.target === containerRef.current && e.target === active) {
      const firstChild = menuContainerRef.current?.children[0] as HTMLDivElement;
      firstChild?.focus();
    }
  };

  const open = isSubMenuOpen && parentMenuOpen;

  let tabIndex;

  if (!disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  }

  return (
    <div
      {...ContainerProps}
      ref={containerRef}
      onFocus={handleFocus}
      tabIndex={tabIndex}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <MenuItem
        {...MenuItemProps}
        className={className}
        ref={menuItemRef}
        sx={[internalSx.menuItem, sx] as MaterialSxProps}
      >
        <ListItemIcon>
          {leftIcon}
        </ListItemIcon>
        <ListItemText>{label}</ListItemText>
        {rightIcon && (
          <Box sx={internalSx.rightIcon}>
            {rightIcon}
          </Box>
        )}
      </MenuItem>
      <Menu
        style={{ pointerEvents: 'none' }}
        anchorEl={menuItemRef.current}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top'
        }}
        transformOrigin={{
          horizontal: 'left',
          vertical: 'top'
        }}
        open={open}
        autoFocus={false}
        disableAutoFocus
        sx={internalSx.subMenu}
        disableEnforceFocus
        onClose={() => setIsSubMenuOpen(false)}
        {...MenuProps}
      >
        <div ref={menuContainerRef} style={{ pointerEvents: 'auto' }}>
          {children}
        </div>
      </Menu>
    </div>
  );
};
