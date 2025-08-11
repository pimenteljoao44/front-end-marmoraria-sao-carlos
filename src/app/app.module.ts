import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './modules/login/login.component';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { GruposModule } from './modules/grupos/grupos.module';
import {DialogModule} from 'primeng/dialog';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CardModule,
    InputTextModule,
    ToastModule,
    ButtonModule,
    GruposModule,
    DialogModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    MessageService,CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
