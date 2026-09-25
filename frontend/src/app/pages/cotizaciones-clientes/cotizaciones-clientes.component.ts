import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { QuoteService } from "../../servicios/cotizaciones.service";
@Component({
  selector: "app-cotizaciones-clientes",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./cotizaciones-clientes.component.html",
  styleUrl: "../../estilos/paginas.scss",
})
export class CotizacionesClientesComponent implements OnInit {
  private readonly servicio = inject(QuoteService);
  cotizaciones: any[] = [];
  cargando = true;
  guardandoId = "";
  mensaje = "";
  ngOnInit() {
    this.recargar();
  }
  recargar() {
    this.cargando = true;
    this.servicio.list().subscribe({
      next: (datos) => {
        this.cotizaciones = datos;
        this.cargando = false;
      },
      error: () => (this.cargando = false),
    });
  }
  guardar(cotizacion: any) {
    this.guardandoId = cotizacion.id;
    this.mensaje = "";
    this.servicio
      .coordinate(
        cotizacion.id,
        {
          status: cotizacion.status,
          adminNote: cotizacion.adminNote,
          preferredDate: cotizacion.preferredDate || undefined,
        },
      )
      .subscribe({
        next: () => {
          this.guardandoId = "";
          this.mensaje = "Cotización actualizada.";
        },
        error: () => {
          this.guardandoId = "";
          this.mensaje = "No se pudo actualizar la cotización.";
        },
      });
  }
  dinero(valor: number) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(valor);
  }
  whatsapp(cotizacion: any) {
    const telefono = (
      cotizacion.user?.phone ||
      cotizacion.contactPhone ||
      ""
    ).replace(/\D/g, "");
    const texto = encodeURIComponent(
      `Hola ${cotizacion.user?.name || ""}, revisé tu cotización JembaTech ${cotizacion.id}.`,
    );
    return `https://wa.me/${telefono}?text=${texto}`;
  }
}
