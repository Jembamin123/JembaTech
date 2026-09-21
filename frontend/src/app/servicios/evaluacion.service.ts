import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
export interface EvaluationRequest {
  budget: number;
  intended_use: string;
  total_price: number;
  ram_gb: number;
  storage_gb: number;
  psu_watts: number;
  estimated_consumption_watts: number;
}
export interface EvaluationResult {
  quoteId?: string;
  score: number;
  level: string;
  warnings: string[];
  recommendations: string[];
  explanation: string;
}
@Injectable({ providedIn: "root" })
export class EvaluationService {
  constructor(private readonly http: HttpClient) {}
  evaluate(
    configuration: EvaluationRequest,
    token: string,
  ): Observable<EvaluationResult> {
    return this.http.post<EvaluationResult>("/api/evaluations", configuration, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }
}
