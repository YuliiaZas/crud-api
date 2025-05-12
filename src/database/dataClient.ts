import { ClientUserPayload } from '../utils/types';

let requestId = 0;

export function sendToDataWorker(action: string, payload?: ClientUserPayload): Promise<any> {
  return new Promise((resolve) => {
    const id = ++requestId;

    const listener = (msg: any) => {
      if (msg.requestId === id) {
        process.off('message', listener);
        resolve(msg.data);
      }
    };

    process.on('message', listener);

    process.send?.({
      type: 'dataRequest',
      action,
      payload,
      requestId: id,
    });
  });
}
