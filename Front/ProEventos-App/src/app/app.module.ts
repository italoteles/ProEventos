import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import {FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { PalestrantesComponent } from './components/palestrantes/palestrantes.component';
import { NavComponent } from './shared/nav/nav.component';
import { TituloComponent } from './shared/titulo/titulo.component';
import { ContatosComponent } from './components/contatos/contatos.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';



import { NgxCurrencyModule } from "ngx-currency";
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";



import { DateTimeFormatPipe } from './helpers/DateTimeFormat.pipe';
import { faAddressCard, faCalendarDays, faChartBar, faChartColumn, faCirclePlus, faEye, faEyeSlash, faHouse, faPenToSquare, faPlus, faShareSquare, faTrash, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { EventoListaComponent } from './components/eventos/evento-lista/evento-lista.component';
import { EventoDetalheComponent } from './components/eventos/evento-detalhe/evento-detalhe.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { HomeComponent } from './components/home/home.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PerfilDetalheComponent } from './components/user/perfil/perfil-detalhe/perfil-detalhe.component';


defineLocale('pt-br', ptBrLocale);

@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    PalestrantesComponent,
    NavComponent,
    DateTimeFormatPipe,
    TituloComponent,
    ContatosComponent,
    PerfilComponent,
    PerfilDetalheComponent,
    DashboardComponent,
    EventoListaComponent,
    EventoDetalheComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule,
    NgxCurrencyModule,

    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),

    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar:true
    }),
    NgxSpinnerModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule.forRoot()


  ],
  providers: [
    {provide : HTTP_INTERCEPTORS, useClass : JwtInterceptor, multi : true}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faTrash);
    library.addIcons(faPenToSquare);
    library.addIcons(faEye);
    library.addIcons(faEyeSlash);
    library.addIcons(faCalendarDays);
    library.addIcons(faUser);
    library.addIcons(faUsers);
    library.addIcons(faCirclePlus);
    library.addIcons(faHouse);
    library.addIcons(faAddressCard);
    library.addIcons(faChartBar);
    library.addIcons(faShareSquare);
  }

}
