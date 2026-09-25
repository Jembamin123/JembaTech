import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
export type CoordinationRequest = {
  contactPhone?: string;
  serviceAddress?: string;
  preferredDate?: string;
  customerNote?: string;
};
export type AdminCoordination = {
  status: string;
  adminNote?: string;
  preferredDate?: string;
};
@Injectable({ providedIn: "root" })
export class QuoteService {
  constructor(private readonly http: HttpClient) {}
  list(): Observable<any[]> {
    return this.http.get<any[]>("/api/quotes");
  }
  requestCoordination(
    id: string,
    data: CoordinationRequest,
  ): Observable<unknown> {
    return this.http.patch(`/api/quotes/${id}/request`, data);
  }
  coordinate(
    id: string,
    data: AdminCoordination,
  ): Observable<unknown> {
    return this.http.patch(`/api/quotes/${id}/coordination`, data);
  }
}
