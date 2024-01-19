import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getLogin(): URL {
    return this.authService.getLoginUrl()
  }

  @Get('callback')
  handleCallback(@Query() params: any): Promise<string> {
    return this.authService.handleCallback(params)
  }
}
