import { ServerResponse } from 'node:http';
import { ERROR_MESSAGES } from './messages';
import { Status } from './status.enum';

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

export function sendNotFound(res: ServerResponse, id: string): void {
  sendJson(res, Status.NOT_FOUND, {
    message: ERROR_MESSAGES.USER_NOT_FOUND(id),
  });
}

export function sendEmpty(
  res: ServerResponse,
  statusCode = Status.NO_CONTENT,
): void {
  res.writeHead(statusCode);
  res.end();
}
