/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../../src/app.module.js';
import dotenv from 'dotenv';
import { PrismaService } from '../../src/prisma/prisma.service.js';

dotenv.config({ path: '.env.e2e' });

describe('City (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  const cityIds: string[] = [];
  const prismaService = new PrismaService();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const signupResponse = await request(app.getHttpServer())
      .post('/user/signup')
      .send({
        name: 'Akira',
        email: 'akira@email.com',
        password: 'Akira123!',
      });

    token = signupResponse.body.token;
  });

  it('/weather (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/weather/')
      .set('Authorization', `Bearer ${token}`)
      .send({ cityName: 'Porto alegre' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/weather/')
      .set('Authorization', `Bearer ${token}`)
      .send({ cityName: 'Florida' })
      .expect(201);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('weather');
  });

  it('/weather (POST) - (Error - missing cityName)', async () => {
    const response = await request(app.getHttpServer())
      .post('/weather/')
      .set('Authorization', `Bearer ${token}`)
      .send({ cityName: '' })
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('statusCode');
  });

  it('/weather/ (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/weather/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[1]).toHaveProperty('id');
    expect(response.body[1]).toHaveProperty('name');

    cityIds.push(response.body[0].id);
    cityIds.push(response.body[1].id);
  });

  it('/weather/ (GET) - (Error - missing token)', async () => {
    const response = await request(app.getHttpServer())
      .get('/weather/')
      .set('Authorization', `Bearer `)
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('statusCode');
  });

  it('/weather/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/weather/${cityIds[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('city');
    expect(response.body).toHaveProperty('clouds');
    expect(response.body.coords).toHaveProperty('lat');
    expect(response.body.coords).toHaveProperty('lng');
  });

  it('/weather/:id (GET) (Error - invalid id)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/weather/teste-id`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('statusCode');
  });

  it('/weather/:id (GET) (Error - invalid token)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/weather/${cityIds[0]}`)
      .set('Authorization', `Bearer `)
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('statusCode');
  });

  it('/weather/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/weather/${cityIds[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('/weather/:id (DELETE) (Error - invalid id)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/weather/teste-id`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('statusCode');
  });

  it('/weather/:id (DELETE) (Error - invalid token)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/weather/${cityIds[0]}`)
      .set('Authorization', `Bearer `)
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('statusCode');
  });

  afterAll(async () => {
    await prismaService.city.deleteMany();
    await prismaService.user.deleteMany();
    await app.close();
  });
});
