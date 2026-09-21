import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../servicios/autenticacion.service";

@Component({
  selector: "app-encabezado",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./encabezado.component.html",
  styleUrl: "./encabezado.component.scss",
})
export class EncabezadoComponent {
  readonly autenticacion = inject(AuthService);
  private readonly router = inject(Router);
  private readonly elemento = inject(ElementRef);
  abierto = false;
  get iniciales() {
    const usuario = this.autenticacion.user;
    if (!usuario) return "?";
    return usuario.role === "ADMIN"
      ? "AD"
      : (usuario.name || usuario.email).slice(0, 2).toUpperCase();
  }
  alternar() {
    if (!this.autenticacion.user) {
      this.router.navigateByUrl("/login");
      return;
    }
    this.abierto = !this.abierto;
  }
  salir() {
    this.autenticacion.logout();
    this.abierto = false;
    window.dispatchEvent(
      new CustomEvent("jembatech-auth-change", { detail: null }),
    );
    this.router.navigateByUrl("/login");
  }
  @HostListener("document:click", ["$event"]) cerrarFuera(event: MouseEvent) {
    if (!this.elemento.nativeElement.contains(event.target))
      this.abierto = false;
  }
}
