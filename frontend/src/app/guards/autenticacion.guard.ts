import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../servicios/autenticacion.service";
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.user ? true : inject(Router).createUrlTree(["/login"]);
};
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (!auth.user) return inject(Router).createUrlTree(["/login"]);
  return auth.user.role === "ADMIN"
    ? true
    : inject(Router).createUrlTree(["/perfil"]);
};
