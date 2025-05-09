import { IncomingMessage, ServerResponse } from 'node:http';
import { badRequestHandler, notFoundHandler } from '../utils/errorHandler';
import { parseRequestBody } from '../middlewares/parseBody.middleware';
import {
  handleGetAllUsers,
  handleCreateUser,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
} from '../controllers/user.controller';
import {
  InvalidBodyError,
  InvalidIdError,
  NotFoundError,
} from '../utils/errors';
import { validateId } from '../utils/validate';
import { VALIDATION_MESSAGES } from '../utils/messages';

export async function handleUserRoutes(
  req: IncomingMessage,
  res: ServerResponse,
  id: string | undefined,
) {
  const method = req.method || 'GET';

  try {
    switch (method) {
      case 'GET':
        await (id
          ? handleGetUserById(res, validateId(id))
          : handleGetAllUsers(res));
        return;
      case 'POST':
        if (id) throw new NotFoundError();
        await handleCreateUser(res, await parseRequestBody(req));
        return;
      case 'PUT':
        if (!id) throw new NotFoundError(VALIDATION_MESSAGES.UNDEFINED_ID);
        await handleUpdateUserById(
          res,
          validateId(id),
          await parseRequestBody(req),
        );
        return;
      case 'DELETE':
        if (!id) throw new NotFoundError(VALIDATION_MESSAGES.UNDEFINED_ID);
        await handleDeleteUserById(res, validateId(id));
        return;
      default:
        throw new NotFoundError();
    }
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      notFoundHandler(res, error.message);
    } else if (
      error instanceof InvalidBodyError ||
      error instanceof InvalidIdError
    ) {
      badRequestHandler(res, error.message);
    } else {
      throw error;
    }
  }
}
