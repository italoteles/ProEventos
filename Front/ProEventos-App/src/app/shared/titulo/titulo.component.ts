import { Component, Input } from '@angular/core';

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

}
