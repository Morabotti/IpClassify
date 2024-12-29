import { TrafficSummaryFormatted } from '@types';
import { atom } from 'jotai';

export const loadingAtom = atom(false);

export const trafficSummaryAtom = atom<TrafficSummaryFormatted[] | null>(null);
