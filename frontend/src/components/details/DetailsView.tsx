import { accessApi } from '@client';
import { CenterMessage } from '@components/common';
import { Client } from '@enums';
import { ErrorOutline } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createSx } from '@theme';
import { isValidIp } from '@utils/uiUtils';
import { useNavigate, useParams } from 'react-router';
import { DetailsHeader, DetailsLocationSummary, MapsContainer, DetailsClassification, DetailsLatestRequests } from '@components/details';

const sx = createSx({
  container: {
    p: 2,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 1
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gridTemplateRows: '300px 1fr',
    width: '100%',
    height: 'calc(100% - (40px + 8px))',
    gap: 2
  },
  load: {
    p: 1
  }
});

export const DetailsView = () => {
  const { ip } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const response = useQuery({
    queryKey: [Client.GetAccessByIp, ip],
    queryFn: () => accessApi.getByIp(ip as string),
    enabled: !!ip && isValidIp(ip)
  });

  const onReload = () => {
    response.refetch();
    queryClient.invalidateQueries({ queryKey: [Client.GetAccessRecords] });
  };

  if ((response.status === 'pending' && response.fetchStatus === 'idle') || response.isError) {
    return (
      <CenterMessage
        icon={ErrorOutline}
        title='Invalid input'
        text='Error fetching given IP'
        buttonText='Back to catalog'
        onClick={() => navigate('/catalog')}
      />
    );
  }

  return (
    <Box sx={sx.container}>
      <DetailsHeader disabled={response.isFetching} ip={ip} onReload={onReload} loading={response.isLoading} />
      <Box sx={sx.layout}>
        <MapsContainer
          lat={response.data?.location.latitude ?? null}
          lng={response.data?.location.longitude ?? null}
          loading={response.isLoading}
        />
        <DetailsClassification
          classification={response.data?.classification ?? null}
          loading={response.isLoading}
        />
        <DetailsLocationSummary
          location={response.data?.location ?? null}
          loading={response.isLoading}
        />
        <DetailsLatestRequests
          ip={ip ?? null}
          loading={response.isLoading}
        />
      </Box>
    </Box>
  );
};
