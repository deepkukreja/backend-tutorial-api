import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import mongoose from 'mongoose';

async function startServer() {
  if (!env.jwtSecret || env.jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be set in .env and contain at least 32 characters.');
  }

  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.log(`Server running at http://localhost:${env.port}`);
    console.log(`Environment: ${env.nodeEnv}`);
  });

  const shutDown = async (signal) => {
    console.log(`${signal} received. Closing server...`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log('Server and database connection closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutDown('SIGINT'));
  process.on('SIGTERM', () => shutDown('SIGTERM'));
}

startServer().catch((error) => {
  console.error(`Unable to start the server: ${error.message}`);
  process.exit(1);
});
