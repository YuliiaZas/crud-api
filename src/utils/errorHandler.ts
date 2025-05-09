import { ServerResponse } from 'node:http';
import { sendJson } from './response';
import { Status } from './status.enum';
import { SERVER_MESSAGES } from './messages';

export function notFoundHandler(res: ServerResponse) {
  sendJson(res, Status.NOT_FOUND, { error: SERVER_MESSAGES.NOT_FOUND });
}

export function badRequestHandler(
  res: ServerResponse,
  msg: string = SERVER_MESSAGES.BAD_REQUEST,
) {
  sendJson(res, Status.BAD_REQUEST, { error: msg });
}

export function internalErrorHandler(
  res: ServerResponse,
  error?: unknown,
  logMsg = `[${Status.INTERNAL_SERVER_ERROR}]`,
) {
  console.error(logMsg, error);
  sendJson(res, Status.INTERNAL_SERVER_ERROR, {
    error: SERVER_MESSAGES.INTERNAL_SERVER_ERROR,
  });
}

export function badGatewayHandler(
  res: ServerResponse,
  error?: unknown,
  logMsg = `[${Status.BAD_GATEWAY}]`,
) {
  console.error(logMsg, error);
  sendJson(res, Status.BAD_GATEWAY, { error: SERVER_MESSAGES.BAD_GATEWAY });
}
