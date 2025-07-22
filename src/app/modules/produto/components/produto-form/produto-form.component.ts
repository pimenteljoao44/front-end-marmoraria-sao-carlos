import { Endereco } from './../../../../../models/interfaces/endereco/Endereco';
import { Fornecedor } from './../../../../../models/interfaces/fornecedor/Fornecedor';
import { Grupo } from './../../../../../models/interfaces/grupo/Grupo';
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { GruposService } from 'src/app/services/grupos/grupos.service';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { GruposDataTransferService } from 'src/app/shared/services/grupos/grupos-data-transfer.service';
import { ProdutoDataTransferService } from 'src/app/shared/services/produto/produto-data-transfer.service';
import { ProdutoEvent } from 'src/models/enums/produto/ProdutoEvent';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Produto } from 'src/models/interfaces/produto/Produto';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.scss']
})
export class ProdutoFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public produtoAction!: {
    event: EventAction;
    produtoList: Array<Produto>;
  };

  public produtosSelectedDatas!: Produto;
  public produtosDatas: Array<Produto> = [];
  public grupos: Array<Grupo> = [];
  public grupoSelecionado!: Grupo;
  public fornecedorSelecionado!: Fornecedor;
  public ativo: boolean = true;
  public validouEstoquePreco: boolean = false;

  public addProductForm = this.formBuilder.group({
    nome: ['', Validators.required],
    preco: [0, Validators.required],
    ativo: [this.ativo, Validators.required],
    estoque: [0, Validators.required],
    grupo: this.formBuilder.group({
      id: [null, Validators.required],
      nome: ['', Validators.required],
      ativo: [false, Validators.required],
      grupoPai: [0],
    }),
  });

  public editProductform = this.formBuilder.group({
    nome: ['', Validators.required],
    preco: [0, Validators.required],
    ativo: [this.ativo, Validators.required],
    estoque: [0, Validators.required],
    quantidade: [0],
    grupo: this.formBuilder.group({
      id: [null, Validators.required],
      nome: ['', Validators.required],
      ativo: [false, Validators.required],
      grupoPai: [0],
    }),
  });

  public addProdutoAction = ProdutoEvent.CREATE_PRODUCT_EVENT;
  public editProductAction = ProdutoEvent.EDIT_PRODUCT_EVENT;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private produtoService: ProdutoService,
    private grupoService: GruposService,
    private ref: DynamicDialogConfig,
    private produtoDTO: ProdutoDataTransferService,
    private grupoDTO: GruposDataTransferService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.produtoAction = this.ref.data;
    if (
      this.produtoAction?.event.action === this.editProductAction &&
      this.produtoAction?.produtoList
    ) {
      const prodId = this.produtoAction.event.id as number;
      this.getProductSelectedDatas(prodId as number);
    }
    this.getAllGroups();
  }

  getAllGroups(): void {
    this.grupoService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.grupos = response;
            this.grupoDTO.setGruposDatas(this.grupos);
          }
        },
      });
  }

  getDate(): string {
    return this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm') || '';
  }

  onGroupChange(grupo: number): void {
    this.grupoService
      .findById(grupo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.grupoSelecionado = response;
            this.setGrupoNosFormularios(this.grupoSelecionado as Grupo);
          }
        },
        error(err) {
          console.log(err);
        },
      });
  }

  setGrupoNosFormularios(grupoSelecionado: Grupo): void {
    if (this.produtoAction.event.action === this.addProdutoAction && grupoSelecionado) {
      this.addProductForm.get('grupo')?.patchValue({
        id: grupoSelecionado.id,
        nome: grupoSelecionado.nome,
        ativo: grupoSelecionado.ativo,
        grupoPai: grupoSelecionado.grupoPaiId,
      });
      console.log(this.addProductForm.get('grupo')?.value);
    }
    if (this.produtoAction.event.action === this.editProductAction && grupoSelecionado) {
      this.editProductform.get('grupo')?.patchValue({
        id: grupoSelecionado.id,
        nome: grupoSelecionado.nome,
        ativo: grupoSelecionado.ativo,
        grupoPai: grupoSelecionado.grupoPaiId,
      });
    }
  }


  handleSubmitAddProduct() {
    const invalidControls: string[] = [];
    const additionalErrors: string[] = [];

    Object.keys(this.addProductForm.controls).forEach((controlName) => {
      const control = this.addProductForm.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    const preco = this.addProductForm.get('preco')?.value;
    const estoque = this.addProductForm.get('estoque')?.value;
    if (preco !== null && preco !== undefined && preco < 0) {
      additionalErrors.push('preço deve ser maior ou igual a zero');
    }

    if (estoque !== null && estoque !== undefined && estoque < 0) {
      additionalErrors.push('estoque deve ser maior ou igual a zero');
    }

    if (invalidControls.length > 0 || additionalErrors.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(', ')} estão inválidos`;
      const additionalErrorsMessage = additionalErrors.length > 0 ? ` e o ${additionalErrors.join(' e ')}` : '';

      const fullMessage = `${invalidFieldsMessage}${additionalErrorsMessage}.`;

      this.markFormGroupTouched(this.addProductForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: fullMessage,
        life: 3000,
      });
      return;
    }
    this.produtoService
      .create(this.addProductForm.value as Produto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `O produto ${response.nome} foi criado com sucesso!`,
              life: 2000,
            });
            this.addProductForm.reset();
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar produto',
            life: 2000,
          });
          console.log(err);
        },
      });
  }

  handleSubmitEditProduct() {
    const invalidControls: string[] = [];
    Object.keys(this.editProductform.controls).forEach((controlName) => {
      const control = this.editProductform.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    if (invalidControls.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(', ')} estão inválidos.`;

      this.markFormGroupTouched(this.editProductform);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }

    if (!this.grupoSelecionado || !this.grupoSelecionado.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Grupo não selecionado ou inválido',
        life: 3000,
      });
      console.log('Grupo não selecionado ou inválido:', this.grupoSelecionado);
      return;
    }

    const requestEditProduct: Produto = {
      id: this.produtoAction.event.id as number,
      nome: this.editProductform.value.nome as string,
      preco: this.editProductform.value.preco as number,
      ativo: this.editProductform.value.ativo as boolean,
      estoque: this.editProductform.value.estoque as number,
      quantidade: this.editProductform.value.quantidade as number,
      grupo: {
        id: this.grupoSelecionado.id,
        nome: this.grupoSelecionado.nome,
        ativo: this.grupoSelecionado.ativo,
        grupoPaiId: this.grupoSelecionado.grupoPaiId,
      },
    };
    this.produtoService.update(requestEditProduct as Produto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.editProductform.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `O produto ${response.nome} foi editado com sucesso!`,
              life: 2000,
            });
          }
        },
        error: (err) => {
          console.log('Erro na requisição:', err);
          this.editProductform.reset();
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao editar produto',
            life: 2000,
          });
        }
      });
  }


  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  getProductSelectedDatas(productId: number): void {
    const allProducts = this.produtoAction.produtoList;
    if (allProducts.length > 0) {
      const productFiltered = allProducts.find(
        (element) => element?.id === productId
      );
      if (productFiltered) {
        this.produtosSelectedDatas = productFiltered;
        this.fornecedorSelecionado = productFiltered.fornecedor as Fornecedor;

        this.editProductform.patchValue({
          nome: productFiltered.nome,
          preco: productFiltered.preco,
          ativo: productFiltered.ativo,
          estoque: productFiltered.estoque,
          grupo: {
            id: productFiltered.grupo?.id || null,
            nome: productFiltered.grupo?.nome || '',
            ativo: productFiltered.grupo?.ativo || false,
            grupoPai: productFiltered.grupo?.grupoPaiId || 0,
          },
        });
        this.grupoSelecionado = productFiltered.grupo as Grupo;
      }
    }
  }

  getproductsDatas(): void {
    this.produtoService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.produtosDatas = response;
            this.produtosDatas &&
              this.produtoDTO.setProdutosDatas(this.produtosDatas);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
