import http from 'node:http';
import { app } from './src/app';
import { getPort } from './src/utils/port';
import { initEmptyDb } from './src/services/user.service';

const PORT = getPort();

initEmptyDb();

export const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
