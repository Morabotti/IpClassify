import { Theme, SxProps } from '@mui/material';
import { SystemStyleObject } from '@mui/system';

type ValidValue = ((theme: Theme) => SystemStyleObject<Theme>) | SxProps<Theme>;
export type MaterialSxProps = SxProps<Theme>;

export function createSx<T>(
  styles: { [K in keyof T]: ValidValue }): { [K in keyof T]: ValidValue } {
  return styles;
}
