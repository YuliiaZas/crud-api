import { IncomingMessage } from 'http';
import { InvalidBodyError } from '../utils/errors';
import { VALIDATION_MESSAGES } from '../utils/messages';

export async function parseRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        reject(
          new InvalidBodyError(VALIDATION_MESSAGES.INVALID_JSON(errorMessage)),
        );
      }
    });
  });
}
