import { TEST_DB_PATH } from './testDbPath';
process.env.DB_PATH = TEST_DB_PATH;

import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import fs from 'node:fs/promises';
import { startServer } from '../server/startServer';

let server: Awaited<ReturnType<typeof startServer>>;
let app: ReturnType<typeof request>;
let createdUserId: string;

before(async () => {
  try {
    server = await startServer();
  } catch (error) {
    console.error('Error during starting tests:', (error as {message?: string}).message ?? error);
    process.exit(1);
  }
  app = request(server);
});

after(async () => {
  try {
    await fs.unlink(process.env.DB_PATH!);
    console.log('Test database removed');
    await fs.unlink(`${process.env.DB_PATH}.lock`);
  } catch {}
  server.close();
});


test('GET /api/users - should return empty array', async () => {
  const res = await app.get('/api/users');
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, []);
});

test('POST /api/users - should create a new user', async () => {
  const res = await app.post('/api/users').send({
    username: 'Alice',
    age: 25,
    hobbies: ['reading', 'cycling'],
  });

  assert.equal(res.statusCode, 201);
  assert.ok(res.body.id);
  createdUserId = res.body.id;
});

test('GET /api/users/:id - should return created user', async () => {
  const res = await app.get(`/api/users/${createdUserId}`);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.username, 'Alice');
});

test('PUT /api/users/:id - should update user', async () => {
  const res = await app.put(`/api/users/${createdUserId}`).send({
    username: 'Alice Updated',
    age: 26,
    hobbies: ['drawing'],
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.username, 'Alice Updated');
});

test('DELETE /api/users/:id - should delete user', async () => {
  const res = await app.delete(`/api/users/${createdUserId}`);
  assert.equal(res.statusCode, 204);
});

test('GET /api/users/:id - should return 404 for deleted user', async () => {
  const res = await app.get(`/api/users/${createdUserId}`);
  assert.equal(res.statusCode, 404);
});
