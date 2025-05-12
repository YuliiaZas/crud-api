import cluster from 'node:cluster';
import { cpus } from 'node:os';
import { getPort } from '../utils/port';
import { WorkerInfo, WorkerMessage } from '../utils/types';
import { MESSAGES } from '../utils/messages';
import { createBalancer } from './createBalancer';
import { forkWorker } from './forkWorker';

export async function startPrimaryProcess() {
  const HOST_PORT = getPort();
  const WORKERS_COUNT = cpus().length - 1;
  const MAX_RESTARTS = 2;

  let onlineWorkers = 0;
  const workerMapById: Map<number, WorkerInfo> = new Map();

  const ports: number[] = [];
  let currentPortIndex = 0;
  function getNextPort(): number {
    const port = ports[currentPortIndex];
    currentPortIndex = (currentPortIndex + 1) % ports.length;
    return port;
  }
  const dataWorker = forkWorker(HOST_PORT + 1, workerMapById, { isDataWorker: true});

  for (let i = 2; i <= WORKERS_COUNT; i++) {
    forkWorker(HOST_PORT + i, workerMapById);
    ports.push(HOST_PORT + i);
  }

  cluster.on('message', (worker, message) => {
    if (message?.type === 'dataRequest') {
      const { requestId, action, payload } = message as WorkerMessage;
  
      dataWorker.send({ action, payload, requestId });
  
      const handleDataResponse = (response: any) => {
        if (response.requestId === requestId) {
          worker.send(response);
          dataWorker.off('message', handleDataResponse);
        }
      };
  
      dataWorker.on('message', handleDataResponse);
    }
  });

  cluster.on('online', (worker) => {
    console.log(MESSAGES.WORKER_ONLINE(worker.process.pid!));
    onlineWorkers++;
    if (onlineWorkers === WORKERS_COUNT) {
      console.log(MESSAGES.WORKERS_ALL(WORKERS_COUNT));
    }
  });

  cluster.on('exit', (worker, code, signal) => {
    onlineWorkers--;
    const workerInfo = workerMapById.get(worker.id);
    const port = workerInfo?.port;
    console.warn(
      MESSAGES.WORKER_EXIT(
        worker.process.pid!,
        code ?? -1,
        signal ?? 'unknown',
        port ?? -1,
      ),
    );

    if (port !== undefined) {
      const attempts = (workerInfo as WorkerInfo).attempts;
      if (attempts < MAX_RESTARTS) {
        console.log(MESSAGES.WORKER_RESTART(port, attempts));
        workerMapById.delete(worker.id);
        forkWorker(port, workerMapById, { attempts: attempts + 1 });
      } else {
        console.error(MESSAGES.MAX_RESTART_REACHED(port));
        ports.splice(ports.indexOf(port), 1);
      }
    }
  });

  createBalancer(getNextPort).listen(HOST_PORT, () => {
    console.log(MESSAGES.BALANCER_RUNNING(HOST_PORT));
  });
}
