import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  findLatest() {
    return this.prisma.quote.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
  }
}
