import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  @Inject()
  private readonly jwtService: JwtService;

  public async hashingPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  public async isMatchPassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }

  public async createToken(id: string): Promise<string> {
    return await this.jwtService.signAsync({ id });
  }

  public async verifyToken(token: string): Promise<{ id: string }> {
    return await this.jwtService.verifyAsync(token);
  }
}
