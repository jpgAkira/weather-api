/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../../src/app.module.js';
import dotenv from 'dotenv';
import { PrismaService } from '../../src/prisma/prisma.service.js';

dotenv.config({ path: '.env.e2e' });

describe('User (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  const prismaService = new PrismaService();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/user/signup (error - missing inputs)', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/signup')
      .send()
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('statusCode');
  });

  it('/user/signup (error - invalid password format)', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/signup')
      .send({ name: 'Akira', email: 'akira@email.com', password: 'a123' })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('statusCode');
  });

  it('/user/signup', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/signup')
      .send({
        name: 'Akira',
        email: 'akira@email.com',
        password: 'Akira123!',
      })
      .expect(201);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    token = response.body.token;

    expect(response.body).toHaveProperty('token');
  });

  it('/user/signin', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/signin')
      .send({
        email: 'akira@email.com',
        password: 'Akira123!',
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
  });

  it('/user/signin (error - invalid password)', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/signin')
      .send({
        email: 'akira@email.com',
        password: 'Akira123',
      })
      .expect(401);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('statusCode');
  });

  it('/user/signin (error - missing inputs)', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/signin')
      .send()
      .expect(401);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('statusCode');
  });

  it('/user/me (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('id');
  });

  it('/user/me (GET) (Error - invalid token)', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/me')
      .set('Authorization', `Bearer `)
      .expect(401);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('statusCode');
  });

  it('/user/ (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/user/')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Atualizado', password: 'Atualizado123!' })
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('user');

    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('name');
    expect(response.body.user).toHaveProperty('email');
  });

  it('/user/ (PATCH) - (Error - invalid password format)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/user/')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Atualizado', password: 'abc123' })
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('statusCode');
  });

  it('/user/ (PATCH) - (Error - invalid token)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/user/')
      .set('Authorization', `Bearer `)
      .send({ name: 'Atualizado', password: 'Atualizado123!' })
      .expect(401);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('statusCode');
  });

  it('/user/ (DELETE) - (Error - invalid token)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/user/')
      .set('Authorization', `Bearer `)
      .expect(401);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('statusCode');
  });

  it('/user/ (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/user/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('userId');
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
    await app.close();
  });
});
