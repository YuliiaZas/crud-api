import cluster from 'node:cluster';
import http from 'node:http';
import { app } from './src/app';
import { MESSAGES } from './src/utils/messages';
import { startPrimaryProcess } from './src/server/startPrimaryProcess';

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
    console.log(MESSAGES.SERVER_RUNNING(workerPort, process.pid)),
  );
}
