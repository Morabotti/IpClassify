import { CenterMessage } from '@components/common';
import { ConstructionOutlined } from '@mui/icons-material';
import { Paper, Skeleton } from '@mui/material';
import { IpClassification } from '@types';
import { getIpClassificationLevel } from '@utils/dataUtils';

interface Props {
  classification: IpClassification | null;
  loading?: boolean;
}

export const DetailsClassification = ({ classification, loading }: Props) => {
  if (loading || classification === null) {
    return (
      <Paper variant='outlined' sx={{ p: 2 }}>
        <Skeleton width='100%' height='100%' variant='rounded' />
      </Paper>
    );
  }

  const level = getIpClassificationLevel(classification);

  return (
    <Paper variant='outlined'>
      <CenterMessage icon={ConstructionOutlined} text='WIP' title={level} />
    </Paper>
  );
};
