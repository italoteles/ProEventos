
import { Component, OnInit,TemplateRef } from '@angular/core';
import { Evento } from '../models/Evento';
import { EventoService } from '../services/evento.service';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public eventos : Evento[] = [];
  public eventosFiltrados : Evento[] = [];
  public margemImagem : number = 0;
  public larguraImagem : number = 75;
  public exibirImagem : boolean = true;
  private filtroListado : string = '';
  modalRef?: BsModalRef;
  message?: string;

  constructor(
    private eventoService : EventoService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService){}


  public get filtroLista(){
    return this.filtroListado;
  }

  public set filtroLista(valor : string ){
    this.filtroListado = valor;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;

  }


  public ngOnInit(): void {
    /** spinner starts on init */
    this.getEventos();
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
  }

  public getEventos() : void{
    this.eventoService.getEventos().subscribe(
      {
        next: (eventos : Evento[]) => {
          this.eventos = eventos;
          this.eventosFiltrados = this.eventos;
        },
        error: (error : any) => console.log(error)

      });
  }

  public alterarExibicaoImagem() : void{
    this.exibirImagem = !this.exibirImagem;
  }

  public filtrarEventos(filtrarPor : string) : Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento : any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef?.hide();
    this.toastr.success('Evento deletado com sucesso.', 'Deletado!');
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

}
