import cluster from 'node:cluster';
import type { Worker } from 'node:cluster';
import http, { RequestOptions, Server } from 'node:http';
import { cpus } from 'node:os';
import { getPort } from './src/utils/port';
import { app } from './src/app';
import { badGatewayHandler } from './src/utils/errorHandler';
import { WorkerInfo } from './src/utils/types';

const HOST_PORT = getPort();
const WORKERS_COUNT = cpus().length - 1;
const MAX_RESTARTS = 2;

let onlineWorkers = 0;
const workerMapById: Map<number, WorkerInfo> = new Map();

const ports: number[] = [];
let currentPortIndex = 0;

if (cluster.isPrimary) {
  for (let i = 1; i <= WORKERS_COUNT; i++) {
    forkWorker(HOST_PORT + i);
    ports.push(HOST_PORT + i);
  }

  cluster.on('online', (worker) => {
    console.log(`[PRIMARY] Worker ${worker.process.pid} is online`);
    onlineWorkers++;
    if (onlineWorkers === WORKERS_COUNT) {
      console.log(`[PRIMARY] 👷 All ${WORKERS_COUNT} workers are online. Please wait for the servers`);
    }
  });

  cluster.on('exit', (worker, code, signal) => {
    onlineWorkers--;
    const workerInfo = workerMapById.get(worker.id);
    const port = workerInfo?.port;
    console.warn(
      `[PRIMARY] ⚠️ Worker ${worker.process.pid} exited (code: ${code}, signal: ${signal}) on PORT ${port}`,
    );

    if (port !== undefined) {
      const attempts = (workerInfo as WorkerInfo).attempts;
      if (attempts < MAX_RESTARTS) {
        console.log(`[PRIMARY] 🔁 Restarting worker on PORT ${port} (attempt ${attempts + 1})...`);
        forkWorker(port, attempts + 1);
        workerMapById.delete(worker.id);
      } else {
        console.error(`[PRIMARY] ❌ Max restart attempts (${MAX_RESTARTS}) reached for PORT ${port}. No longer restarting.`);
        ports.splice(ports.indexOf(port), 1);
      }
    }
  });

  const balancer = createBalancer();

  balancer.listen(HOST_PORT, () => {
    console.log(`[PRIMARY] 🌐 Load balancer is running on http://localhost:${HOST_PORT}`);
  });
} else {
  const workerPort = Number(process.env.PORT);
  const server = http.createServer((req, res) => {
    console.log(`[WORKER ${process.pid}] Request handled on PORT ${workerPort}`);
    // for revievers: if you want to check what's going on when the server crashes just uncomment the next
    // lines and make a request to /api/crash
    // if (req.url?.startsWith('/api/crash')) {
    //   console.log(`[WORKER ${process.pid}] 💣 Simulating crash...`);
    //   process.exit(1);
    // }
    app(req, res);
  });
  server.listen(workerPort, () => {
    console.log(`[WORKER ${process.pid}] ✅ Server is running on PORT ${workerPort}`);
  });
}

function createBalancer(): Server {
  return http.createServer((req, res) => {
    const currentPort = ports[currentPortIndex];
    currentPortIndex = (currentPortIndex + 1) % ports.length;

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
      badGatewayHandler(res, err, `[Balancer Error] ❌ Worker on PORT ${currentPort} failed:`);
    });
  })
}

function forkWorker(port: number, attempts = 0): Worker {
  const worker = cluster.fork({ PORT: port.toString() });
  workerMapById.set(worker.id, { id: worker.id, port, attempts });
  return worker;
}
