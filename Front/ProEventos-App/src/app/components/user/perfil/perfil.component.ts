import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { environment } from '@environments/environment.development';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  public usuario = {} as UserUpdate;
  public imagemURL = '';
  public file: File;

  public get ehPalestrante(): boolean {
    return this.usuario.funcao === 'Palestrante';
  }

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private accountService: AccountService
  ) {}

  ngOnInit() {}

  public setFormValue(usuario: UserUpdate): void {
    this.usuario = usuario;
    if (this.usuario.imagemURL){
      this.imagemURL = environment.apiURL + `resourcers/perfil/${this.usuario.imagemURL}`;
    }
    else {
      this.imagemURL = './assets/semImagem.png';
    }
  }

  public onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => (this.imagemURL = event.target.result);

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  private uploadImagem(): void {
    this.spinner.show();
    this.accountService
      .postUpload(this.file)
      .subscribe({
        next: () =>
          this.toastr.success('Imagem atualizada com Sucesso', 'Sucesso!'),
        error: (error: any) => {
          this.toastr.error('Erro ao fazer upload de imagem', 'Erro!');
          console.error(error);
        },
      })
      .add(() => this.spinner.hide());
  }
}
