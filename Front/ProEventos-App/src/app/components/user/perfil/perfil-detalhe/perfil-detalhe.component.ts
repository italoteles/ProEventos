import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.scss']
})
export class PerfilDetalheComponent implements OnInit {

  @Output() changeFormValue = new EventEmitter();

  form: FormGroup;
  userUpdate = {} as UserUpdate;


  constructor(private formBuilder : FormBuilder,
    public accountService: AccountService,
    public palestranteService: PalestranteService,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.validation();
    this.carregarUsuario();
    this.verificaForm();
  }

  private verificaForm() : void{
    this.form.valueChanges
      .subscribe( () => this.changeFormValue.emit({...this.form.value}))
  }

  get f() : any{
    return this.form.controls;
  }

  public validation(): void {

    const formOptions : AbstractControlOptions = {
      validators : ValidatorField.MustMatch('password', 'confirmarPassword')
    };


    this.form = this.formBuilder.group({
      userName : [''],
      imagemURL: [''],
      titulo: ["NaoInformado", Validators.required],
      primeiroNome: ["", Validators.required],
      ultimoNome: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: ["", Validators.required],
      funcao: ["NaoInformado", Validators.required],
      descricao: ["", Validators.required],
      password: ["", [Validators.minLength(4), Validators.nullValidator]],
      confirmarPassword: ["", Validators.nullValidator]

    },formOptions);
  }
  private carregarUsuario(): void {
    this.spinner.show();
    this.accountService
      .getUser()
      .subscribe({


       next : (userRetorno: UserUpdate) => {
          console.log(userRetorno);
          this.userUpdate = userRetorno;
          this.userUpdate.password = "";
          this.form.patchValue(this.userUpdate);
          this.toaster.success('Usuário Carregado', 'Sucesso');
        },
        error : (error) => {
          console.error(error);
          this.toaster.error('Usuário não Carregado', 'Erro');
          this.router.navigate(['/dashboard']);
        }
      }
      )

      .add(() => this.spinner.hide());
  }



  public resetForm(evento : any){
    evento.preventDefault();
    this.form.reset();
  }

  onSubmit(): void {
    this.atualizarUsuario();
  }

  public atualizarUsuario() {
    this.userUpdate = { ...this.form.value };
    this.spinner.show();

    if (this.f.funcao.value == 'Palestrante') {
      this.palestranteService.post().subscribe({
        next: () => this.toaster.success('Função palestrante Ativada!', 'Sucesso!'),
        error: (error) => {
          this.toaster.error('A função palestrante não pode ser Ativada', 'Error');
          console.error(error);
        }
    })
    }

    this.accountService
      .updateUser(this.userUpdate)
      .subscribe(
        {
        next : () => this.toaster.success('Usuário atualizado!', 'Sucesso'),
        error : (error) => {
          this.toaster.error(error.error);
          console.error(error);
        }
      }
      )
      .add(() => this.spinner.hide());
  }

}
