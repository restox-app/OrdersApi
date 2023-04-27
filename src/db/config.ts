import { createConnection } from 'mongoose';

export const db = createConnection(
  process.env.DB_URI ?? '',
  {
    dbName: process.env.DB_NAME ?? 'restox',
    autoCreate: true,
  },
);
