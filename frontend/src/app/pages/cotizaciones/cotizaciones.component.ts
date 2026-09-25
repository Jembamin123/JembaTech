import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { QuoteService } from "../../servicios/cotizaciones.service";
@Component({
  selector: "app-cotizaciones",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./cotizaciones.component.html",
  styleUrl: "../../estilos/paginas.scss",
})
export class CotizacionesComponent implements OnInit {
  private readonly servicio = inject(QuoteService);
  cotizaciones: any[] = [];
  cargando = true;
  ngOnInit() {
    this.servicio.list().subscribe({
      next: (datos) => {
        this.cotizaciones = datos;
        this.cargando = false;
      },
      error: () => (this.cargando = false),
    });
  }
  dinero(valor: number) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(valor);
  }
  estado(valor: string) {
    return (
      (
        {
          DRAFT: "BORRADOR",
          REQUESTED: "SOLICITADA",
          REVIEWING: "EN REVISIÓN",
          SCHEDULED: "AGENDADA",
          COMPLETED: "COMPLETADA",
          EXPIRED: "CERRADA",
        } as Record<string, string>
      )[valor] || valor
    );
  }
}
