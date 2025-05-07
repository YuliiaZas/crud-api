import dotenv from 'dotenv';

dotenv.config();

const defaultPort = 3000;

export const getPort = () => {
  const port = process.env.PORT;
  if (!port) {
    console.log(`PORT environment variable is not set. Using default port ${defaultPort}.`);
    return defaultPort;
  }
  const parsedPort = Number(port);
  if (isNaN(parsedPort) || parsedPort <= 0) {
    console.log(`Invalid PORT environment variable. Using default port ${defaultPort}.`);
    return defaultPort;
  }
  return parsedPort;
};
