import { IncomingMessage, ServerResponse } from "node:http";
import { notFoundHandler, internalErrorHandler } from "../middlewares/error.middleware";
import { handleUserRoutes } from "../routes/user.routes";

export const app = (req: IncomingMessage, res: ServerResponse) => {
  try {
    if (req.url?.startsWith('/api/users')) {
      return handleUserRoutes(req, res);
    }
    notFoundHandler(res);
  } catch (error) {
    internalErrorHandler(res);
  }
};
