import { IncomingMessage, ServerResponse } from 'node:http';
import { notFoundHandler, internalErrorHandler } from './utils/errorHandler';
import { handleUserRoutes } from './routes/user.routes';

export const app = (req: IncomingMessage, res: ServerResponse): void => {
  try {
    if (req.url?.startsWith('/api/users')) {
      handleUserRoutes(req, res);
      return;
    }
    notFoundHandler(res);
  } catch (error) {
    internalErrorHandler(res, error);
  }
};
