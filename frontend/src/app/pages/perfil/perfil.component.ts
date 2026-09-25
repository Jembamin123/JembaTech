import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../servicios/autenticacion.service";
@Component({
  selector: "app-perfil",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./perfil.component.html",
  styleUrl: "../../estilos/paginas.scss",
})
export class PerfilComponent {
  readonly autenticacion = inject(AuthService);
  private readonly formularioBuilder = inject(FormBuilder);
  readonly formulario = this.formularioBuilder.nonNullable.group({
    nombre: [this.autenticacion.user?.name || "", [Validators.required, Validators.minLength(2)]],
    telefono: [this.autenticacion.user?.phone || "", [Validators.required, Validators.minLength(8)]],
    contrasenaActual: ["", Validators.required],
    contrasenaNueva: ["", Validators.minLength(8)],
  });
  cargando = false;
  error = "";
  mensaje = "";
  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.error = "Completa los campos requeridos con datos válidos.";
      return;
    }

    this.cargando = true;
    this.error = "";
    this.mensaje = "";
    const datos = this.formulario.getRawValue();
    this.autenticacion
      .updateProfile({
        name: datos.nombre,
        phone: datos.telefono,
        currentPassword: datos.contrasenaActual,
        newPassword: datos.contrasenaNueva || undefined,
      })
      .subscribe({
        next: (sesion) => {
          this.cargando = false;
          this.formulario.reset({
            nombre: sesion.user.name,
            telefono: sesion.user.phone || "",
            contrasenaActual: "",
            contrasenaNueva: "",
          });
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
