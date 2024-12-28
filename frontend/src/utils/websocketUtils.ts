import { TrafficSummary, WSMessage } from '@types';

export const formatWSMessage = (event: MessageEvent<string>): (WSMessage<unknown> | null) => {
  try {
    return JSON.parse(event.data) ?? null;
  }
  catch (e) {
    return null;
  }
};

export const appendAndShift = (update: TrafficSummary) => (prev: TrafficSummary[] | null): TrafficSummary[] | null => {
  if (!prev) return prev;

  const newData = [...prev, update];
  newData.shift();

  return newData;
};
