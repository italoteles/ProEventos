import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {

  form: FormGroup;
  evento = {} as Evento;
  estadoSalvar : string = 'post';


  constructor(private formBuilder : FormBuilder,
              private localeService: BsLocaleService,
              private router : ActivatedRoute,
              private eventoService : EventoService,
              private spinner : NgxSpinnerService,
              private toastr : ToastrService
              )
  {
    this.localeService.use('pt-br');
  }

  get f() : any{
    return this.form.controls;
  }
  get bsConfig() : any{
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass : 'theme-default',
      showWeekNumbers : false
    }
  };


  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
  }

  public carregarEvento() : void{
    const eventoIdparam = this.router.snapshot.paramMap.get('id');

    if (eventoIdparam !== null){
      this.spinner.show();
      this.estadoSalvar = 'put';

      //o + é para converter para number
      this.eventoService.getEventoById(+eventoIdparam).subscribe(
        {
        next : (evento : Evento) => {
          //este 3 pontos com chaves é para copiar os dados do objeto para outra variável e não apenas vincular como referência.
          this.evento = {...evento};
          this.form.patchValue(this.evento);
        },
        error: (error:any) => {
          this.toastr.error('Erro ao carregar evento', 'Erro!');
          console.error(error);
        },
        complete : () => {
        }
      }).add(()=>this.spinner.hide());


    }
  }

  public validation(): void {
    this.form = this.formBuilder.group({
      tema: ["", [Validators.required, Validators.maxLength(75)]],
      local: ["", Validators.required],
      dataEvento: ["", Validators.required],
      qtdPessoas: ["", [Validators.required, Validators.min(5)]],
      imagemURL: ["", Validators.required],
      telefone: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]]
    });
  }

  public resetForm(){
    this.form.reset();
  }

  public cssValidator(campoForm : FormControl) : any{
    return {'is-invalid' : campoForm.errors && campoForm.touched}
  }

  public salvarAlteracao() : void{
    this.spinner.show();
    if (this.form.valid){
      this.evento = (this.estadoSalvar === 'post')
                    ? {...this.form.value}
                    : {id : this.evento.id, ...this.form.value}
      this.evento.lote = "Teste lote";

      this.eventoService[this.estadoSalvar](this.evento).subscribe(
          {
            next : () => {
              this.toastr.success('Evento salvo com sucesso!', 'Sucesso')
            },
            error  : (error : any) => {
              console.error(error);

              this.toastr.error('Erro ao cadastrar evento!', 'Erro')

            }

          }
        ).add(() => this.spinner.hide());
    }

  }

}

