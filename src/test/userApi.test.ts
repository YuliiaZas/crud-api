import { TEST_DB_PATH } from './testDbPath';
process.env.DB_PATH = TEST_DB_PATH;

import test, { after, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import fs from 'node:fs/promises';
import { startServer } from '../server/startServer';
import { VALIDATION_MESSAGES } from '../utils/messages';
import { Status } from '../utils/status.enum';
import { apiUrl, updatedUserDto, userDto } from './testConstants';

let server: Awaited<ReturnType<typeof startServer>>;
let app: ReturnType<typeof request>;
let createdUserId: string;

before(async () => {
  try {
    server = await startServer();
  } catch (error) {
    console.error(
      'Error during starting tests:',
      (error as { message?: string }).message ?? error,
    );
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

describe('Correct flow', () => {
  test(`GET ${apiUrl} - should return empty array`, async () => {
    const res = await app.get(apiUrl);
    assert.equal(res.statusCode, Status.OK);
    assert.deepEqual(res.body, []);
  });

  test(`POST ${apiUrl} - should create a new user`, async () => {
    const res = await app.post(apiUrl).send(userDto);
    assert.equal(res.statusCode, Status.CREATED);
    assert.ok(res.body.id);
    createdUserId = res.body.id;
  });

  test(`GET ${apiUrl}:id - should return created user`, async () => {
    const res = await app.get(`${apiUrl}${createdUserId}`);
    assert.equal(res.statusCode, Status.OK);
    assert.deepEqual(res.body, { ...userDto, id: createdUserId });
  });

  test(`PUT ${apiUrl}:id - should update user`, async () => {
    const res = await app
      .put(`${apiUrl}${createdUserId}`)
      .send(updatedUserDto);
    assert.equal(res.statusCode, Status.OK);
    assert.deepEqual(res.body, { ...updatedUserDto, id: createdUserId });
  });

  test(`DELETE ${apiUrl}:id - should delete user`, async () => {
    const res = await app.delete(`${apiUrl}${createdUserId}`);
    assert.equal(res.statusCode, Status.NO_CONTENT);
  });

  test(`GET ${apiUrl}:id - should return ${Status.NOT_FOUND} for deleted user`, async () => {
    const res = await app.get(`${apiUrl}${createdUserId}`);
    assert.equal(res.statusCode, Status.NOT_FOUND);
  });
});

describe(`Flow with ${Status.NOT_FOUND} status for all types of requests`, () => {
  test(`GET ${apiUrl} - should return empty array`, async () => {
    const res = await app.get(apiUrl);
    assert.equal(res.statusCode, Status.OK);
    assert.deepEqual(res.body, []);
  });

  test(`GET ${apiUrl}:id - should return ${Status.NOT_FOUND} for not created user`, async () => {
    const res = await app.get(`${apiUrl}${createdUserId}`);
    assert.equal(res.statusCode, Status.NOT_FOUND);
  });

  test(`PUT ${apiUrl}:id - should return ${Status.NOT_FOUND} for not created user`, async () => {
    const res = await app
      .put(`${apiUrl}${createdUserId}`)
      .send(updatedUserDto);
    assert.equal(res.statusCode, Status.NOT_FOUND);
  });

  test(`DELETE ${apiUrl}:id - should return ${Status.NOT_FOUND} for not created user`, async () => {
    const res = await app.delete(`${apiUrl}${createdUserId}`);
    assert.equal(res.statusCode, Status.NOT_FOUND);
  });
});

describe(`Flow with ${Status.BAD_REQUEST} status for GET, PUT, DELETE with invalid user Id`, () => {
  test(`GET ${apiUrl} - should return empty array`, async () => {
    const res = await app.get(apiUrl);
    assert.equal(res.statusCode, Status.OK);
    assert.deepEqual(res.body, []);
  });

  test(`POST ${apiUrl} - should create a new user`, async () => {
    const res = await app.post(apiUrl).send(userDto);
    assert.equal(res.statusCode, Status.CREATED);
    assert.ok(res.body.id);
    createdUserId = res.body.id;
  });

  test(`GET ${apiUrl}:id - should return created user`, async () => {
    const res = await app.get(`${apiUrl}${createdUserId}`);
    assert.equal(res.statusCode, Status.OK);
    assert.deepEqual(res.body, { ...userDto, id: createdUserId });
  });

  test(`GET ${apiUrl}:id - should return ${Status.BAD_REQUEST} for invalid user Id`, async () => {
    const res = await app.get(`${apiUrl}createdUserId`);
    assert.equal(res.statusCode, Status.BAD_REQUEST);
    assert.equal(
      res.body.error,
      VALIDATION_MESSAGES.INVALID_ID('createdUserId'),
    );
  });

  test(`PUT ${apiUrl}:id - should return ${Status.BAD_REQUEST} for invalid user Id`, async () => {
    const res = await app.put(`${apiUrl}createdUserId`).send(updatedUserDto);
    assert.equal(res.statusCode, Status.BAD_REQUEST);
    assert.equal(
      res.body.error,
      VALIDATION_MESSAGES.INVALID_ID('createdUserId'),
    );
  });

  test(`DELETE ${apiUrl}:id - should return ${Status.BAD_REQUEST} for invalid user Id`, async () => {
    const res = await app.delete(`${apiUrl}createdUserId`);
    assert.equal(res.statusCode, Status.BAD_REQUEST);
    assert.equal(
      res.body.error,
      VALIDATION_MESSAGES.INVALID_ID('createdUserId'),
    );
  });

  test(`DELETE ${apiUrl}:id - should delete user`, async () => {
    const res = await app.delete(`${apiUrl}${createdUserId}`);
    assert.equal(res.statusCode, Status.NO_CONTENT);
  });
});

describe(`Flow with ${Status.BAD_REQUEST} status for POST, PUT with invalid body`, () => {
  test(`GET ${apiUrl} - should return empty array`, async () => {
    const res = await app.get(apiUrl);
    assert.equal(res.statusCode, Status.OK);
    assert.deepEqual(res.body, []);
  });

  test(`POST ${apiUrl} - should return ${Status.BAD_REQUEST} for invalid user name`, async () => {
    const res = await app.post(apiUrl).send({ ...userDto, username: '' });
    assert.equal(res.statusCode, Status.BAD_REQUEST);
    assert.equal(res.body.error, VALIDATION_MESSAGES.INVALID_USERNAME);
  });

  test(`POST ${apiUrl} - should return ${Status.BAD_REQUEST} for invalid user age`, async () => {
    const res = await app.post(apiUrl).send({ ...userDto, age: '25' });
    assert.equal(res.statusCode, Status.BAD_REQUEST);
    assert.equal(res.body.error, VALIDATION_MESSAGES.INVALID_AGE);
  });

  test('POST ${apiUrl} - should create a new user', async () => {
    const res = await app.post(apiUrl).send(userDto);
    assert.equal(res.statusCode, Status.CREATED);
    assert.ok(res.body.id);
    createdUserId = res.body.id;
  });

  test(`PUT ${apiUrl}:id - should return ${Status.BAD_REQUEST} for invalid user hobbies array`, async () => {
    const res = await app
      .put(`${apiUrl}${createdUserId}`)
      .send({ ...userDto, hobbies: [0] });
    assert.equal(res.statusCode, Status.BAD_REQUEST);
    assert.equal(res.body.error, VALIDATION_MESSAGES.INVALID_HOBBIES);
  });

  test(`PUT ${apiUrl}:id - should return ${Status.BAD_REQUEST} for invalid user hobbies`, async () => {
    const res = await app
      .put(`${apiUrl}${createdUserId}`)
      .send({ ...userDto, hobbies: null });
    assert.equal(res.statusCode, Status.BAD_REQUEST);
    assert.equal(res.body.error, VALIDATION_MESSAGES.INVALID_HOBBIES);
  });
});
