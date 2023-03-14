import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  form: FormGroup;

  get f() : any{
    return this.form.controls;
  }

  constructor(private formBuilder : FormBuilder) { }

  ngOnInit() {
    this.validation();
  }

  public validation(): void {

    const formOptions : AbstractControlOptions = {
      validators : ValidatorField.MustMatch('senha', 'confirmarSenha')
    };

    this.form = this.formBuilder.group({

      titulo: ["", Validators.required],
      primeiroNome: ["", Validators.required],
      ultimoNome: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      telefone: ["", Validators.required],
      funcao: ["", Validators.required],
      descricao: ["", Validators.required],
      senha: ["", Validators.required],
      confirmarSenha: ["", Validators.required],

    },formOptions);
  }
  public resetForm(evento : any){
    evento.preventDefault();
    this.form.reset();
  }

  public onSubmit() : void{

    //vai parar aqui se form estiver inválido
    if (this.form.invalid){
      return;
    }
  }
}
