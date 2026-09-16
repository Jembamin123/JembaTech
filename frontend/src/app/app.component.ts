import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EvaluationResult, EvaluationService } from './evaluation.service';

type Brand='AMD'|'Intel'; type Tier='Entrada'|'Media'|'Alta';
interface CPU{id:string;brand:Brand;tier:Tier;name:string;socket:string;ram:'DDR4'|'DDR5';igpu:boolean;power:number;price:number;recommended?:boolean}
interface GPU{id:string;name:string;vram:string;power:number;price:number;tier:Tier;integrated?:boolean}
interface Board{id:string;name:string;socket:string;form:'ATX'|'mATX';ram:'DDR4'|'DDR5';wifi:boolean;maxRam:number;m2:number;price:number}
interface Choice{id:string;name:string;detail:string;price:number;recommended?:boolean}
interface CaseChoice extends Choice{forms:('ATX'|'mATX')[];gpuClearance:number;fans:number}

@Component({selector:'app-root',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./app.component.html',styleUrl:'./app.component.scss'})
export class AppComponent{
  private readonly evaluationService = inject(EvaluationService);
  step=1;brand:Brand='AMD';tier:Tier='Media';cpu?:CPU;gpu?:GPU;board?:Board;wantWifi=true;ramGb=16;storage?:Choice;extraHdd=false;caseChoice?:CaseChoice;psu?:Choice;cooling?:Choice;fanCount=2;finished=false; evaluation?:EvaluationResult; evaluationError='' ; evaluating=false;
  cpus:CPU[]=[
    {id:'5600g',brand:'AMD',tier:'Entrada',name:'Ryzen 5 5600G',socket:'AM4',ram:'DDR4',igpu:true,power:65,price:129990},
    {id:'5600',brand:'AMD',tier:'Entrada',name:'Ryzen 5 5600',socket:'AM4',ram:'DDR4',igpu:false,power:65,price:119990},
    {id:'7600',brand:'AMD',tier:'Media',name:'Ryzen 5 7600',socket:'AM5',ram:'DDR5',igpu:true,power:65,price:209990,recommended:true},
    {id:'7800x3d',brand:'AMD',tier:'Alta',name:'Ryzen 7 7800X3D',socket:'AM5',ram:'DDR5',igpu:true,power:120,price:399990},
    {id:'i3',brand:'Intel',tier:'Entrada',name:'Core i3-14100',socket:'LGA1700',ram:'DDR4',igpu:true,power:60,price:139990},
    {id:'i5',brand:'Intel',tier:'Media',name:'Core i5-14400',socket:'LGA1700',ram:'DDR5',igpu:true,power:148,price:249990,recommended:true},
    {id:'i5f',brand:'Intel',tier:'Media',name:'Core i5-14400F',socket:'LGA1700',ram:'DDR5',igpu:false,power:148,price:219990},
    {id:'i7',brand:'Intel',tier:'Alta',name:'Core i7-14700K',socket:'LGA1700',ram:'DDR5',igpu:true,power:253,price:459990}
  ];
  gpus:GPU[]=[{id:'none',name:'Sin tarjeta dedicada',vram:'Usa los gráficos del procesador',power:0,price:0,tier:'Entrada',integrated:true},{id:'rx7600',name:'Radeon RX 7600',vram:'8 GB · 1080p',power:165,price:329990,tier:'Media'},{id:'rtx4060',name:'GeForce RTX 4060',vram:'8 GB · 1080p / DLSS',power:115,price:369990,tier:'Media'},{id:'rx7800',name:'Radeon RX 7800 XT',vram:'16 GB · 1440p',power:263,price:599990,tier:'Alta'},{id:'rtx4070',name:'GeForce RTX 4070 Super',vram:'12 GB · 1440p / Ray Tracing',power:220,price:649990,tier:'Alta'}];
  boards:Board[]=[{id:'b550m',name:'MSI B550M PRO-VDH WiFi',socket:'AM4',form:'mATX',ram:'DDR4',wifi:true,maxRam:128,m2:2,price:109990},{id:'b550',name:'ASUS TUF B550-PLUS',socket:'AM4',form:'ATX',ram:'DDR4',wifi:false,maxRam:128,m2:2,price:139990},{id:'b650m',name:'Gigabyte B650M DS3H',socket:'AM5',form:'mATX',ram:'DDR5',wifi:false,maxRam:192,m2:2,price:139990},{id:'b650',name:'MSI B650 Gaming Plus WiFi',socket:'AM5',form:'ATX',ram:'DDR5',wifi:true,maxRam:192,m2:2,price:179990},{id:'b760m',name:'MSI PRO B760M-A WiFi',socket:'LGA1700',form:'mATX',ram:'DDR5',wifi:true,maxRam:192,m2:2,price:169990},{id:'z790',name:'Gigabyte Z790 Eagle AX',socket:'LGA1700',form:'ATX',ram:'DDR5',wifi:true,maxRam:192,m2:3,price:239990},{id:'b660d4',name:'ASUS Prime B660M-A D4',socket:'LGA1700',form:'mATX',ram:'DDR4',wifi:false,maxRam:128,m2:2,price:129990}];
  storages:Choice[]=[{id:'nvme1',name:'SSD NVMe 1 TB',detail:'La opción recomendada · máxima velocidad',price:69990,recommended:true},{id:'nvme2',name:'SSD NVMe 2 TB',detail:'Rápido y con mayor capacidad',price:119990},{id:'sata1',name:'SSD SATA 1 TB',detail:'Buena velocidad para equipos económicos',price:59990},{id:'hdd2',name:'HDD 2 TB',detail:'Más capacidad, pero mucho más lento',price:49990}];
  cases:CaseChoice[]=[{id:'ch370',name:'DeepCool CH370',detail:'Compacto · frontal ventilado',price:59990,forms:['mATX'],gpuClearance:320,fans:1,recommended:true},{id:'cc560',name:'DeepCool CC560 ARGB',detail:'4 ventiladores incluidos · excelente flujo',price:69990,forms:['ATX','mATX'],gpuClearance:370,fans:4,recommended:true},{id:'h5',name:'NZXT H5 Flow',detail:'ATX premium · diseño limpio',price:109990,forms:['ATX','mATX'],gpuClearance:365,fans:2}];
  psus:Choice[]=[{id:'550',name:'550 W 80+ Bronze',detail:'Para gráficos integrados o GPU básica',price:49990},{id:'650',name:'650 W 80+ Bronze',detail:'Gama media con margen seguro',price:69990},{id:'750',name:'750 W 80+ Gold',detail:'GPU potente y futuros upgrades',price:99990},{id:'850',name:'850 W 80+ Gold',detail:'Equipos de gama alta',price:129990}];
  coolers:Choice[]=[{id:'stock',name:'Cooler incluido',detail:'Suficiente para procesadores eficientes',price:0},{id:'tower',name:'Cooler torre DeepCool AK400',detail:'Menor temperatura y ruido',price:39990,recommended:true},{id:'aio',name:'Refrigeración líquida 240 mm',detail:'Para CPU de alto consumo y estética',price:89990}];
  get filteredCpus(){return this.cpus.filter(c=>c.brand===this.brand&&c.tier===this.tier)}
  get filteredBoards(){return this.boards.filter(b=>b.socket===this.cpu?.socket&&b.ram===this.cpu?.ram&&(!this.wantWifi||b.wifi))}
  get filteredCases(){return this.cases.filter(c=>this.board&&c.forms.includes(this.board.form))}
  get ramOptions(){return[8,16,32,64].filter(v=>v<=(this.board?.maxRam||64))}
  get recommendedWatts(){return Math.ceil(((this.cpu?.power||0)+(this.gpu?.power||0)+100)*1.35/50)*50}
  get total(){const ramPrice={8:24990,16:49990,32:89990,64:169990}[this.ramGb as 8|16|32|64]||0;return(this.cpu?.price||0)+(this.gpu?.price||0)+(this.board?.price||0)+ramPrice+(this.storage?.price||0)+(this.extraHdd?49990:0)+(this.caseChoice?.price||0)+(this.psu?.price||0)+(this.cooling?.price||0)+this.fanCount*6990}
  get compatible(){return!!(this.cpu&&this.gpu&&this.board&&this.storage&&this.caseChoice&&this.psu&&this.cooling&&this.board.socket===this.cpu.socket&&this.board.ram===this.cpu.ram&&this.caseChoice.forms.includes(this.board.form)&&Number(this.psu.id)>=this.recommendedWatts)}
  money(n:number){return new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(n)}
  selectCpu(c:CPU){this.cpu=c;this.gpu=undefined;this.board=undefined;this.caseChoice=undefined;this.psu=undefined;this.finished=false}
  selectGpu(g:GPU){if(!g.integrated||this.cpu?.igpu){this.gpu=g;this.caseChoice=undefined;this.psu=undefined;this.finished=false}}
  selectBoard(b:Board){this.board=b;this.caseChoice=undefined;this.finished=false}
  next(){this.step=Math.min(7,this.step+1);window.setTimeout(()=>document.getElementById('builder-card')?.scrollIntoView({behavior:'smooth',block:'start'}),10)}
  back(){this.finished=false;this.step=Math.max(1,this.step-1)}
  go(n:number){if(n<this.step){this.finished=false;this.step=n}}
  psuEnough(p:Choice){return Number(p.id)>=this.recommendedWatts}
  finish(){
    if(!this.cpu||!this.gpu||!this.storage||!this.psu)return;
    this.evaluating=true; this.evaluationError=''; this.evaluation=undefined;
    this.evaluationService.evaluate({budget:this.total,intended_use:this.tier==='Alta'?'gaming':'programacion',total_price:this.total,ram_gb:this.ramGb,storage_gb:this.storage.id==='nvme2'||this.storage.id==='hdd2'?2000:1000,psu_watts:Number(this.psu.id),estimated_consumption_watts:this.cpu.power+this.gpu.power+100}).subscribe({next:result=>{this.evaluation=result;this.evaluating=false;this.finished=true;this.step=7;},error:()=>{this.evaluating=false;this.evaluationError='No fue posible conectar con el evaluador. Inicia Docker Compose o el backend y vuelve a intentarlo.';}})
  }
}
