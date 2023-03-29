import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '@environments/environment.development';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {
  eventoId: number;
  form: FormGroup;
  evento = {} as Evento;
  estadoSalvar: string = 'post';
  modalRef?: BsModalRef;

  imagemURL = 'assets/semImagem.png';

  loteAtual = {id : 0, nome : '', indice : 0};

  file : File;

  constructor(
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private loteService: LoteService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router
  ) {
    this.localeService.use('pt-br');
  }

  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get f(): any {
    return this.form.controls;
  }
  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }
  get bsConfigLote(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
  }

  public carregarEvento(): void {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');

    if (this.eventoId !== null && this.eventoId !== 0) {
      this.spinner.show();
      this.estadoSalvar = 'put';

      //o + é para converter para number
      this.eventoService
        .getEventoById(this.eventoId)
        .subscribe({
          next: (evento: Evento) => {
            //este 3 pontos com chaves é para copiar os dados do objeto para outra variável e não apenas vincular como referência.
            this.evento = { ...evento };
            this.form.patchValue(this.evento);
            if (this.evento.imagemURL != ''){
              this.imagemURL = environment.apiURL + 'Resourcers/Images/' + this.evento.imagemURL;
            }

            this.evento.lotes.forEach((lote : Lote) => {
              this.lotes.push(this.criarLote(lote));
            });

          },
          error: (error: any) => {
            this.toastr.error('Erro ao carregar evento', 'Erro!');
            console.log(error);
          },
          complete: () => {},
        })
        .add(() => this.spinner.hide());
    }
  }

  public validation(): void {
    this.form = this.formBuilder.group({
      tema: ['', [Validators.required, Validators.maxLength(75)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.min(5)]],
      imagemURL: [''],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.formBuilder.array([]),
    });
  }

  public adicionarLote(): void {
    this.lotes.push(this.criarLote({ id: 0 } as Lote));
  }

  public criarLote(lote: Lote): FormGroup {
    return this.formBuilder.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    });
  }

  public resetForm() {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarEvento(): void {
    if (this.form.valid) {
      this.spinner.show();
      this.evento =
        this.estadoSalvar === 'post'
          ? { ...this.form.value }
          : { id: this.evento.id, ...this.form.value };
      this.evento.lote = 'Teste lote';

      this.eventoService[this.estadoSalvar](this.evento)
        .subscribe({
          next: (eventoRetorno: Evento) => {
            this.toastr.success('Evento salvo com sucesso!', 'Sucesso');

            this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
          },
          error: (error: any) => {
            console.log(error);

            this.toastr.error('Erro ao cadastrar evento!', 'Erro');
          },
        })
        .add(() => this.spinner.hide());
    }
  }

  public salvarLotes(): void {
    this.spinner.show();

    if (this.form.controls.lotes.status) {
      this.loteService
        .saveLote(this.eventoId, this.form.value.lotes)
        .subscribe({
          next: () => {

            this.toastr.success('Lotes salvos com sucesso!', 'Sucesso');
          },
          error: (error: any) => {

            this.toastr.error('Erro ao cadastrar lotes!', 'Erro');
            console.log(error);
          },
        })
        .add(() => this.spinner.hide());
    }
  }


  public removerLote(template : TemplateRef<any>, indice : number) : void{

    this.loteAtual.id = this.lotes.get(indice + '.id').value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class:'modal-sm'});


  }

  public confirmeDeleteLote() : void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.eventoId, this.loteAtual.id)
                .subscribe(
                  {
                    next : () =>{
                      this.toastr.success('Lote deletado com sucesso!', 'Sucesso');
                      this.lotes.removeAt(this.loteAtual.indice);

                    },
                    error : (error : any) =>{
                      this.toastr.error(`Erro ao deletar o lote ${this.loteAtual.id}!`, 'Erro');
                      console.log(error);
                    }
                  }
                ).add(()=>this.spinner.hide());
  }

  public declineDeleteLote() : void{
    this.modalRef.hide();
  }

  public retornaTituloLote(nome : string) : string {
    return nome === null || nome === '' ? 'Nome do Lote' : nome;
  }

  public onFileChange(ev : any) : void{
    const reader = new FileReader();

    reader.onload = (event : any) => this.imagemURL = event.target.result;

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  public uploadImagem() : void {
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file).subscribe(
      {
        next: () => {
          this.carregarEvento();
          this.toastr.success('Imagem atualizada com sucesso!', 'Sucesso');
        },
        error : (error : any) =>{
          this.toastr.error('Erro ao fazer upload de imagem!', 'Erro');
          console.log(error);
        }
      }
    ).add(()=> this.spinner.hide());
  }




}
