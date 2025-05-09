import http from 'node:http';
import { app } from '../app';
import { getPort } from '../utils/port';
import { ensureDbExists } from '../services/user.service';

const PORT = getPort();

export async function startServer(): Promise<http.Server> {
  await ensureDbExists();
  const server = http.createServer(app);
  return new Promise((resolve, reject) => {
    server.on('error', (err) => {
      if ((err as NodeJS.ErrnoException).code === 'EADDRINUSE') {
        reject(new Error(`❌ Port ${PORT} is already in use.`));
      } else {
        reject(err);
      }
    });

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}
