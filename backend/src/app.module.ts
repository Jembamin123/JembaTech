import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { EvaluationsController } from './evaluations.controller';
import { QuotesController } from './quotes.controller';
import { EvaluatorService } from './evaluator.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [HealthController, EvaluationsController, QuotesController],
  providers: [EvaluatorService, PrismaService],
})
export class AppModule {}
