"use strict";(self.webpackChunkmarmoraria_sao_carlos=self.webpackChunkmarmoraria_sao_carlos||[]).push([[574],{8574:(rt,T,n)=>{n.r(T),n.d(T,{ProdutoModule:()=>W});var l=n(6814),d=n(6223),f=n(1365),U=n(6208),w=n(9862),A=n(4532),D=n(1865),g=n(707),h=n(909),I=n(9663),q=n(5609),x=n(3714),O=n(6218),F=n(9653),c=n(1356),Z=n(3866),_=n(3904),E=n(3259),v=n(5219),b=n(8057),C=n(8645),a=n(9773),p=function(i){return i.CREATE_PRODUCT_EVENT="Criar produto",i.EDIT_PRODUCT_EVENT="Editar produto",i.VIEW_PRODUCT_EVENT="Visualizar produto",i}(p||{}),t=n(4946),y=n(5207),M=n(6884),S=n(6444),N=n(5411);function J(i,m){if(1&i){const o=t.EpF();t.TgZ(0,"div")(1,"form",1),t.NdJ("ngSubmit",function(){t.CHM(o);const r=t.oxw();return t.KtG(r.handleSubmitAddProduct())}),t.TgZ(2,"div",2),t._uU(3," Nome: "),t._UZ(4,"input",3),t.TgZ(5,"div",4)(6,"p-dropdown",5),t.NdJ("onChange",function(r){t.CHM(o);const s=t.oxw();return t.KtG(s.onGroupChange(r.value))}),t.qZA()(),t._uU(7," Pre\xe7o: "),t._UZ(8,"input",6),t._uU(9," Estoque: "),t._UZ(10,"input",7),t._uU(11," Ativo: "),t._UZ(12,"p-checkbox",8),t.TgZ(13,"div",9),t._UZ(14,"p-button",10),t.qZA()()()()}if(2&i){const o=t.oxw();t.xp6(1),t.Q6J("formGroup",o.addProductForm),t.xp6(5),t.Q6J("options",o.grupos),t.xp6(6),t.Q6J("binary",!0)}}function R(i,m){if(1&i){const o=t.EpF();t.TgZ(0,"div")(1,"form",1),t.NdJ("ngSubmit",function(){t.CHM(o);const r=t.oxw();return t.KtG(r.handleSubmitEditProduct())}),t.TgZ(2,"div",2),t._uU(3," Nome: "),t._UZ(4,"input",3),t.TgZ(5,"div",4)(6,"p-dropdown",5),t.NdJ("onChange",function(r){t.CHM(o);const s=t.oxw();return t.KtG(s.onGroupChange(r.value))}),t.qZA()(),t._uU(7," Pre\xe7o: "),t._UZ(8,"input",6),t._uU(9," Estoque: "),t._UZ(10,"input",7),t._uU(11," Ativo: "),t._UZ(12,"p-checkbox",8),t.TgZ(13,"div",9),t._UZ(14,"p-button",10),t.qZA()()()()}if(2&i){const o=t.oxw();t.xp6(1),t.Q6J("formGroup",o.editProductform),t.xp6(5),t.Q6J("options",o.grupos),t.xp6(6),t.Q6J("binary",!0)}}let G=(()=>{class i{constructor(o,e,r,s,u,P,tt,ot,et){this.formBuilder=o,this.messageService=e,this.router=r,this.produtoService=s,this.grupoService=u,this.ref=P,this.produtoDTO=tt,this.grupoDTO=ot,this.datePipe=et,this.destroy$=new C.x,this.produtosDatas=[],this.grupos=[],this.ativo=!0,this.addProductForm=this.formBuilder.group({nome:["",d.kI.required],preco:[0,d.kI.required],ativo:[this.ativo,d.kI.required],estoque:[0,d.kI.required],grupo:this.formBuilder.group({id:[null,d.kI.required],nome:["",d.kI.required],ativo:[!1,d.kI.required],grupoPai:[0]})}),this.editProductform=this.formBuilder.group({nome:["",d.kI.required],preco:[0,d.kI.required],ativo:[this.ativo,d.kI.required],estoque:[0,d.kI.required],quantidade:[0],grupo:this.formBuilder.group({id:[null,d.kI.required],nome:["",d.kI.required],ativo:[!1,d.kI.required],grupoPai:[0]})}),this.addProdutoAction=p.CREATE_PRODUCT_EVENT,this.editProductAction=p.EDIT_PRODUCT_EVENT}ngOnInit(){this.produtoAction=this.ref.data,this.produtoAction?.event.action===this.editProductAction&&this.produtoAction?.produtoList&&this.getProductSelectedDatas(this.produtoAction.event.id),this.getAllGroups()}getAllGroups(){this.grupoService.findAll().pipe((0,a.R)(this.destroy$)).subscribe({next:o=>{o.length>0&&(this.grupos=o,this.grupoDTO.setGruposDatas(this.grupos))}})}getDate(){return this.datePipe.transform(new Date,"dd/MM/yyyy HH:mm")||""}onGroupChange(o){this.grupoService.findById(o).pipe((0,a.R)(this.destroy$)).subscribe({next:e=>{e&&(this.grupoSelecionado=e,this.setGrupoNosFormularios(this.grupoSelecionado))},error(e){console.log(e)}})}setGrupoNosFormularios(o){this.produtoAction.event.action===this.addProdutoAction&&o&&(this.addProductForm.get("grupo")?.patchValue({id:o.id,nome:o.nome,ativo:o.ativo,grupoPai:o.grupoPaiId}),console.log(this.addProductForm.get("grupo")?.value)),this.produtoAction.event.action===this.editProductAction&&o&&this.editProductform.get("grupo")?.patchValue({id:o.id,nome:o.nome,ativo:o.ativo,grupoPai:o.grupoPaiId})}handleSubmitAddProduct(){const o=[];if(Object.keys(this.addProductForm.controls).forEach(e=>{const r=this.addProductForm.get(e);r&&r.invalid&&o.push(e)}),o.length>0){const e=`Os campos ${o.join(", ")} est\xe3o inv\xe1lidos.`;return this.markFormGroupTouched(this.addProductForm),void this.messageService.add({severity:"warn",summary:"Aviso",detail:e,life:3e3})}this.produtoService.create(this.addProductForm.value).pipe((0,a.R)(this.destroy$)).subscribe({next:e=>{e&&(this.messageService.add({severity:"success",summary:"Sucesso",detail:`O produto ${e.nome} foi criado com sucesso!`,life:2e3}),this.addProductForm.reset())},error:e=>{this.messageService.add({severity:"error",summary:"Erro",detail:"Erro ao criar produto",life:2e3}),console.log(e)}})}handleSubmitEditProduct(){const o=[];if(Object.keys(this.editProductform.controls).forEach(r=>{const s=this.editProductform.get(r);s&&s.invalid&&o.push(r)}),o.length>0){const r=`Os campos ${o.join(", ")} est\xe3o inv\xe1lidos.`;return this.markFormGroupTouched(this.editProductform),void this.messageService.add({severity:"warn",summary:"Aviso",detail:r,life:3e3})}if(!this.grupoSelecionado||!this.grupoSelecionado.id)return this.messageService.add({severity:"warn",summary:"Aviso",detail:"Grupo n\xe3o selecionado ou inv\xe1lido",life:3e3}),void console.log("Grupo n\xe3o selecionado ou inv\xe1lido:",this.grupoSelecionado);this.produtoService.update({id:this.produtoAction.event.id,nome:this.editProductform.value.nome,preco:this.editProductform.value.preco,ativo:this.editProductform.value.ativo,estoque:this.editProductform.value.estoque,quantidade:this.editProductform.value.quantidade,grupo:{id:this.grupoSelecionado.id,nome:this.grupoSelecionado.nome,ativo:this.grupoSelecionado.ativo,grupoPaiId:this.grupoSelecionado.grupoPaiId}}).pipe((0,a.R)(this.destroy$)).subscribe({next:r=>{r&&(this.editProductform.reset(),this.messageService.add({severity:"success",summary:"Sucesso",detail:`O produto ${r.nome} foi editado com sucesso!`,life:2e3}))},error:r=>{console.log("Erro na requisi\xe7\xe3o:",r),this.editProductform.reset(),this.messageService.add({severity:"error",summary:"Erro",detail:"Erro ao editar produto",life:2e3})}})}markFormGroupTouched(o){Object.values(o.controls).forEach(e=>{e instanceof d.cw?this.markFormGroupTouched(e):e.markAsTouched()})}getProductSelectedDatas(o){const e=this.produtoAction.produtoList;if(e.length>0){const r=e.find(s=>s?.id===o);r&&(this.produtosSelectedDatas=r,this.fornecedorSelecionado=r.fornecedor,this.editProductform.patchValue({nome:r.nome,preco:r.preco,ativo:r.ativo,estoque:r.estoque,grupo:{id:r.grupo?.id||null,nome:r.grupo?.nome||"",ativo:r.grupo?.ativo||!1,grupoPai:r.grupo?.grupoPaiId||0}}),this.grupoSelecionado=r.grupo)}}getproductsDatas(){this.produtoService.findAll().pipe((0,a.R)(this.destroy$)).subscribe({next:o=>{o.length>0&&(this.produtosDatas=o,this.produtosDatas&&this.produtoDTO.setProdutosDatas(this.produtosDatas))}})}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete()}static#t=this.\u0275fac=function(e){return new(e||i)(t.Y36(d.qu),t.Y36(v.ez),t.Y36(f.F0),t.Y36(y.m),t.Y36(M.K),t.Y36(c.S),t.Y36(S.u),t.Y36(N.i),t.Y36(l.uU))};static#o=this.\u0275cmp=t.Xpm({type:i,selectors:[["app-produto-form"]],decls:2,vars:2,consts:[[4,"ngIf"],[3,"formGroup","ngSubmit"],[1,"card","flex","flex-column","md:flex-column","gap-3"],["pInputText","","placeholder","Nome","formControlName","nome"],["formGroupName","grupo"],["styleClass","w-full","placeholder","Selecione o Grupo","formControlName","id","optionLabel","nome","optionValue","id",3,"options","onChange"],["pInputText","","placeholder","Pre\xe7o","formControlName","preco"],["pInputText","","placeholder","Estoque","formControlName","estoque"],["formControlName","ativo","inputId","binary",3,"binary"],[1,"flex","flex-row","justify-content-center","align-content-center","align-items-center","m-1"],["type","submit","label","Concluir"]],template:function(e,r){1&e&&(t.YNc(0,J,15,3,"div",0),t.YNc(1,R,15,3,"div",0)),2&e&&(t.Q6J("ngIf",(null==r.produtoAction||null==r.produtoAction.event?null:r.produtoAction.event.action)===r.addProdutoAction),t.xp6(1),t.Q6J("ngIf",(null==r.produtoAction.event?null:r.produtoAction.event.action)===r.editProductAction))},dependencies:[l.O5,d._Y,d.Fj,d.JJ,d.JL,d.sg,d.u,d.x0,g.zx,x.o,Z.Lt,b.XZ],encapsulation:2})}return i})();function V(i,m){if(1&i&&(t.TgZ(0,"div",1)(1,"div",2)(2,"strong"),t._uU(3,"ID:"),t.qZA(),t._uU(4),t.qZA(),t.TgZ(5,"div",2)(6,"strong"),t._uU(7,"Nome:"),t.qZA(),t._uU(8),t.qZA(),t.TgZ(9,"div",2)(10,"strong"),t._uU(11,"Pre\xe7o:"),t.qZA(),t._uU(12),t.ALo(13,"currency"),t.qZA(),t.TgZ(14,"div",2)(15,"strong"),t._uU(16,"Ativo:"),t.qZA(),t._uU(17),t.qZA(),t.TgZ(18,"div",2)(19,"strong"),t._uU(20,"Grupo:"),t.qZA(),t._uU(21),t.qZA(),t.TgZ(22,"div",2)(23,"strong"),t._uU(24,"Estoque:"),t.qZA(),t._uU(25),t.qZA(),t.TgZ(26,"div",2)(27,"strong"),t._uU(28,"Fornecedor:"),t.qZA(),t._uU(29),t.qZA()()),2&i){const o=t.oxw();t.xp6(4),t.hij(" ",o.produto.id," "),t.xp6(4),t.hij(" ",o.produto.nome," "),t.xp6(4),t.hij(" ",t.xi3(13,7,o.produto.preco,"BRL")," "),t.xp6(5),t.hij(" ",!0===o.produto.ativo?"Sim":"N\xe3o"," "),t.xp6(4),t.hij(" ",o.produto.grupo.nome," "),t.xp6(4),t.hij(" ",o.produto.estoque," "),t.xp6(4),t.hij(" ",null==o.produto.fornecedor?null:o.produto.fornecedor.nome," ")}}let $=(()=>{class i{constructor(o,e){this.ref=o,this.config=e}ngOnInit(){this.produto=this.config.data?.produto}getfornecedor(){}close(){this.ref.close()}static#t=this.\u0275fac=function(e){return new(e||i)(t.Y36(c.E7),t.Y36(c.S))};static#o=this.\u0275cmp=t.Xpm({type:i,selectors:[["app-produto-view"]],decls:1,vars:1,consts:[["class","p-grid p-dir-col",4,"ngIf"],[1,"p-grid","p-dir-col"],[1,"p-col"]],template:function(e,r){1&e&&t.YNc(0,V,30,10,"div",0),2&e&&t.Q6J("ngIf",r.produto)},dependencies:[l.O5,l.H9],encapsulation:2})}return i})();var B=n(5226),Y=n(3066);function j(i,m){if(1&i){const o=t.EpF();t.TgZ(0,"tr")(1,"th",7)(2,"div",8)(3,"div",8),t._uU(4," ID "),t.qZA(),t.TgZ(5,"div",8),t._UZ(6,"p-sortIcon",9)(7,"p-columnFilter",10),t.qZA()()(),t.TgZ(8,"th",11)(9,"div",8)(10,"div",8),t._uU(11," Nome "),t.qZA(),t.TgZ(12,"div",8),t._UZ(13,"p-sortIcon",12)(14,"p-columnFilter",13),t.qZA()()(),t.TgZ(15,"th",14)(16,"div",8)(17,"div",8),t._uU(18," Pre\xe7o "),t.qZA(),t.TgZ(19,"div",8),t._UZ(20,"p-sortIcon",15)(21,"p-columnFilter",16),t.qZA()()(),t.TgZ(22,"th",17)(23,"div",8)(24,"div",8),t._uU(25," Ativo "),t.qZA(),t.TgZ(26,"div",8),t._UZ(27,"p-sortIcon",18)(28,"p-columnFilter",19),t.qZA()()(),t.TgZ(29,"th",20)(30,"div",8)(31,"div",8),t._uU(32," Estoque "),t.qZA(),t.TgZ(33,"div",8),t._UZ(34,"p-sortIcon",21)(35,"p-columnFilter",22),t.qZA()()(),t.TgZ(36,"th",23)(37,"div",8)(38,"div",8),t._uU(39," Grupo "),t.qZA(),t.TgZ(40,"div",8),t._UZ(41,"p-sortIcon",24)(42,"p-columnFilter",25),t.qZA()()(),t.TgZ(43,"th")(44,"div",26)(45,"p-button",27),t.NdJ("onClick",function(){t.CHM(o);const r=t.oxw();return t.KtG(r.handleProductEvent(r.createProductEvent))}),t.qZA()()()()}2&i&&(t.xp6(7),t.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),t.xp6(7),t.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),t.xp6(7),t.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),t.xp6(7),t.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),t.xp6(7),t.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),t.xp6(7),t.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1))}function Q(i,m){if(1&i&&(t.ynx(0),t._uU(1),t._UZ(2,"br"),t.BQk()),2&i){const o=t.oxw().$implicit;t.xp6(1),t.hij(" ",null==o||null==o.grupo?null:o.grupo.nome," ")}}function H(i,m){if(1&i){const o=t.EpF();t.TgZ(0,"tr")(1,"td"),t._uU(2),t.qZA(),t.TgZ(3,"td"),t._uU(4),t.qZA(),t.TgZ(5,"td"),t._uU(6),t.ALo(7,"currency"),t.qZA(),t.TgZ(8,"td"),t._uU(9),t.qZA(),t.TgZ(10,"td"),t._uU(11),t.qZA(),t.TgZ(12,"td"),t.YNc(13,Q,3,1,"ng-container",28),t.qZA(),t.TgZ(14,"td")(15,"div",29)(16,"button",30),t.NdJ("click",function(){const s=t.CHM(o).$implicit,u=t.oxw();return t.KtG(u.handleProductEvent(u.editProductEvent,null==s?null:s.id))}),t.qZA(),t.TgZ(17,"button",31),t.NdJ("click",function(){const s=t.CHM(o).$implicit,u=t.oxw();return t.KtG(u.handleDeleteProduct(null==s?null:s.id,null==s?null:s.nome))}),t.qZA(),t.TgZ(18,"button",32),t.NdJ("click",function(){const s=t.CHM(o).$implicit,u=t.oxw();return t.KtG(u.handleProductEvent(u.viewProductEvent,null==s?null:s.id))}),t.qZA()()()()}if(2&i){const o=m.$implicit;t.xp6(2),t.Oqu(null==o?null:o.id),t.xp6(2),t.Oqu(null==o?null:o.nome),t.xp6(2),t.Oqu(t.xi3(7,6,null==o?null:o.preco,"BRL")),t.xp6(3),t.Oqu(!0===(null==o?null:o.ativo)?"Ativo":"Inativo"),t.xp6(2),t.Oqu(null==o?null:o.estoque),t.xp6(2),t.Q6J("ngIf",null!==(null==o?null:o.grupo))}}const L=function(){return["nome","preco","ativo","estoque","grupo.nome","fornecedor.nome","ordemDeServico.id"]},k=function(){return{"min-width":"75rem"}};let z=(()=>{class i{constructor(){this.produtos=[],this.produtoEvent=new t.vpe,this.deleteProductEvent=new t.vpe,this.createProductEvent=p.CREATE_PRODUCT_EVENT,this.editProductEvent=p.EDIT_PRODUCT_EVENT,this.viewProductEvent=p.VIEW_PRODUCT_EVENT}handleProductEvent(o,e){void 0!==o&&""!==o&&this.produtoEvent.emit(e&&null!==e?{action:o,id:e}:{action:o})}handleDeleteProduct(o,e){o&&null!==o&&this.deleteProductEvent.emit({product_id:o,product_name:e})}static#t=this.\u0275fac=function(e){return new(e||i)};static#o=this.\u0275cmp=t.Xpm({type:i,selectors:[["app-produto-table"]],inputs:{produtos:"produtos"},outputs:{produtoEvent:"produtoEvent",deleteProductEvent:"deleteProductEvent"},decls:7,vars:11,consts:[[1,"grid"],[1,"col-12"],["styleClass","shadow-3 mt-5 text-indigo-400","header","Produtos"],["dataKey","id","currentPageReportTemplate","Mostrando {first} de {last} de {totalRecords} produtos",3,"value","rows","paginator","responsive","globalFilterFields","tableStyle","selection","rowHover","showCurrentPageReport","selectionChange"],["usersTable",""],["pTemplate","header"],["pTemplate","body"],["pSortableColumn","id"],[1,"flex","justify-content-between","align-itens-center"],["field","id"],["type","text","field","id","display","menu","matchMode","contains",3,"showMatchModes","showOperator","showAddButton"],["pSortableColumn","nome"],["field","nome"],["type","text","field","nome","display","menu","matchMode","contains",3,"showMatchModes","showOperator","showAddButton"],["pSortableColumn","preco"],["field","preco"],["type","text","field","preco","display","menu","matchMode","contains",3,"showMatchModes","showOperator","showAddButton"],["pSortableColumn","ativo"],["field","rua"],["type","text","field","ativo","display","menu","matchMode","contains",3,"showMatchModes","showOperator","showAddButton"],["pSortableColumn","estoque"],["field","estoque"],["type","text","field","estoque","display","menu","matchMode","contains",3,"showMatchModes","showOperator","showAddButton"],["pSortableColumn","grupo"],["field","grupo.nome"],["type","text","field","grupo.nome","display","menu","matchMode","contains",3,"showMatchModes","showOperator","showAddButton"],[1,"flex","justify-content-center"],["styleClass","p-button-info","icon","pi pi-plus","label","Novo","pTooltip","Cadastrar novo produto","tooltipPosition","top",3,"onClick"],[4,"ngIf"],[1,"flex","justify-content-center","gap-3","align-itens-center","align-content-center"],["pButton","","pRipple","","icon","pi pi-pencil","pTooltip","Editar Produto","tooltipPosition","top",1,"p-button-rounded","p-button-warning",3,"click"],["pButton","","pRipple","","icon","pi pi-trash","pTooltip","Excluir Produto","tooltipPosition","top",1,"p-button-rounded","p-button-danger",3,"click"],["pButton","","pRipple","","icon","pi pi-eye","pTooltip","Visualizar Produto","tooltipPosition","top",1,"p-button-rounded","p-button-sucess",3,"click"]],template:function(e,r){1&e&&(t.TgZ(0,"div",0)(1,"div",1)(2,"p-card",2)(3,"p-table",3,4),t.NdJ("selectionChange",function(u){return r.produtoSelected=u}),t.YNc(5,j,46,18,"ng-template",5),t.YNc(6,H,19,9,"ng-template",6),t.qZA()()()()),2&e&&(t.xp6(3),t.Q6J("value",r.produtos)("rows",10)("paginator",!0)("responsive",!0)("globalFilterFields",t.DdM(9,L))("tableStyle",t.DdM(10,k))("selection",r.produtoSelected)("rowHover",!0)("showCurrentPageReport",!0))},dependencies:[l.O5,A.Z,v.jx,g.Hq,g.zx,h.iA,h.lQ,h.fz,h.xl,E.u,l.H9]})}return i})();const K=function(){return{widith:"50vw"}},X=[{path:"",component:(()=>{class i{constructor(o,e,r,s,u,P){this.produtoService=o,this.produtoDtTransferService=e,this.router=r,this.messageService=s,this.confirmationService=u,this.dialogService=P,this.destroy$=new C.x,this.sidebarVisible=!1,this.produtoList=[]}ngOnInit(){this.getServiceProdutosDatas()}getServiceProdutosDatas(){const o=this.produtoDtTransferService.getProdutosDatas();o.length>0?this.produtoList=o:this.getAPIProdutosDatas()}getAPIProdutosDatas(){this.produtoService.findAll().pipe((0,a.R)(this.destroy$)).subscribe({next:o=>{this.produtoList=o},error:o=>{console.log(o),this.router.navigate(["home"]),this.messageService.add({severity:"error",summary:"Erro.",detail:"Erro ao buscar produtos",life:2500})}})}handleProductAction(o){o.action===p.CREATE_PRODUCT_EVENT||o.action===p.EDIT_PRODUCT_EVENT?(this.ref=this.dialogService.open(G,{header:o?.action,width:"70%",contentStyle:{overflow:"auto"},baseZIndex:1e4,maximizable:!0,data:{event:o,produtoList:this.produtoList}}),this.ref.onClose.pipe((0,a.R)(this.destroy$)).subscribe({next:()=>this.getAPIProdutosDatas()})):this.handleViewProductAction(o)}handleOpenSidebar(){this.sidebarVisible=!this.sidebarVisible}handleDeleteProductAction(o){o&&this.confirmationService.confirm({message:`Deseja realmente deletar o produto ${o?.product_name}?`,header:"Confirma\xe7\xe3o de exclus\xe3o",icon:"pi pi-exclamation-triangle",acceptLabel:"Sim",rejectLabel:"N\xe3o",accept:()=>this.deleteProduct(o?.product_id)})}handleViewProductAction(o){o&&this.produtoService.findById(o?.id).pipe((0,a.R)(this.destroy$)).subscribe({next:e=>{e&&(this.ref=this.dialogService.open($,{header:o?.action,width:"70%",contentStyle:{overflow:"auto"},baseZIndex:1e4,maximizable:!0,data:{produto:e}}),this.ref.onClose.pipe((0,a.R)(this.destroy$)).subscribe({next:()=>this.getAPIProdutosDatas()}))},error(e){console.log(e)}})}deleteProduct(o){o&&this.produtoService.delete(o).pipe((0,a.R)(this.destroy$)).subscribe({next:e=>{this.getAPIProdutosDatas(),this.messageService.add({severity:"success",summary:"Sucesso",detail:"Produto Excluido com sucesso!",life:2500})},error:e=>{console.log(e),this.messageService.add({severity:"error",summary:"Erro",detail:`Erro ao excluir produto ${e.error.error}`,life:2500})}})}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete()}static#t=this.\u0275fac=function(e){return new(e||i)(t.Y36(y.m),t.Y36(S.u),t.Y36(f.F0),t.Y36(v.ez),t.Y36(v.YP),t.Y36(c.xA))};static#o=this.\u0275cmp=t.Xpm({type:i,selectors:[["app-produto-home"]],decls:4,vars:5,consts:[[3,"openSidebarEvent"],[3,"sidebarVisible"],[3,"produtos","produtoEvent","deleteProductEvent"]],template:function(e,r){1&e&&(t.TgZ(0,"app-toolbar",0),t.NdJ("openSidebarEvent",function(){return r.handleOpenSidebar()}),t.qZA(),t._UZ(1,"app-side-bar",1),t.TgZ(2,"app-produto-table",2),t.NdJ("produtoEvent",function(u){return r.handleProductAction(u)})("deleteProductEvent",function(u){return r.handleDeleteProductAction(u)}),t.qZA(),t._UZ(3,"p-confirmDialog")),2&e&&(t.xp6(1),t.Q6J("sidebarVisible",r.sidebarVisible),t.xp6(1),t.Q6J("produtos",r.produtoList),t.xp6(1),t.Akn(t.DdM(4,K)))},dependencies:[B.n,Y.P,_.Q,z],encapsulation:2})}return i})()}];let W=(()=>{class i{static#t=this.\u0275fac=function(e){return new(e||i)};static#o=this.\u0275mod=t.oAB({type:i});static#e=this.\u0275inj=t.cJS({providers:[c.xA,v.YP,l.uU],imports:[l.ez,d.u5,d.UX,f.Bz.forChild(X),U.m,w.JF,A.d,D.cc,g.hJ,h.U$,I.zz,q.Iu,x.j,O.A,F.L$,c.DL,Z.kW,b.nD,_.D,E.z]})}return i})()}}]);