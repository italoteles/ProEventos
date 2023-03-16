import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder : FormBuilder) {}

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
}
