import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../servicios/autenticacion.service";
@Component({
  selector: "app-perfil",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./perfil.component.html",
  styleUrl: "../../estilos/paginas.scss",
})
export class PerfilComponent {
  readonly autenticacion = inject(AuthService);
  nombre = this.autenticacion.user?.name || "";
  telefono = this.autenticacion.user?.phone || "";
  contrasenaActual = "";
  contrasenaNueva = "";
  cargando = false;
  error = "";
  mensaje = "";
  guardar() {
    this.cargando = true;
    this.error = "";
    this.mensaje = "";
    this.autenticacion
      .updateProfile({
        name: this.nombre,
        phone: this.telefono,
        currentPassword: this.contrasenaActual,
        newPassword: this.contrasenaNueva || undefined,
      })
      .subscribe({
        next: (sesion) => {
          this.cargando = false;
          this.contrasenaActual = "";
          this.contrasenaNueva = "";
          this.mensaje = "Perfil actualizado y sesión renovada.";
          window.dispatchEvent(
            new CustomEvent("jembatech-auth-change", { detail: sesion.user }),
          );
        },
        error: (error) => {
          this.cargando = false;
          this.error =
            error?.error?.message || "No se pudo actualizar el perfil.";
        },
      });
  }
}
