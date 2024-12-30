import { TrafficLevel } from '@enums';
import { AccessRecord } from '@types';

export const getTrafficLevel = (record: AccessRecord): TrafficLevel => {
  if (record.danger) return TrafficLevel.DANGER;
  if (record.warning) return TrafficLevel.WARNING;
  return TrafficLevel.NORMAL;
};
