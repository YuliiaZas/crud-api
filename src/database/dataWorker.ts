import { User } from '../models/user.model';
import { randomUUID } from 'crypto';
import { WorkerMessage } from '../utils/types';

let users: User[] = [];

process.on('message', (message: WorkerMessage) => {
  const { action, payload, requestId } = message;

  try {
    switch (action) {
      case 'getAllUsers':
        respond(requestId, 'ok', users);
        break;
      case 'createUser': {
        const newUser: User = { id: randomUUID(), ...payload?.data! };
        users.push(newUser);
        respond(requestId, 'ok', newUser);
        break;
      }
      case 'getUserById': {
        const user = users.find((u) => u.id === payload?.id);
        respond(requestId, 'ok', user ?? null);
        break;
      }
      case 'updateUserById': {
        const index = users.findIndex((u) => u.id === payload?.id);
        if (index === -1) return respond(requestId, 'ok', null);
        users[index] = { id: payload?.id!, ...payload?.data! };
        respond(requestId, 'ok', users[index]);
        break;
      }
      case 'deleteUserById': {
        const index = users.findIndex((u) => u.id === payload?.id);
        if (index === -1) return respond(requestId, 'ok', false);
        users.splice(index, 1);
        respond(requestId, 'ok', true);
        break;
      }
      default:
        respond(requestId, 'error', `Unknown type: ${action}`);
    }
  } catch (error: any) {
    respond(requestId, 'error', error.message);
  }
});

function respond(requestId: string, status: 'ok' | 'error', data: any) {
  process.send?.({ requestId, status, data });
}
