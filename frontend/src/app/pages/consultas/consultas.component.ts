import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { AuthService } from "../../servicios/autenticacion.service";
import { QuoteService } from "../../servicios/cotizaciones.service";
@Component({
  selector: "app-consultas",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./consultas.component.html",
  styleUrl: "../../estilos/paginas.scss",
})
export class ConsultasComponent implements OnInit {
  private readonly autenticacion = inject(AuthService);
  private readonly servicio = inject(QuoteService);
  cotizaciones: any[] = [];
  cargando = true;
  ngOnInit() {
    this.servicio.list(this.autenticacion.token()).subscribe({
      next: (datos) => {
        this.cotizaciones = datos.filter((item) => item.status !== "DRAFT");
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
