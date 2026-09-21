import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
export type AppUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "CLIENT" | "ADMIN";
};
export type ProfileUpdate = {
  name: string;
  phone: string;
  currentPassword: string;
  newPassword?: string;
};
type Session = { accessToken: string; user: AppUser };
@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly tokenKey = "jembatech_access_token";
  private readonly userKey = "jembatech_user";
  user?: AppUser = this.readUser();
  constructor(private readonly http: HttpClient) {}
  register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Observable<Session> {
    return this.http
      .post<Session>("/api/auth/register", data)
      .pipe(tap((s) => this.save(s)));
  }
  login(data: { email: string; password: string }): Observable<Session> {
    return this.http
      .post<Session>("/api/auth/login", data)
      .pipe(tap((s) => this.save(s)));
  }
  updateProfile(data: ProfileUpdate): Observable<Session> {
    return this.http
      .patch<Session>("/api/auth/me", data, {
        headers: { Authorization: `Bearer ${this.token()}` },
      })
      .pipe(tap((s) => this.save(s)));
  }
  token() {
    return localStorage.getItem(this.tokenKey) ?? "";
  }
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.user = undefined;
  }
  private save(session: Session) {
    localStorage.setItem(this.tokenKey, session.accessToken);
    localStorage.setItem(this.userKey, JSON.stringify(session.user));
    this.user = session.user;
  }
  private readUser(): AppUser | undefined {
    try {
      const raw = localStorage.getItem(this.userKey);
      return raw ? (JSON.parse(raw) as AppUser) : undefined;
    } catch {
      return undefined;
    }
  }
}
