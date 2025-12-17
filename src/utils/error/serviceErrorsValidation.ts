import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaErrors } from '../../prisma/prisma.types.js';

export class ServiceErrorValidation {
  public static tratament(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      this.identifyPrismaError(error);
    }

    if (error instanceof Error) {
      throw new UnauthorizedException(error);
    }

    throw new InternalServerErrorException(
      'Ocorreu um erro inesperado, por favor tente novamente mais tarde',
    );
  }

  private static identifyPrismaError(
    error: Prisma.PrismaClientKnownRequestError,
  ) {
    for (const err of PrismaErrors) {
      if (error.code === err.code) {
        return err.function();
      }
    }
  }
}
