import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  EvaluationResult,
  EvaluationService,
} from "./servicios/evaluacion.service";
import { AuthService, AppUser } from "./servicios/autenticacion.service";
import { QuoteService } from "./servicios/cotizaciones.service";
import { RouterOutlet } from "@angular/router";

type Brand = "AMD" | "Intel";
type Tier = "Entrada" | "Media" | "Alta";
interface CPU {
  id: string;
  brand: Brand;
  tier: Tier;
  name: string;
  socket: string;
  ram: "DDR4" | "DDR5";
  igpu: boolean;
  power: number;
  price: number;
  recommended?: boolean;
}
interface GPU {
  id: string;
  name: string;
  vram: string;
  power: number;
  price: number;
  tier: Tier;
  integrated?: boolean;
}
interface Board {
  id: string;
  name: string;
  socket: string;
  form: "ATX" | "mATX";
  ram: "DDR4" | "DDR5";
  wifi: boolean;
  maxRam: number;
  m2: number;
  price: number;
}
interface Choice {
  id: string;
  name: string;
  detail: string;
  price: number;
  recommended?: boolean;
}
interface CaseChoice extends Choice {
  forms: ("ATX" | "mATX")[];
  gpuClearance: number;
  fans: number;
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss", "./account-pages.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly evaluationService = inject(EvaluationService);
  private readonly authService = inject(AuthService);
  private readonly quoteService = inject(QuoteService);
  step = 1;
  brand: Brand = "AMD";
  tier: Tier = "Media";
  cpu?: CPU;
  gpu?: GPU;
  board?: Board;
  wantWifi = true;
  ramGb = 16;
  storage?: Choice;
  extraHdd = false;
  caseChoice?: CaseChoice;
  psu?: Choice;
  cooling?: Choice;
  fanCount = 2;
  finished = false;
  evaluation?: EvaluationResult;
  evaluationError = "";
  evaluating = false;
  user?: AppUser = this.authService.user;
  authMode: "login" | "register" = "login";
  authName = "";
  authEmail = "";
  authPassword = "";
  authPhone = "";
  authError = "";
  authLoading = false;
  resumeAfterAuth = false;
  profileName = "";
  profilePhone = "";
  profileCurrentPassword = "";
  profileNewPassword = "";
  profileError = "";
  profileMessage = "";
  profileSaving = false;
  contactPhone = "";
  serviceAddress = "";
  preferredDate = "";
  customerNote = "";
  coordinationMessage = "";
  coordinationLoading = false;
  accountOpen = false;
  accountPanel: "access" | "profile" | "quotes" | "consultations" | "admin" =
    "access";
  accountPage: "access" | "profile" | "quotes" | "consultations" | "admin" =
    "access";
  quotes: any[] = [];
  quotesLoading = false;
  adminNote = "";
  adminStatus = "REVIEWING";
  adminMessage = "";
  adminSaving = false;
  private readonly onAccountOpen = (event: Event) =>
    this.openAccount((event as CustomEvent<string>).detail || "access");
  private readonly onPopState = () => this.syncRoute();
  private readonly onLogout = () => this.logout();
  ngOnInit() {
    setTimeout(() => this.notifyAuth(), 0);
  }
  ngOnDestroy() {}
  cpus: CPU[] = [
    {
      id: "5600g",
      brand: "AMD",
      tier: "Entrada",
      name: "Ryzen 5 5600G",
      socket: "AM4",
      ram: "DDR4",
      igpu: true,
      power: 65,
      price: 129990,
    },
    {
      id: "5600",
      brand: "AMD",
      tier: "Entrada",
      name: "Ryzen 5 5600",
      socket: "AM4",
      ram: "DDR4",
      igpu: false,
      power: 65,
      price: 119990,
    },
    {
      id: "7600",
      brand: "AMD",
      tier: "Media",
      name: "Ryzen 5 7600",
      socket: "AM5",
      ram: "DDR5",
      igpu: true,
      power: 65,
      price: 209990,
      recommended: true,
    },
    {
      id: "7800x3d",
      brand: "AMD",
      tier: "Alta",
      name: "Ryzen 7 7800X3D",
      socket: "AM5",
      ram: "DDR5",
      igpu: true,
      power: 120,
      price: 399990,
    },
    {
      id: "i3",
      brand: "Intel",
      tier: "Entrada",
      name: "Core i3-14100",
      socket: "LGA1700",
      ram: "DDR4",
      igpu: true,
      power: 60,
      price: 139990,
    },
    {
      id: "i5",
      brand: "Intel",
      tier: "Media",
      name: "Core i5-14400",
      socket: "LGA1700",
      ram: "DDR5",
      igpu: true,
      power: 148,
      price: 249990,
      recommended: true,
    },
    {
      id: "i5f",
      brand: "Intel",
      tier: "Media",
      name: "Core i5-14400F",
      socket: "LGA1700",
      ram: "DDR5",
      igpu: false,
      power: 148,
      price: 219990,
    },
    {
      id: "i7",
      brand: "Intel",
      tier: "Alta",
      name: "Core i7-14700K",
      socket: "LGA1700",
      ram: "DDR5",
      igpu: true,
      power: 253,
      price: 459990,
    },
  ];
  gpus: GPU[] = [
    {
      id: "none",
      name: "Sin tarjeta dedicada",
      vram: "Usa los gráficos del procesador",
      power: 0,
      price: 0,
      tier: "Entrada",
      integrated: true,
    },
    {
      id: "rx7600",
      name: "Radeon RX 7600",
      vram: "8 GB · 1080p",
      power: 165,
      price: 329990,
      tier: "Media",
    },
    {
      id: "rtx4060",
      name: "GeForce RTX 4060",
      vram: "8 GB · 1080p / DLSS",
      power: 115,
      price: 369990,
      tier: "Media",
    },
    {
      id: "rx7800",
      name: "Radeon RX 7800 XT",
      vram: "16 GB · 1440p",
      power: 263,
      price: 599990,
      tier: "Alta",
    },
    {
      id: "rtx4070",
      name: "GeForce RTX 4070 Super",
      vram: "12 GB · 1440p / Ray Tracing",
      power: 220,
      price: 649990,
      tier: "Alta",
    },
  ];
  boards: Board[] = [
    {
      id: "b550m",
      name: "MSI B550M PRO-VDH WiFi",
      socket: "AM4",
      form: "mATX",
      ram: "DDR4",
      wifi: true,
      maxRam: 128,
      m2: 2,
      price: 109990,
    },
    {
      id: "b550",
      name: "ASUS TUF B550-PLUS",
      socket: "AM4",
      form: "ATX",
      ram: "DDR4",
      wifi: false,
      maxRam: 128,
      m2: 2,
      price: 139990,
    },
    {
      id: "b650m",
      name: "Gigabyte B650M DS3H",
      socket: "AM5",
      form: "mATX",
      ram: "DDR5",
      wifi: false,
      maxRam: 192,
      m2: 2,
      price: 139990,
    },
    {
      id: "b650",
      name: "MSI B650 Gaming Plus WiFi",
      socket: "AM5",
      form: "ATX",
      ram: "DDR5",
      wifi: true,
      maxRam: 192,
      m2: 2,
      price: 179990,
    },
    {
      id: "b760m",
      name: "MSI PRO B760M-A WiFi",
      socket: "LGA1700",
      form: "mATX",
      ram: "DDR5",
      wifi: true,
      maxRam: 192,
      m2: 2,
      price: 169990,
    },
    {
      id: "z790",
      name: "Gigabyte Z790 Eagle AX",
      socket: "LGA1700",
      form: "ATX",
      ram: "DDR5",
      wifi: true,
      maxRam: 192,
      m2: 3,
      price: 239990,
    },
    {
      id: "b660d4",
      name: "ASUS Prime B660M-A D4",
      socket: "LGA1700",
      form: "mATX",
      ram: "DDR4",
      wifi: false,
      maxRam: 128,
      m2: 2,
      price: 129990,
    },
  ];
  storages: Choice[] = [
    {
      id: "nvme1",
      name: "SSD NVMe 1 TB",
      detail: "La opción recomendada · máxima velocidad",
      price: 69990,
      recommended: true,
    },
    {
      id: "nvme2",
      name: "SSD NVMe 2 TB",
      detail: "Rápido y con mayor capacidad",
      price: 119990,
    },
    {
      id: "sata1",
      name: "SSD SATA 1 TB",
      detail: "Buena velocidad para equipos económicos",
      price: 59990,
    },
    {
      id: "hdd2",
      name: "HDD 2 TB",
      detail: "Más capacidad, pero mucho más lento",
      price: 49990,
    },
  ];
  cases: CaseChoice[] = [
    {
      id: "ch370",
      name: "DeepCool CH370",
      detail: "Compacto · frontal ventilado",
      price: 59990,
      forms: ["mATX"],
      gpuClearance: 320,
      fans: 1,
      recommended: true,
    },
    {
      id: "cc560",
      name: "DeepCool CC560 ARGB",
      detail: "4 ventiladores incluidos · excelente flujo",
      price: 69990,
      forms: ["ATX", "mATX"],
      gpuClearance: 370,
      fans: 4,
      recommended: true,
    },
    {
      id: "h5",
      name: "NZXT H5 Flow",
      detail: "ATX premium · diseño limpio",
      price: 109990,
      forms: ["ATX", "mATX"],
      gpuClearance: 365,
      fans: 2,
    },
  ];
  psus: Choice[] = [
    {
      id: "550",
      name: "550 W 80+ Bronze",
      detail: "Para gráficos integrados o GPU básica",
      price: 49990,
    },
    {
      id: "650",
      name: "650 W 80+ Bronze",
      detail: "Gama media con margen seguro",
      price: 69990,
    },
    {
      id: "750",
      name: "750 W 80+ Gold",
      detail: "GPU potente y futuros upgrades",
      price: 99990,
    },
    {
      id: "850",
      name: "850 W 80+ Gold",
      detail: "Equipos de gama alta",
      price: 129990,
    },
  ];
  coolers: Choice[] = [
    {
      id: "stock",
      name: "Cooler incluido",
      detail: "Suficiente para procesadores eficientes",
      price: 0,
    },
    {
      id: "tower",
      name: "Cooler torre DeepCool AK400",
      detail: "Menor temperatura y ruido",
      price: 39990,
      recommended: true,
    },
    {
      id: "aio",
      name: "Refrigeración líquida 240 mm",
      detail: "Para CPU de alto consumo y estética",
      price: 89990,
    },
  ];
  get filteredCpus() {
    return this.cpus.filter(
      (c) => c.brand === this.brand && c.tier === this.tier,
    );
  }
  get filteredBoards() {
    return this.boards.filter(
      (b) =>
        b.socket === this.cpu?.socket &&
        b.ram === this.cpu?.ram &&
        (!this.wantWifi || b.wifi),
    );
  }
  get filteredCases() {
    return this.cases.filter(
      (c) => this.board && c.forms.includes(this.board.form),
    );
  }
  get ramOptions() {
    return [8, 16, 32, 64].filter((v) => v <= (this.board?.maxRam || 64));
  }
  get recommendedWatts() {
    return (
      Math.ceil(
        (((this.cpu?.power || 0) + (this.gpu?.power || 0) + 100) * 1.35) / 50,
      ) * 50
    );
  }
  get total() {
    const ramPrice =
      { 8: 24990, 16: 49990, 32: 89990, 64: 169990 }[
        this.ramGb as 8 | 16 | 32 | 64
      ] || 0;
    return (
      (this.cpu?.price || 0) +
      (this.gpu?.price || 0) +
      (this.board?.price || 0) +
      ramPrice +
      (this.storage?.price || 0) +
      (this.extraHdd ? 49990 : 0) +
      (this.caseChoice?.price || 0) +
      (this.psu?.price || 0) +
      (this.cooling?.price || 0) +
      this.fanCount * 6990
    );
  }
  get compatible() {
    return !!(
      this.cpu &&
      this.gpu &&
      this.board &&
      this.storage &&
      this.caseChoice &&
      this.psu &&
      this.cooling &&
      this.board.socket === this.cpu.socket &&
      this.board.ram === this.cpu.ram &&
      this.caseChoice.forms.includes(this.board.form) &&
      Number(this.psu.id) >= this.recommendedWatts
    );
  }
  money(n: number) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(n);
  }
  selectCpu(c: CPU) {
    this.cpu = c;
    this.gpu = undefined;
    this.board = undefined;
    this.caseChoice = undefined;
    this.psu = undefined;
    this.finished = false;
  }
  selectGpu(g: GPU) {
    if (!g.integrated || this.cpu?.igpu) {
      this.gpu = g;
      this.caseChoice = undefined;
      this.psu = undefined;
      this.finished = false;
    }
  }
  selectBoard(b: Board) {
    this.board = b;
    this.caseChoice = undefined;
    this.finished = false;
  }
  next() {
    this.step = Math.min(7, this.step + 1);
    window.setTimeout(
      () =>
        document
          .getElementById("builder-card")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      10,
    );
  }
  back() {
    this.finished = false;
    this.step = Math.max(1, this.step - 1);
  }
  go(n: number) {
    if (n < this.step) {
      this.finished = false;
      this.step = n;
    }
  }
  psuEnough(p: Choice) {
    return Number(p.id) >= this.recommendedWatts;
  }
  submitAuth() {
    this.authError = "";
    this.authLoading = true;
    const request =
      this.authMode === "login"
        ? this.authService.login({
            email: this.authEmail,
            password: this.authPassword,
          })
        : this.authService.register({
            name: this.authName,
            email: this.authEmail,
            password: this.authPassword,
            phone: this.authPhone,
          });
    request.subscribe({
      next: (session) => {
        this.user = session.user;
        this.authLoading = false;
        this.authPassword = "";
        this.notifyAuth();
        if (this.resumeAfterAuth) {
          this.resumeAfterAuth = false;
          this.closeAccount();
          this.finish();
        } else {
          this.openAccount("profile");
        }
      },
      error: (error) => {
        this.authLoading = false;
        this.authError =
          error?.error?.message || "No fue posible acceder. Revisa tus datos.";
      },
    });
  }
  private routeFor(
    panel: "access" | "profile" | "quotes" | "consultations" | "admin",
  ) {
    return panel === "access"
      ? "/login"
      : panel === "profile"
        ? "/perfil"
        : panel === "quotes"
          ? "/cotizaciones"
          : panel === "consultations"
            ? "/consultas"
            : "/admin/cotizaciones";
  }
  private syncRoute() {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    const found: Record<
      string,
      "access" | "profile" | "quotes" | "consultations" | "admin"
    > = {
      "/login": "access",
      "/perfil": "profile",
      "/cotizaciones": "quotes",
      "/consultas": "consultations",
      "/admin/cotizaciones": "admin",
    };
    const panel = found[path];
    if (!panel) {
      this.accountOpen = false;
      document.body.classList.remove("account-page");
      return;
    }
    this.accountPanel = panel;
    if (!this.user && panel !== "access") {
      this.accountPanel = "access";
      if (path !== "/login") window.history.replaceState({}, "", "/login");
    }
    if (this.accountPanel === "admin" && this.user?.role !== "ADMIN")
      this.accountPanel = "profile";
    this.accountPage = this.accountPanel;
    this.accountOpen = true;
    document.body.classList.add("account-page");
    if (
      this.accountPanel === "quotes" ||
      this.accountPanel === "consultations" ||
      this.accountPanel === "admin"
    )
      this.loadQuotes();
    if (this.accountPanel === "profile" && this.user) {
      this.profileName = this.user.name;
      this.profilePhone = this.user.phone || "";
    }
  }
  openAccount(panel: string = "access") {
    const valid =
      panel === "access" ||
      panel === "profile" ||
      panel === "quotes" ||
      panel === "consultations" ||
      panel === "admin";
    this.accountPanel = (valid ? panel : "access") as
      | "access"
      | "profile"
      | "quotes"
      | "consultations"
      | "admin";
    if (!this.user && this.accountPanel !== "access")
      this.accountPanel = "access";
    if (this.accountPanel === "admin" && this.user?.role !== "ADMIN")
      this.accountPanel = "profile";
    this.accountPage = this.accountPanel;
    const nextPath = this.routeFor(this.accountPanel);
    if (window.location.pathname !== nextPath)
      window.history.pushState({}, "", nextPath);
    this.accountOpen = true;
    document.body.classList.add("account-page");
    if (
      this.accountPanel === "quotes" ||
      this.accountPanel === "consultations" ||
      this.accountPanel === "admin"
    )
      this.loadQuotes();
  }
  closeAccount() {
    this.accountOpen = false;
    document.body.classList.remove("account-page");
    if (window.location.pathname !== "/") window.history.pushState({}, "", "/");
  }
  loadQuotes() {
    if (!this.user) return;
    this.quotesLoading = true;
    this.quoteService.list(this.authService.token()).subscribe({
      next: (quotes) => {
        this.quotes = quotes;
        this.quotesLoading = false;
      },
      error: () => {
        this.quotes = [];
        this.quotesLoading = false;
      },
    });
  }
  saveAdminQuote(quote: any) {
    if (!quote?.id || !this.user) return;
    this.adminSaving = true;
    this.adminMessage = "";
    this.quoteService
      .coordinate(
        quote.id,
        {
          status: this.adminStatus,
          adminNote: this.adminNote,
          preferredDate: quote.preferredDate || undefined,
        },
        this.authService.token(),
      )
      .subscribe({
        next: (updated) => {
          Object.assign(quote, updated);
          this.adminSaving = false;
          this.adminMessage = "Cotización actualizada correctamente.";
        },
        error: () => {
          this.adminSaving = false;
          this.adminMessage = "No se pudo actualizar la cotización.";
        },
      });
  }
  saveProfile() {
    if (!this.profileCurrentPassword) {
      this.profileError = "Confirma tu contraseña actual para guardar cambios.";
      return;
    }
    this.profileSaving = true;
    this.profileError = "";
    this.profileMessage = "";
    this.authService
      .updateProfile({
        name: this.profileName,
        phone: this.profilePhone,
        currentPassword: this.profileCurrentPassword,
        newPassword: this.profileNewPassword || undefined,
      })
      .subscribe({
        next: (session) => {
          this.user = session.user;
          this.profileCurrentPassword = "";
          this.profileNewPassword = "";
          this.profileSaving = false;
          this.profileMessage = "Perfil actualizado. Tu sesión fue renovada.";
          this.notifyAuth();
        },
        error: (error) => {
          this.profileSaving = false;
          this.profileError =
            error?.error?.message || "No se pudo actualizar el perfil.";
        },
      });
  }
  logout() {
    this.authService.logout();
    this.user = undefined;
    this.evaluation = undefined;
    this.finished = false;
    this.coordinationMessage = "";
    this.quotes = [];
    this.closeAccount();
    this.notifyAuth();
  }
  private notifyAuth() {
    window.dispatchEvent(
      new CustomEvent("jembatech-auth-change", { detail: this.user ?? null }),
    );
  }
  finish() {
    if (!this.cpu || !this.gpu || !this.storage || !this.psu) return;
    if (!this.user) {
      window.location.assign("/login?returnUrl=/#cotizador");
      return;
    }
    this.evaluating = true;
    this.evaluationError = "";
    this.evaluation = undefined;
    this.evaluationService
      .evaluate(
        {
          budget: this.total,
          intended_use: this.tier === "Alta" ? "gaming" : "programacion",
          total_price: this.total,
          ram_gb: this.ramGb,
          storage_gb:
            this.storage.id === "nvme2" || this.storage.id === "hdd2"
              ? 2000
              : 1000,
          psu_watts: Number(this.psu.id),
          estimated_consumption_watts: this.cpu.power + this.gpu.power + 100,
        },
        this.authService.token(),
      )
      .subscribe({
        next: (result) => {
          this.evaluation = result;
          this.evaluating = false;
          this.finished = true;
          this.step = 7;
        },
        error: (error) => {
          this.evaluating = false;
          this.evaluationError =
            error?.status === 401
              ? "Tu sesion vencio. Ingresa nuevamente."
              : "No fue posible conectar con el evaluador. Inicia Docker Compose o el backend y vuelve a intentarlo.";
        },
      });
  }
  requestCoordination() {
    if (!this.evaluation?.quoteId) return;
    this.coordinationLoading = true;
    this.coordinationMessage = "";
    this.quoteService
      .requestCoordination(
        this.evaluation.quoteId,
        {
          contactPhone: this.contactPhone,
          serviceAddress: this.serviceAddress,
          preferredDate: this.preferredDate || undefined,
          customerNote: this.customerNote,
        },
        this.authService.token(),
      )
      .subscribe({
        next: () => {
          this.coordinationLoading = false;
          this.coordinationMessage =
            "Solicitud enviada. JembaTech revisará tu cotización antes de coordinar por WhatsApp.";
        },
        error: () => {
          this.coordinationLoading = false;
          this.coordinationMessage =
            "No fue posible enviar la solicitud. Intenta nuevamente.";
        },
      });
  }
  whatsappLink() {
    const text = encodeURIComponent(
      `Hola JembaTech, soy ${this.user?.name}. Quiero coordinar mi cotizacion ${this.evaluation?.quoteId || ""} por ${this.money(this.total)}.`,
    );
    return `https://wa.me/56973752851?text=${text}`;
  }
}
