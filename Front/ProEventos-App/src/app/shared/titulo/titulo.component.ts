import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.scss']
})
export class TituloComponent {
  @Input() titulo : string;
  @Input() subtitulo : string = "Desde 2023";
  @Input() iconClass : string = "user";
  @Input() botaoListar : boolean = false;

  constructor(private router : Router){}

  listar() : void{
    this.router.navigate([`/${this.titulo.toLocaleLowerCase()}/lista`]);
  }

}
