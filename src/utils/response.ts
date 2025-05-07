import { ServerResponse } from 'node:http';

export function sendJson(
  res: ServerResponse,
  statusCode: number,
  data: unknown,
): void {
  const json = JSON.stringify(data);

  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(json),
  });

  res.end(json);
}

export function sendEmpty(res: ServerResponse, statusCode = 204): void {
  res.writeHead(statusCode);
  res.end();
}
