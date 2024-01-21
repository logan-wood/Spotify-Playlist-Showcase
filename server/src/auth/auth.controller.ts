import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getLogin(): URL {
    return this.authService.getLoginUrl()
  }

  @Get('callback')
  handleCallback(@Query() params: any, @Res({ passthrough: true }) response: Response): Promise<string> {
    return this.authService.handleCallback(params, response);
  }
}
