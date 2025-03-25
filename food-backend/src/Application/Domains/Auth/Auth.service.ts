import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { env } from 'process';
import { KEY_INJECTION, ROLE } from 'src/Application/@shared/metadata';
import { PayloadType } from 'src/Application/@shared/types';
import { UserEntity } from 'src/Application/Entities/User/User.entity';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { SignUpDto } from './dtos/SignUp.dto';
import { IUserRepositoryContract } from 'src/Application/Infra/Repositories/User/User.repository-contract';
import { SignInDto } from './dtos/SignIn.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(KEY_INJECTION.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryContract,
  ) {}

  async signUp(userDto: SignUpDto) {
    const checkIfEmailInUsed = await this.userRepository.getBy({
      email: userDto.email,
    });

    if (checkIfEmailInUsed) {
      throw new UnauthorizedException('email in used');
    }

    const salt = await bcrypt.genSalt(12);

    const hashedPassword = await bcrypt.hash(userDto.password, salt);

    const isAdmin = this.isAdmin(userDto.email, userDto.password);

    let user = await this.userRepository.create({
      id: uuid.v4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      email: userDto.email,
      name: userDto.name,
      password: hashedPassword,
      roles: [ROLE.USER],
    } as UserEntity);

    if (user.email === env.ADMIN_EMAIL && !user.roles.includes(ROLE.ADMIN)) {
      user = await this.userRepository.update(
        {
          id: user.id,
        },
        {
          roles: [...user.roles, ROLE.ADMIN],
          updatedAt: new Date(),
        },
      );
    }

    const token = await this.generateToken({
      ...user,

      // use only to check if user is admin, and check if password from admin is valid.
      password: isAdmin ? userDto.password : user.password,
    });

    return {
      user,
      accessToken: token,
    };
  }

  async sinIn(authDto: SignInDto) {
    let user = await this.userRepository.getBy({ email: authDto.email });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isAdmin = this.isAdmin(authDto.email, authDto.password);

    if (!isAdmin) {
      await this.isPasswordMatch(authDto.password, user.password);
    }

    if (isAdmin && !user.roles.includes(ROLE.ADMIN)) {
      user = await this.userRepository.update(
        {
          id: user.id,
        },
        {
          roles: [...user.roles, ROLE.ADMIN],
          updatedAt: new Date(),
        },
      );
    }

    const token = await this.generateToken({
      ...user,
      password: isAdmin ? authDto.password : user.password,
    });

    return {
      user,
      accessToken: token,
    };
  }

  private async generateToken(
    user: Pick<UserEntity, 'id' | 'roles' | 'deletedAt' | 'email' | 'password'>,
  ): Promise<string> {
    const isAdmin = this.isAdmin(user.email, user.password);

    const payload: PayloadType = {
      sub: user.id,
      roles: user.roles,
      deletedAt: !isAdmin ? user.deletedAt : null,
    };

    const token = this.jwtService.sign(payload);

    return token;
  }

  private isAdmin(email: string, password: string) {
    return env.ADMIN_EMAIL === email && env.ADMIN_PASSWORD === password;
  }

  private async isPasswordMatch(password: string, hashedPassword: string) {
    const isThePasswordCorrect = await bcrypt.compare(password, hashedPassword);

    if (!isThePasswordCorrect) {
      throw new UnauthorizedException();
    }
  }
}
