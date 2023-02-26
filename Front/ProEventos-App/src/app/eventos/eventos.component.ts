import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public eventos : any = [];
  public eventosFiltrados : any = [];
  margemImagem : number = 0;
  larguraImagem : number = 75;
  exibirImagem : boolean = true;
  private _filtroLista : string = '';

  public get filtroLista(){
    return this._filtroLista;
  }

  public set filtroLista(valor : string ){
    this._filtroLista = valor;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;

  }

  constructor(private http : HttpClient){}

  ngOnInit(): void {
    this.getEventos();
  }

  public getEventos() : void{
    this.http.get('https://localhost:7157/api/eventos').subscribe(
      response => {
        this.eventos = response;
        this.eventosFiltrados = this.eventos;

      },
      error => console.log(error)
    );


  }

  public alterarExibicaoImagem(){
    this.exibirImagem = !this.exibirImagem;
  }

  public filtrarEventos(filtrarPor : string) : any{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento : any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

}
