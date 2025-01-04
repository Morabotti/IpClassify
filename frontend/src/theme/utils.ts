import { Theme, SxProps } from '@mui/material';
import { SystemStyleObject } from '@mui/system';
import React from 'react';

type ValidValue = ((theme: Theme) => SystemStyleObject<Theme>) | SxProps<Theme>;
export type MaterialSxProps = SxProps<Theme>;

export function createSx<T>(
  styles: { [K in keyof T]: ValidValue }): { [K in keyof T]: ValidValue } {
  return styles;
}

const on = (targetClassName: string): string => {
  return `&.${targetClassName}`;
};

const onChild = (targetClassName: string): string => {
  return `& .${targetClassName}`;
};

const onChildElement = (element: React.ElementType, targetClassName: string): string => {
  return `& ${element}.${targetClassName}`;
};

export const selector = {
  on,
  onChild,
  onChildElement
};
