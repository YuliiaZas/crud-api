export const MESSAGES = {
  BALANCER_RUNNING: (hostPort: number) =>
    `[PRIMARY] 🌐 Load balancer is running on http://localhost:${hostPort}`,
  BALANCER_ERROR: (currentPort: number) =>
    `[Balancer Error] ❌ Worker on PORT ${currentPort} failed:`,
  WORKER_ONLINE: (pid: number) => `[PRIMARY] Worker ${pid} is online`,
  WORKERS_ALL: (workers: number) =>
    `[PRIMARY] 👷 All ${workers} workers are online. Please wait for the servers`,
  WORKER_RESTART: (port: number, attempts: number) =>
    `[PRIMARY] 🔁 Restarting worker on PORT ${port} (attempt ${attempts + 1})...`,
  MAX_RESTART_REACHED: (port: number) =>
    `[PRIMARY] ❌ Max restart attempts reached for PORT ${port}. No longer restarting.`,
  WORKER_EXIT: (pid: number, code: number, signal: string, port: number) =>
    `[PRIMARY] ⚠️ Worker ${pid} exited (code: ${code}, signal: ${signal}) on PORT ${port}`,
  SERVER_RUNNING: (pid: number, port: number) =>
    `[WORKER ${pid}] ✅ Server is running on PORT ${port}`,
  REQUEST: (pid: number, port: number) =>
    `[WORKER ${pid}] Request handled on PORT ${port}`,
} as const;

export const VALIDATION_MESSAGES = {
  INVALID_ID: (id: string) => `Invalid ID format: ${id}`,
  INVALID_USERNAME: 'Invalid username. Username must be a non-empty string.',
  INVALID_AGE: 'Invalid age. Age must be a positive number.',
  INVALID_HOBBIES: 'Invalid hobbies. Hobbies must be an array of string.',
} as const;
