import { Component, OnInit } from '@angular/core';
import { PalestranteService } from '@app/services/palestrante.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Palestrante } from '@app/models/Palestrante';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { environment } from '@environments/environment.development';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.scss']
})
export class PalestranteListaComponent implements OnInit {
  public Palestrantes: Palestrante[] = [];
  public eventoId = 0;
  public pagination = {} as Pagination;

  constructor(
    private palestranteService: PalestranteService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems: 1,
    } as Pagination;

    this.carregarPalestrantes();
  }

  termoBuscaChanged: Subject<string> = new Subject<string>();

  public filtrarPalestrantes(evt: any): void {
    if (this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged
        .pipe(debounceTime(1000))
        .subscribe((filtrarPor) => {
          this.spinner.show();
          this.palestranteService
            .getPalestrantes(
              this.pagination.currentPage,
              this.pagination.itemsPerPage,
              filtrarPor
            )
            .subscribe({
              next:(paginatedResult: PaginatedResult<Palestrante[]>) => {
                this.Palestrantes = paginatedResult.result;
                this.pagination = paginatedResult.pagination;
              },
              error:(error: any) => {
                this.spinner.hide();
                this.toastr.error('Erro ao Carregar os Palestrantes', 'Erro!');
              }
        })
            .add(() => this.spinner.hide());
        });
    }
    this.termoBuscaChanged.next(evt.value);
  }

  public getImagemURL(imagemName: string): string {
    if (imagemName)
      return environment.apiURL + `resourcers/perfil/${imagemName}`;
    else
      return './assets/semImagem.png';
  }

  public carregarPalestrantes(): void {
    this.spinner.show();

    this.palestranteService
      .getPalestrantes(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe({
        next:(paginatedResult: PaginatedResult<Palestrante[]>) => {
          this.Palestrantes = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        },
        error:(error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
        }
  })
      .add(() => this.spinner.hide());
  }

}
