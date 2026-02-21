import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: any) {
    console.log('[AUTH] Signup request for:', dto.email);
    const result = await this.authService.signup(dto);
    console.log('[AUTH] Signup successful for:', dto.email);
    return result;
  }

  @Post('login')
  async login(@Body() dto: any) {
    console.log('[AUTH] Login request for:', dto.email);
    const result = await this.authService.login(dto);
    console.log('[AUTH] Login successful for:', dto.email);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: any) {
    return user;
  }
}
