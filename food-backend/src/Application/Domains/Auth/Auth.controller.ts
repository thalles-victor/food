import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './Auth.service';
import { SignUpDto } from './dtos/SignUp.dto';
import { SignInDto } from './dtos/SignIn.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() userDto: SignUpDto) {
    const result = await this.authService.signUp(userDto);

    const { accessToken, user: _user } = result;

    const { password, ...user } = _user;

    return {
      user,
      accessToken,
    };
  }

  @Post('signIn')
  async signIn(@Body() authDto: SignInDto) {
    const result = await this.authService.sinIn(authDto);
    const { accessToken, user: _user } = result;

    const { password, ...user } = _user;

    return {
      user,
      accessToken,
    };
  }
}
