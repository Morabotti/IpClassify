import { Skeleton, TableCell, TableRow } from '@mui/material';
import { AccessRecord } from '@types';
import { Text } from '@components/common';
import clsx from 'clsx';
import { getTextColor } from '@utils/uiUtils';
import dayjs from 'dayjs';
import { getTrafficLevel } from '@utils/dataUtils';
import { TrafficLevel } from '@enums';

interface Props {
  record: AccessRecord | null;
}

export const LatestRequestTableRow = ({
  record
}: Props) => {
  if (record === null) {
    return (
      <TableRow hover>
        <TableCell><Skeleton width='70%' height={21} variant='text' /></TableCell>
        <TableCell><Skeleton width='70%' height={21} variant='text' /></TableCell>
        <TableCell><Skeleton width='70%' height={21} variant='text' /></TableCell>
        <TableCell><Skeleton width='70%' height={21} variant='text' /></TableCell>
        <TableCell><Skeleton width='70%' height={21} variant='text' /></TableCell>
      </TableRow>
    );
  }

  const level = getTrafficLevel(record);

  return (
    <TableRow
      hover
      key={record.id}
      className={clsx({
        error: level === TrafficLevel.DANGER,
        warning: level === TrafficLevel.WARNING
      })}
    >
      <TableCell>
        <Text color={getTextColor(level)} fontWeight={500}>
          {record.id}
        </Text>
      </TableCell>
      <TableCell>{dayjs.unix(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
      <TableCell>{record.application}</TableCell>
      <TableCell>{record.method} {record.path}</TableCell>
      <TableCell>{record.userAgent}</TableCell>
    </TableRow>
  );
};
