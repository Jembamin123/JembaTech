import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { QuoteStatus } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { AuthenticatedRequest, JwtAuthGuard } from './auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

class RequestCoordinationDto {
  @IsOptional() @IsString() @MaxLength(30) contactPhone?: string;
  @IsOptional() @IsString() @MaxLength(240) serviceAddress?: string;
  @IsOptional() @IsDateString() preferredDate?: string;
  @IsOptional() @IsString() @MaxLength(600) customerNote?: string;
}

class AdminCoordinationDto {
  @IsEnum(QuoteStatus) status!: QuoteStatus;
  @IsOptional() @IsString() @MaxLength(600) adminNote?: string;
  @IsOptional() @IsDateString() preferredDate?: string;
}

@Controller('quotes')
export class QuotesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findLatest(@Req() request: AuthenticatedRequest) {
    const isAdmin = request.user.role === 'ADMIN';
    return this.prisma.quote.findMany({
      where: isAdmin ? {} : { userId: request.user.sub },
      include: isAdmin ? { user: { select: { id: true, name: true, email: true, phone: true } } } : undefined,
      orderBy: { createdAt: 'desc' }, take: 20,
    });
  }

  @Patch(':id/request')
  @UseGuards(JwtAuthGuard)
  async requestCoordination(@Param('id') id: string, @Body() dto: RequestCoordinationDto, @Req() request: AuthenticatedRequest) {
    const quote = await this.prisma.quote.findUnique({ where: { id } });
    if (!quote || (request.user.role !== 'ADMIN' && quote.userId !== request.user.sub)) return null;
    return this.prisma.quote.update({ where: { id }, data: { ...dto, preferredDate: dto.preferredDate ? new Date(dto.preferredDate) : undefined, status: QuoteStatus.REQUESTED } });
  }

  @Patch(':id/coordination')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  coordinate(@Param('id') id: string, @Body() dto: AdminCoordinationDto) {
    return this.prisma.quote.update({ where: { id }, data: { ...dto, preferredDate: dto.preferredDate ? new Date(dto.preferredDate) : undefined } });
  }
}
