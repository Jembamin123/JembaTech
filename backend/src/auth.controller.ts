import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthenticatedRequest, JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

class RegisterDto {
  @IsString() @MinLength(2) @MaxLength(80) name!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(8) @MaxLength(100) password!: string;
  @IsString() @MinLength(8) @MaxLength(30) phone!: string;
}
class LoginDto { @IsEmail() email!: string; @IsString() @MinLength(8) password!: string; }
class UpdateProfileDto {
  @IsString() @MinLength(2) @MaxLength(80) name!: string;
  @IsString() @MinLength(8) @MaxLength(30) phone!: string;
  @IsString() @MinLength(8) currentPassword!: string;
  @IsOptional() @IsString() @MinLength(8) @MaxLength(100) newPassword?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('register') register(@Body() dto: RegisterDto) { return this.auth.register(dto); }
  @Post('login') login(@Body() dto: LoginDto) { return this.auth.login(dto.email, dto.password); }
  @Get('me') @UseGuards(JwtAuthGuard) me(@Req() request: AuthenticatedRequest) { return this.auth.me(request.user.sub); }
  @Patch('me') @UseGuards(JwtAuthGuard) updateMe(@Req() request: AuthenticatedRequest, @Body() dto: UpdateProfileDto) { return this.auth.updateProfile(request.user.sub, dto); }
}
