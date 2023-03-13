import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent {
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
    private toastr: ToastrService,
    private router: Router

    ){}


  public get filtroLista(){
    return this.filtroListado;
  }

  public set filtroLista(valor : string ){
    this.filtroListado = valor;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;

  }


  public ngOnInit(): void {
    /** spinner starts on init */
    this.spinner.show();
    this.getEventos();

    setTimeout(() => {
      /** spinner ends after 5 seconds */

    }, 5000);
  }

  public getEventos() : void{
    this.eventoService.getEventos().subscribe(
      {
        next: (eventos : Evento[]) => {
          this.eventos = eventos;
          this.eventosFiltrados = this.eventos;
        },
        error: (error : any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao carregar os eventos!', 'Erro!');

        },
        complete: () => this.spinner.hide()

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

  detalheEvento(id : number) : void{
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
