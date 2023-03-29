import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment.development';

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
  public eventoId : number = 0;
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
    this.carregarEventos();

    setTimeout(() => {
      /** spinner ends after 5 seconds */

    }, 5000);
  }

  public carregarEventos() : void{
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

  public mostraImagem(imagemURL : string) : string {
    return (imagemURL != '') ? `${environment.apiURL}resourcers/images/${imagemURL}` : 'assets/semImagem.png';
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

  openModal(event : any, template: TemplateRef<any>, eventoId: number) {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe(
      {
      next : (result : any) => {
        if (result.message === 'Deletado')
        {
          this.toastr.success('Evento deletado com sucesso.', 'Deletado!');

          this.carregarEventos();
        }
      },
      error : (error : any) =>{
        console.error(error);
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}!`, 'Erro!');

      }
      }
    ).add(() => this.spinner.hide());

  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  detalheEvento(id : number) : void{
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
