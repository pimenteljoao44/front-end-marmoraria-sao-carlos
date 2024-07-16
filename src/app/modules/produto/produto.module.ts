import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProdutoHomeComponent } from './page/produto-home/produto-home.component';
import { ProdutoFormComponent } from './components/produto-form/produto-form.component';
import { ProdutoTableComponent } from './components/produto-table/produto-table.component';
import { ProdutoViewComponent } from './components/produto-view/produto-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { PRODUTO_ROUTES } from './produto.routing';

@NgModule({
  declarations: [
    ProdutoHomeComponent,
    ProdutoFormComponent,
    ProdutoTableComponent,
    ProdutoViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(PRODUTO_ROUTES),
    SharedModule,
    HttpClientModule,
    CardModule,
    RadioButtonModule,
    ButtonModule,
    TableModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DynamicDialogModule,
    DropdownModule,
    CheckboxModule,
    ConfirmDialogModule,
    TooltipModule,
  ],
  providers: [DialogService, ConfirmationService, DatePipe],
})
export class ProdutoModule {}
