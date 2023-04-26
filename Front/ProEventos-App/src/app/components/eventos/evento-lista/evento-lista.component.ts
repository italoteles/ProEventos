import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment.development';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Subject, debounceTime } from 'rxjs';

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

  public pagination = {} as Pagination;
  termoBuscaChanged: Subject<string> = new Subject<string>();


  modalRef?: BsModalRef;
  message?: string;

  constructor(
    private eventoService : EventoService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router

    ){}




  public filtrarEventos(evt: any): void {
    if (this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged
        .pipe(debounceTime(1000))
        .subscribe((filtrarPor) => {
          this.spinner.show();
          this.eventoService
            .getEventos(
              this.pagination.currentPage,
              this.pagination.itemsPerPage,
              filtrarPor
            )
            .subscribe(
              {
              next:   (paginatedResult: PaginatedResult<Evento[]>) => {
                this.eventos = paginatedResult.result;
                this.pagination = paginatedResult.pagination;
              },
              error : (error: any) => {
                this.spinner.hide();
                this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
              }
            }
            )
            .add(() => this.spinner.hide());
        });
    }
    this.termoBuscaChanged.next(evt.value);
  }


  public ngOnInit(): void {
    /** spinner starts on init */
    this.pagination = {currentPage : 1, itemsPerPage : 2, totalItems : 1} as Pagination;
    this.carregarEventos();

    setTimeout(() => {
      /** spinner ends after 5 seconds */

    }, 5000);



  }

  public carregarEventos() : void{
    this.spinner.show();

    this.eventoService.getEventos(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(
      {
        next: (paginatedResult: PaginatedResult<Evento[]>) => {
          this.eventos = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
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



  public openModal(event : any, template: TemplateRef<any>, eventoId: number) {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public pageChanged(event) : void{
    this.pagination.currentPage = event.page;
    this.carregarEventos();
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
