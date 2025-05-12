import http from 'node:http';
import { app } from '../app';
import { getPort } from '../utils/port';
import { MESSAGES } from '../utils/messages';

const PORT = getPort();

export async function startServer(): Promise<http.Server> {
  const server = http.createServer(app);
  return new Promise((resolve, reject) => {
    server.on('error', (err) => {
      if ((err as NodeJS.ErrnoException).code === 'EADDRINUSE') {
        reject(new Error(MESSAGES.PORT_IN_USE(PORT)));
      } else {
        reject(err);
      }
    });

    server.listen(PORT, () => {
      console.log(MESSAGES.SERVER_RUNNING(PORT));
      resolve(server);
    });
  });
}
