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
      if (method === 'GET') {
        await handleGetAllUsers(res);
        return;
      }
      if (method === 'POST') {
        const body = await parseRequestBody(req);
        await handleCreateUser(res, body);
        return;
      }
    } else if (pathParts.length === 3 && pathParts[1] === 'users') {
      if (method !== 'GET' && method !== 'PUT' && method !== 'DELETE') {
        notFoundHandler(res);
        return;
      }
      const userId = validateId(pathParts[2]);

      if (method === 'GET') {
        await handleGetUserById(res, userId);
        return;
      }
      if (method === 'PUT') {
        const body = await parseRequestBody(req);
        await handleUpdateUserById(res, userId, body);
        return;
      }
      if (method === 'DELETE') {
        await handleDeleteUserById(res, userId);
        return;
      }
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
