/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaErrors } from '../../prisma/prisma.types.js';
import * as HTTPUtil from '../request.js';

export class ServiceErrorValidation {
  public static tratament(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      this.identifyPrismaError(error);
    }

    if (HTTPUtil.Request.isRequestError(error)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { data, status } = HTTPUtil.Request.extractErrorData(error);

      if (status === 400) {
        throw new BadRequestException(data?.message);
      }

      if (status === 404) {
        throw new NotFoundException(data?.message);
      }

      if (status === 429) {
        throw new HttpException(`${data?.message}`, status);
      }
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
