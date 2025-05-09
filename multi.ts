import cluster from 'node:cluster';
import type { Worker } from 'node:cluster';
import http, { RequestOptions, Server } from 'node:http';
import { cpus } from 'node:os';
import { getPort } from './src/utils/port';
import { app } from './src/app';
import { badGatewayHandler } from './src/utils/errorHandler';
import { WorkerInfo } from './src/utils/types';
import { ensureDbExists } from './src/services/user.service';
import { MESSAGES } from './src/utils/messages';

if (cluster.isPrimary) {
  startPrimaryProcess();
} else {
  const workerPort = Number(process.env.PORT);

  const server = http.createServer((req, res) => {
    console.log(MESSAGES.REQUEST(process.pid, workerPort));
    // for revievers: if you want to check what's going on when the server crashes just uncomment the next
    // lines and make a request to /api/crash
    // if (req.url?.startsWith('/api/crash')) {
    //   console.log(`[WORKER ${process.pid}] 💣 Simulating crash...`);
    //   process.exit(1);
    // }
    app(req, res);
  });

  server.listen(workerPort, () =>
    console.log(MESSAGES.SERVER_RUNNING(process.pid, workerPort)),
  );
}

async function startPrimaryProcess() {
  const HOST_PORT = getPort();
  const WORKERS_COUNT = cpus().length - 1;
  const MAX_RESTARTS = 2;

  let onlineWorkers = 0;
  const workerMapById: Map<number, WorkerInfo> = new Map();

  const ports: number[] = [];
  let currentPortIndex = 0;

  await ensureDbExists();

  for (let i = 1; i <= WORKERS_COUNT; i++) {
    forkWorker(HOST_PORT + i);
    ports.push(HOST_PORT + i);
  }

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
        forkWorker(port, attempts + 1);
      } else {
        console.error(MESSAGES.MAX_RESTART_REACHED(port));
        ports.splice(ports.indexOf(port), 1);
      }
    }
  });

  const balancer = createBalancer(getNextPort);

  balancer.listen(HOST_PORT, () => {
    console.log(MESSAGES.BALANCER_RUNNING(HOST_PORT));
  });

  function getNextPort(): number {
    const port = ports[currentPortIndex];
    currentPortIndex = (currentPortIndex + 1) % ports.length;
    return port;
  }

  function forkWorker(port: number, attempts = 0): Worker {
    const worker = cluster.fork({ PORT: port.toString() });
    workerMapById.set(worker.id, { id: worker.id, port, attempts });
    return worker;
  }
}

function createBalancer(getNextPort: () => number): Server {
  return http.createServer((req, res) => {
    const currentPort = getNextPort();

    const options: RequestOptions = {
      hostname: 'localhost',
      port: currentPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (err) => {
      badGatewayHandler(res, err, MESSAGES.BALANCER_ERROR(currentPort));
    });
  });
}
