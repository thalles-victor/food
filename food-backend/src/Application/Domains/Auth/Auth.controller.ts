import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './Auth.service';
import { SignUpDto } from './dtos/SignUp.dto';
import { SignInDto } from './dtos/SignIn.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() userDto: SignUpDto) {
    return this.authService.signUp(userDto);
  }

  @Post('signIn')
  async signIn(@Body() authDto: SignInDto) {
    return this.authService.sinIn(authDto);
  }
}
