import { Box, Skeleton, TableCell, TableRow, Tooltip } from '@mui/material';
import { AccessRecord } from '@types';
import { Text } from '@components/common';
import clsx from 'clsx';
import { getTextColor } from '@utils/uiUtils';
import { Link } from 'react-router';
import { createSx } from '@theme';
import dayjs from 'dayjs';
import { getTrafficLevel } from '@utils/dataUtils';
import { TrafficLevel } from '@enums';
import { DnsOutlined, PhoneIphone, Podcasts } from '@mui/icons-material';

const sx = createSx({
  link: {
    textDecoration: 'none'
  },
  attributes: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 1
  }
});

interface Props {
  record: AccessRecord | null;
  selected?: boolean;
  onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const CatalogTableRow = ({
  record,
  selected,
  onContextMenu
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
        <TableCell><Skeleton width='70%' height={21} variant='text' /></TableCell>
        <TableCell>
          <Box display='flex' justifyContent='flex-end'>
            <Skeleton width='70%' height={21} variant='text' />
          </Box>
        </TableCell>
      </TableRow>
    );
  }

  const level = getTrafficLevel(record);

  return (
    <TableRow
      hover
      key={record.id}
      onContextMenu={onContextMenu}
      selected={selected}
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
      <TableCell>{record.timezone}</TableCell>
      <TableCell>{record.country}</TableCell>
      <TableCell>{record.city}</TableCell>
      <TableCell>{record.isp}</TableCell>
      <TableCell padding='none'>
        <Box sx={sx.attributes}>
          <Tooltip title={record.isMobile ? 'Mobile network' : 'Not mobile network'}>
            <PhoneIphone color={record.isMobile ? 'primary' : 'disabled'} />
          </Tooltip>
          <Tooltip title={record.isProxy ? 'Proxy network' : 'Not proxy network'}>
            <Podcasts color={record.isProxy ? 'primary' : 'disabled'} />
          </Tooltip>
          <Tooltip title={record.isHosting ? 'Hosting network' : 'Not hosting network'}>
            <DnsOutlined color={record.isHosting ? 'primary' : 'disabled'} />
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};
