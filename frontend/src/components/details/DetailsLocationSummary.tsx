import { Paper, Stack } from '@mui/material';
import { IpLocation } from '@types';
import { DetailKeyValueItem, DetailsGroupValues } from '@components/details';
import { CloudOutlined, CorporateFare, DnsOutlined, HomeOutlined, LocationCityOutlined, LocationOnOutlined, MoneyOutlined, PhoneIphone, Podcasts } from '@mui/icons-material';

interface Props {
  location: IpLocation | null;
  loading?: boolean;
}

export const DetailsLocationSummary = ({ location, loading }: Props) => {
  if (loading || location === null) {
    return (
      <Paper variant='outlined'>
      </Paper>
    );
  }

  return (
    <Paper variant='outlined'>
      <Stack>
        <DetailsGroupValues
          loading={loading}
          items={[
            {
              title: 'Mobile',
              value: location.isMobile ? 'YES' : 'NO',
              icon: <PhoneIphone color={location.isMobile ? 'primary' : 'disabled'} />
            },
            {
              title: 'Proxy',
              value: location.isProxy ? 'YES' : 'NO',
              icon: <Podcasts color={location.isProxy ? 'primary' : 'disabled'} />
            },
            {
              title: 'Hosting',
              value: location.isHosting ? 'YES' : 'NO',
              icon: <DnsOutlined color={location.isHosting ? 'primary' : 'disabled'} />
            }
          ]}
        />
        <DetailKeyValueItem
          loading={loading}
          icon={LocationCityOutlined}
          title='Location'
          value={`${location.city} (${location.zip}), ${location.country}`}
        />
        <DetailKeyValueItem
          loading={loading}
          icon={LocationOnOutlined}
          title='Coordinates'
          value={`${location.latitude}, ${location.longitude}`}
        />
        <DetailKeyValueItem
          loading={loading}
          icon={CorporateFare}
          title='Organization'
          value={location.org}
        />
        <DetailKeyValueItem
          loading={loading}
          icon={CloudOutlined}
          title='Internet provider'
          value={location.isp}
        />
        <DetailKeyValueItem
          loading={loading}
          icon={MoneyOutlined}
          title='Currency'
          value={location.currency}
        />
        <DetailKeyValueItem
          loading={loading}
          icon={HomeOutlined}
          title='Timezone'
          value={location.timezone}
        />
      </Stack>
    </Paper>
  );
};
