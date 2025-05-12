import cluster from 'node:cluster';
import type { Worker } from 'node:cluster';
import { WorkerInfo } from '../utils/types';

export function forkWorker(
  port: number,
  workerMapById: Map<number, WorkerInfo>,
  attempts = 0,
): Worker {
  const worker = cluster.fork({ PORT: port.toString() });
  workerMapById.set(worker.id, { id: worker.id, port, attempts });
  return worker;
}
