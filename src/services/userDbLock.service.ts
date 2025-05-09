import { promises as fs } from 'fs';
import { LOCK_PATH } from '../utils/paths';

export async function setLock(retries = 10, delay = 50): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      const fileHandle = await fs.open(LOCK_PATH, 'wx');
      await fileHandle.close();
      return;
    } catch (err: any) {
      if (err.code === 'EEXIST') {
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
  throw new Error('Could not set lock');
}

export async function removeLock(): Promise<void> {
  try {
    await fs.unlink(LOCK_PATH);
  } catch (err: any) {
    if (err.code !== 'ENOENT') throw err;
  }
}
