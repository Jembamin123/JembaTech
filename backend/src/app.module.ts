import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { EvaluationsController } from './evaluations.controller';
import { EvaluatorService } from './evaluator.service';

@Module({ imports: [HttpModule], controllers: [HealthController, EvaluationsController], providers: [EvaluatorService] })
export class AppModule {}
