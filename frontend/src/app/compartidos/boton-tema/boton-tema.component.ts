import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-boton-tema",
  standalone: true,
  templateUrl: "./boton-tema.component.html",
  styleUrl: "./boton-tema.component.scss",
})
export class BotonTemaComponent implements OnInit {
  ngOnInit() {
    const guardado = localStorage.getItem("jembatech-tema");
    if (guardado) document.documentElement.setAttribute("data-theme", guardado);
  }
  alternar() {
    const raiz = document.documentElement;
    const tema = raiz.getAttribute("data-theme") === "light" ? "dark" : "light";
    raiz.setAttribute("data-theme", tema);
    localStorage.setItem("jembatech-tema", tema);
  }
}
