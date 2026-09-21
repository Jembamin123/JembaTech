import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { BotonTemaComponent } from "../boton-tema/boton-tema.component";
import { BotonWhatsappComponent } from "../boton-whatsapp/boton-whatsapp.component";
import { EncabezadoComponent } from "../encabezado/encabezado.component";
import { FondoCircuitosComponent } from "../fondo-circuitos/fondo-circuitos.component";
import { MenuLateralComponent } from "../menu-lateral/menu-lateral.component";

@Component({
  selector: "app-layout-principal",
  standalone: true,
  imports: [
    RouterOutlet,
    MenuLateralComponent,
    EncabezadoComponent,
    FondoCircuitosComponent,
    BotonTemaComponent,
    BotonWhatsappComponent,
  ],
  templateUrl: "./layout-principal.component.html",
  styleUrl: "./layout-principal.component.scss",
})
export class LayoutPrincipalComponent implements OnInit, OnDestroy {
  private desbordeAnterior = "";
  ngOnInit() {
    this.desbordeAnterior = document.body.style.overflow;
    document.body.classList.add("ruta-interna");
    document.body.style.overflow = "hidden";
  }
  ngOnDestroy() {
    document.body.classList.remove("ruta-interna");
    document.body.style.overflow = this.desbordeAnterior;
  }
}
