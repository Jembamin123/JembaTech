import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
  list(token: string): Observable<any[]> {
    return this.http.get<any[]>("/api/quotes", {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }
  requestCoordination(
    id: string,
    data: CoordinationRequest,
    token: string,
  ): Observable<unknown> {
    return this.http.patch(`/api/quotes/${id}/request`, data, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }
  coordinate(
    id: string,
    data: AdminCoordination,
    token: string,
  ): Observable<unknown> {
    return this.http.patch(`/api/quotes/${id}/coordination`, data, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }
}
