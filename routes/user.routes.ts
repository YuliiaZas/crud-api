import { IncomingMessage, ServerResponse } from "node:http";
import { parse } from "node:url";
import { badRequestHandler, notFoundHandler } from "../middlewares/error.middleware";
import { parseRequestBody } from "../middlewares/parseBody.middleware";
import {
  getUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../services/user.service";
import { InvalidBodyError, InvalidIdError } from "../utils/errors";
import { validateId } from "../utils/validateId";
import { validateUser } from "../utils/validateUser";
import { User } from "../models/user.model";

export async function handleUserRoutes(req: IncomingMessage, res: ServerResponse) {
  const parsedUrl = parse(req.url ?? '', true);
  const method = req.method || 'GET';
  const pathParts = parsedUrl.pathname?.split('/').filter(Boolean) || [];

  let result: User[] | User | null | undefined;
  let statusCode = 200;

  try {
    if (pathParts.length === 2 && pathParts[1] === 'users') {
      if (method === 'GET') {
        result = getUsers();
      } else if (method === 'POST') {
        result = createUser(validateUser(await parseRequestBody(req)));
        statusCode = 201;
      }
    } else if (pathParts.length === 3 && pathParts[1] === 'users') {
      const userId = validateId(pathParts[2]);

      if (method === 'GET') {
        result = getUserById(userId);
      } else if (method === 'PUT') {
        result = updateUserById(userId, validateUser(await parseRequestBody(req)));
      } else if (method === 'DELETE') {
        result = deleteUserById(userId);
        statusCode = 204;
        res.writeHead(statusCode);
        res.end();
      }
    }

    if (result !== undefined) {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } else {
      notFoundHandler(res);
    }
  } catch (error) {
    if (error instanceof InvalidBodyError || error instanceof InvalidIdError) {
      badRequestHandler(res, error.message);
    }
  }
}