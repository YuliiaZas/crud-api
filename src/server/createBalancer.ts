import http, { RequestOptions, Server } from 'node:http';
import { badGatewayHandler } from '../utils/errorHandler';
import { MESSAGES } from '../utils/messages';

export function createBalancer(getNextPort: () => number): Server {
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
