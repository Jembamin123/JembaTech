import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../servicios/autenticacion.service";
@Component({
  selector: "app-inicio-sesion",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./inicio-sesion.component.html",
  styleUrl: "../../estilos/paginas.scss",
})
export class InicioSesionComponent {
  private readonly autenticacion = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);
  modo: "login" | "registro" = "login";
  nombre = "";
  correo = "";
  contrasena = "";
  telefono = "";
  cargando = false;
  error = "";
  enviar() {
    this.cargando = true;
    this.error = "";
    const solicitud =
      this.modo === "login"
        ? this.autenticacion.login({
            email: this.correo,
            password: this.contrasena,
          })
        : this.autenticacion.register({
            name: this.nombre,
            email: this.correo,
            password: this.contrasena,
            phone: this.telefono,
          });
    solicitud.subscribe({
      next: (sesion) => {
        this.cargando = false;
        window.dispatchEvent(
          new CustomEvent("jembatech-auth-change", { detail: sesion.user }),
        );
        const destino = this.ruta.snapshot.queryParamMap.get("returnUrl");
        this.router.navigateByUrl(
          destino && destino.startsWith("/") ? destino : "/perfil",
        );
      },
      error: (error) => {
        this.cargando = false;
        this.error =
          error?.error?.message || "No fue posible acceder. Revisa los datos.";
      },
    });
  }
}
