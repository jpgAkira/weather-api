import { Prisma } from '../generated/prisma/client.js';

export const createPrismaError = (
  code: string,
  message: string = 'Error',
  version: string = '7.0.1',
) => {
  return new Prisma.PrismaClientKnownRequestError(message, {
    code: code,
    clientVersion: version,
  });
};
