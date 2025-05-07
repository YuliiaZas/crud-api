import http from 'node:http';
import { app } from './src/app';
import { getPort } from './src/utils/port';

const PORT = getPort();
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
