import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export const PrismaErrors = [
  {
    code: 'P2012',
    function() {
      throw new BadRequestException(
        'Por favor informe todos os campos obrigatórios',
      );
    },
  },
  {
    code: 'P2002',
    function() {
      throw new BadRequestException('O e-mail informado já está em uso');
    },
  },
  {
    code: 'P2025',
    function() {
      throw new UnauthorizedException('Informe um id válido.');
    },
  },
];

export const PrismaErrorCode = {
  REQUIRED_PATH: 'P2012',
  UNIQUE_CONSTRAINT: 'P2002',
  MISSING_ID: 'P2025',
};
