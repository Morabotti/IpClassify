import { Skeleton, TableCell, TableRow } from '@mui/material';
import { AccessRecord } from '@types';
import { Text } from '@components/common';
import clsx from 'clsx';
import { getTextColor } from '@utils/uiUtils';
import { Link } from 'react-router';
import { createSx } from '@theme';
import dayjs from 'dayjs';
import { getTrafficLevel } from '@utils/dataUtils';
import { TrafficLevel } from '@enums';

const sx = createSx({
  link: {
    textDecoration: 'none'
  }
});

interface Props {
  record: AccessRecord | null;
}

export const CatalogTableRow = ({
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
        <Text
          color={getTextColor(level)}
          fontWeight={500}
          component={Link}
          to={`/catalog/${record.ip}`}
          sx={sx.link}
        >
          {record.ip}
        </Text>
      </TableCell>
      <TableCell>{dayjs.unix(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
      <TableCell>{record.application}</TableCell>
      <TableCell>{record.method} {record.path}</TableCell>
      <TableCell>{record.country}</TableCell>
      <TableCell>{record.city}</TableCell>
      <TableCell>{record.isp}</TableCell>
    </TableRow>
  );
};
