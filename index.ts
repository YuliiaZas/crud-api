import http from 'node:http';
import dotenv from 'dotenv';
import { app } from './src/app';

dotenv.config();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
