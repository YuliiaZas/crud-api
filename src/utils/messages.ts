export const MESSAGES = {
  BALANCER_RUNNING: (hostPort: number) =>
    `[PRIMARY] 🌐 Load balancer is running on http://localhost:${hostPort}`,
  BALANCER_ERROR: (currentPort: number) =>
    `[Balancer Error] ❌ Worker on PORT ${currentPort} failed:`,
  WORKER_ONLINE: (pid: number) => `[PRIMARY] Worker ${pid} is online`,
  WORKERS_ALL: (workers: number) =>
    `[PRIMARY] 👷 All ${workers} workers are online. Please wait for ${workers - 1} servers`,
  WORKER_RESTART: (port: number, attempts: number) =>
    `[PRIMARY] 🔁 Restarting worker on PORT ${port} (attempt ${attempts + 1})...`,
  MAX_RESTART_REACHED: (port: number) =>
    `[PRIMARY] ❌ Max restart attempts reached for PORT ${port}. No longer restarting.`,
  WORKER_EXIT: (pid: number, code: number, signal: string, port: number) =>
    `[PRIMARY] ⚠️ Worker ${pid} exited (code: ${code}, signal: ${signal}) on PORT ${port}`,
  SERVER_RUNNING: (port: number, pid?: number) =>
    `${pid ? `[WORKER ${pid}] ` : ''}✅ Server is running on ${pid ? 'PORT ' : 'http://localhost:'}${port}`,
  REQUEST: (pid: number, port: number) =>
    `[WORKER ${pid}] Request handled on PORT ${port}`,
  PORT_IN_USE: (port: number) =>
    `❌ Port ${port} is already in use. Please check if the server is already running.`,
  DB_NOT_FOUND: (dbPath: string) =>
    `Database file not found at ${dbPath}. Creating a new one...`,
} as const;

export const VALIDATION_MESSAGES = {
  INVALID_JSON: (error: string) =>
    `Invalid JSON format for passed body: ${error}`,
  UNDEFINED_ID: 'ID is required.',
  INVALID_ID: (id: string | undefined) => `Invalid ID format: ${id}`,
  INVALID_USERNAME: 'Invalid username. Username must be a non-empty string.',
  INVALID_AGE: 'Invalid age. Age must be a positive number.',
  INVALID_HOBBIES: 'Invalid hobbies. Hobbies must be an array of string.',
} as const;

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: (id: string) => `User with ID ${id} not found.`,
} as const;

export const SERVER_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  BAD_REQUEST: 'Bad Request',
  BAD_GATEWAY: 'Bad Gateway',
  NOT_FOUND: 'Endpoint not found',
} as const;
