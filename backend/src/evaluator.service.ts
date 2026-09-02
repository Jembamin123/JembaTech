import { HttpService } from '@nestjs/axios';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class EvaluatorService { constructor(private readonly http: HttpService) {} async evaluate(payload: object) { try { const response = await firstValueFrom(this.http.post(`${process.env.PYTHON_SERVICE_URL ?? 'http://localhost:8000'}/evaluate`, payload, { timeout: 4000 })); return response.data; } catch { throw new ServiceUnavailableException('El evaluador no esta disponible. Intenta nuevamente.'); } } }
