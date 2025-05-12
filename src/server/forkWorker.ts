import cluster from 'node:cluster';
import type { Worker } from 'node:cluster';
import { ForkData, WorkerInfo } from '../utils/types';

interface ForkWorkerInfo {
  isDataWorker?: boolean;
  attempts?: number;
}

export function forkWorker(
  port: number,
  workerMapById: Map<number, WorkerInfo>,
  workerInfo: ForkWorkerInfo = {},
): Worker {
  const { isDataWorker, attempts } = workerInfo;
  const forkData: ForkData = {
    ROLE: isDataWorker ? 'data' : 'http',
    PORT: port.toString()
  };
  const worker = cluster.fork(forkData);
  workerMapById.set(worker.id, { id: worker.id, port, attempts: attempts ?? 0 });
  return worker;
}
