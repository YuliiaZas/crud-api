import { IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';
import { notFoundHandler, internalErrorHandler } from './utils/errorHandler';
import { handleUserRoutes } from './routes/user.routes';

export const app = (req: IncomingMessage, res: ServerResponse): void => {
  const parsedUrl = parse(req.url ?? '', true);
  const pathParts = parsedUrl.pathname?.split('/').filter(Boolean) || [];
  const [api, users, id] = pathParts;

  if (api !== 'api' || users !== 'users' || pathParts.length > 3) {
    notFoundHandler(res);
    return;
  }

  try {
    handleUserRoutes(req, res, id);
  } catch (error) {
    internalErrorHandler(res, error);
  }
};
