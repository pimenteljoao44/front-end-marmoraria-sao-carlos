import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { ProdutoDataTransferService } from 'src/app/shared/services/produto/produto-data-transfer.service';
import { Produto } from 'src/models/interfaces/produto/Produto';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
})
export class DashboardHomeComponent implements OnInit,OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  isLoading: boolean = false;
  sidebarVisible = false;
  public produtosList:Array<Produto> = [];
  public productsChartDatas!: ChartData;
  public productsChartOptions!: ChartOptions;

  constructor(
    private produtoService: ProdutoService,
    private messageService: MessageService,
    private produtoDTO: ProdutoDataTransferService) {}

  ngOnInit(): void {
    this.getProductsDatas();
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  getProductsDatas(): void {
    this.isLoading = true;
    this.produtoService.findAll()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.produtosList = response;
          this.produtoDTO.setProdutosDatas(this.produtosList);
          this.setProductsChartConfig();
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity:'error',
          summary:'Erro',
          detail:'Erro ao buscar produtos',
          life:2000
        })
        this.isLoading = false;
      }
    })
  }

  setProductsChartConfig():void {
    if(this.produtosList.length > 0) {
     const documentStyle = getComputedStyle(document.documentElement);
     const textColor = documentStyle.getPropertyValue('--text-color');
     const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
     const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

     this.productsChartDatas = {
       labels:this.produtosList.map((element) => element?.nome),
       datasets:[{
         label:'Quantidade',
         backgroundColor:documentStyle.getPropertyValue('--indigo-400'),
         borderColor:documentStyle.getPropertyValue('--indigo-400'),
         hoverBackgroundColor:documentStyle.getPropertyValue('--indigo-500'),
         data:this.produtosList.map((element)=> element.estoque)
       }]
     }

     this.productsChartOptions = {
       maintainAspectRatio:false,
       aspectRatio:0.8,
       plugins:{
         legend:{
           labels:{
             color:textColor
           }
         }
       },
       scales:{
         x:{
           ticks: {
             color:textColorSecondary,
             font:{
               weight:'bold'
             }
           },
           grid:{
             color:surfaceBorder
           }
         },
         y:{
           ticks:{
             color:textColorSecondary
           },
           grid:{
             color:surfaceBorder
           }
         }
       }
     }
    }
   }

  ngOnDestroy(): void {

  }
}
