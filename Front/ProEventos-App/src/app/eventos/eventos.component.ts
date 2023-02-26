import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public eventos : any = [];
  margemImagem : number = 0;
  larguraImagem : number = 75;
  exibirImagem : boolean = true;

  constructor(private http : HttpClient){}

  ngOnInit(): void {
    this.getEventos();
  }

  public getEventos() : void{
    this.http.get('https://localhost:7157/api/eventos').subscribe(
      response => this.eventos = response,
      error => console.log(error)
    );


  }

  public alterarExibicaoImagem(){
    this.exibirImagem = !this.exibirImagem;
  }

}
