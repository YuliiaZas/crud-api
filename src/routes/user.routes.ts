import { IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';
import { badRequestHandler, notFoundHandler } from '../utils/errorHandler';
import { parseRequestBody } from '../middlewares/parseBody.middleware';
import {
  handleGetAllUsers,
  handleCreateUser,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
} from '../controllers/user.controller';
import { InvalidBodyError, InvalidIdError } from '../utils/errors';
import { validateId } from '../utils/validate';

export async function handleUserRoutes(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const parsedUrl = parse(req.url ?? '', true);
  const pathParts = parsedUrl.pathname?.split('/').filter(Boolean) || [];
  const method = req.method || 'GET';

  try {
    if (pathParts.length === 2 && pathParts[1] === 'users') {
      if (method === 'GET') return handleGetAllUsers(res);
      if (method === 'POST') {
        const body = await parseRequestBody(req);
        return handleCreateUser(res, body);
      }
    } else if (pathParts.length === 3 && pathParts[1] === 'users') {
      const userId = validateId(pathParts[2]);

      if (method === 'GET') return handleGetUserById(res, userId);
      if (method === 'PUT') {
        const body = await parseRequestBody(req);
        return handleUpdateUserById(res, userId, body);
      }
      if (method === 'DELETE') return handleDeleteUserById(res, userId);
    }

    notFoundHandler(res);
  } catch (error: unknown) {
    if (error instanceof InvalidBodyError || error instanceof InvalidIdError) {
      badRequestHandler(res, error.message);
    } else {
      throw error;
    }
  }
}
