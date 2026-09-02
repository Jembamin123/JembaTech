import { Body, Controller, Post } from '@nestjs/common';
import { IsInt, IsPositive, IsString, Min } from 'class-validator';
import { EvaluatorService } from './evaluator.service';
class CreateEvaluationDto { @IsInt() @IsPositive() budget!: number; @IsString() intended_use!: string; @IsInt() @Min(0) total_price!: number; @IsInt() @Min(0) ram_gb!: number; @IsInt() @Min(0) storage_gb!: number; @IsInt() @Min(0) psu_watts!: number; @IsInt() @Min(0) estimated_consumption_watts!: number; }
@Controller('evaluations')
export class EvaluationsController { constructor(private readonly evaluator: EvaluatorService) {} @Post() create(@Body() dto: CreateEvaluationDto) { return this.evaluator.evaluate(dto); } }
