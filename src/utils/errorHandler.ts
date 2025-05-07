import { ServerResponse } from 'node:http';
import { sendJson } from './response';

export function notFoundHandler(res: ServerResponse) {
  sendJson(res, 404, { error: 'Endpoint not found' });
}

export function badRequestHandler(res: ServerResponse, msg = 'Bad Request') {
  sendJson(res, 400, { error: msg });
}

export function internalErrorHandler(res: ServerResponse, error?: unknown, logMsg = '[500]') {
  console.error(logMsg, error);
  sendJson(res, 500, { error: 'Internal Server Error' });
}

export function badGatewayHandler(res: ServerResponse, error?: unknown, logMsg = '[502]') {
  console.error(logMsg, error);
  sendJson(res, 502, { error: 'Bad Gateway' });
}
