import { ServerResponse } from 'node:http';
import { sendJson } from './response';

export function notFoundHandler(res: ServerResponse) {
  sendJson(res, 404, { error: 'Endpoint not found' });
}

export function internalErrorHandler(res: ServerResponse, error?: unknown) {
  console.error('[500]', error);
  sendJson(res, 500, { error: 'Internal Server Error' });
}

export function badRequestHandler(res: ServerResponse, msg = 'Bad Request') {
  sendJson(res, 400, { error: msg });
}
