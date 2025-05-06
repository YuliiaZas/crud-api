import { ServerResponse } from 'node:http';

export function notFoundHandler(res: ServerResponse) {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Resource not found' }));
}

export function internalErrorHandler(res: ServerResponse, msg = 'Internal Server Error') {
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: msg }));
}

export function badRequestHandler(res: ServerResponse, msg = 'Bad Request') {
  res.writeHead(400, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: msg }));
}
