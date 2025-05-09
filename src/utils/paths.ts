import { isAbsolute, join } from "node:path";
import dotenv from 'dotenv';

dotenv.config();

const fallbackPath = join(process.cwd(), 'data', 'db.json');

export const DB_PATH = process.env.DB_PATH
  ? isAbsolute(process.env.DB_PATH)
    ? process.env.DB_PATH
    : join(process.cwd(), process.env.DB_PATH)
  : fallbackPath;

export const LOCK_PATH = `${DB_PATH}.lock`;
