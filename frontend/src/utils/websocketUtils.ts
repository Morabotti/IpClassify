import { TrafficSummary, TrafficSummaryFormatted, WSMessage } from '@types';
import dayjs from 'dayjs';

export const formatWSMessage = (event: MessageEvent<string>): (WSMessage<unknown> | null) => {
  try {
    return JSON.parse(event.data) ?? null;
  }
  catch (e) {
    return null;
  }
};

export const formatTrafficSummary = (update: TrafficSummary): TrafficSummaryFormatted => {
  return {
    ...update,
    timestamp: dayjs.unix(update.time as unknown as number).format('mm:ss')
  };
};

export const appendAndShift = (
  update: TrafficSummary
) => (
  prev: TrafficSummaryFormatted[] | null
): TrafficSummaryFormatted[] | null => {
  if (!prev) return prev;

  const newData = [...prev, formatTrafficSummary(update)];
  newData.shift();

  return newData;
};
