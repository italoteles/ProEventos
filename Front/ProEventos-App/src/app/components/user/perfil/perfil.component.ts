import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  public usuario = {} as UserUpdate;

  public get ehPalestrante(): boolean{
    return this.usuario.funcao === 'Palestrante';
  }

  constructor() { }

  ngOnInit() {

  }

  public setFormValue(usuario : UserUpdate): void{
    this.usuario = usuario;
  }

  get f() : any{
    return '';
  }





}
