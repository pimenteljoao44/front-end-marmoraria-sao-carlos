"use strict";(self.webpackChunkmarmoraria_sao_carlos=self.webpackChunkmarmoraria_sao_carlos||[]).push([[686],{8686:(_o,C,s)=>{s.r(C),s.d(C,{FuncionariosModule:()=>po});var p=s(6814),h=s(5219),m=s(5118),a=s(6223),F=s(1365),g=s(9862),x=s(4532),T=s(1865),v=s(707),_=s(909),w=s(9663),N=s(5609),A=s(3714),P=s(6218),O=s(9653),I=s(3866),Z=s(3904),y=s(3259),S=s(8645),d=s(9773),l=function(r){return r.CREATE_FUNCIONARIO_EVENT="Criar Funcionario",r.EDIT_FUNCIONARIO_EVENT="Editar Funcionario",r.VIEW_FUNCIONARIO_EVENT="Visualizar Funcionario",r}(l||{}),o=s(4946),U=s(3004),M=s(2098),J=s(553),D=s(459);let E=(()=>{class r{constructor(e,i){this.httpClient=e,this.cookieService=i,this.baseUrl=J.N.baseUrl,this.JWT_TOKEN=this.cookieService.get("USER_INFO")}get httpOptions(){return{headers:new g.WM({"Content-Type":"application/json",Authorization:`Bearer ${this.JWT_TOKEN}`})}}findAll(){return this.httpClient.get(`${this.baseUrl}/funcionarios`,this.httpOptions)}findById(e){return this.httpClient.get(`${this.baseUrl}/funcionarios/${e}`,this.httpOptions)}create(e){return this.httpClient.post(`${this.baseUrl}/funcionarios`,e,this.httpOptions)}update(e){return this.httpClient.put(`${this.baseUrl}/funcionarios/${e?.id}`,e,this.httpOptions)}delete(e){return this.httpClient.delete(`${this.baseUrl}/funcionarios/${e}`,this.httpOptions)}static#o=this.\u0275fac=function(i){return new(i||r)(o.LFG(g.eN),o.LFG(D.N))};static#e=this.\u0275prov=o.Yz7({token:r,factory:r.\u0275fac,providedIn:"root"})}return r})();var q=s(5619),k=s(8180);let b=(()=>{class r{constructor(){this.funcionariosDataEmitter$=new q.X(null),this.funcionariosDatas=[]}setFuncionariosDatas(e){e&&this.funcionariosDataEmitter$.next(e)}getFuncionariosDataEmitter(){return this.funcionariosDataEmitter$.asObservable()}getFuncionariosDatas(){return this.funcionariosDataEmitter$.pipe((0,k.q)(1)).subscribe({next:e=>{e&&(this.funcionariosDatas=e)}}),this.funcionariosDatas}static#o=this.\u0275fac=function(i){return new(i||r)};static#e=this.\u0275prov=o.Yz7({token:r,factory:r.\u0275fac,providedIn:"root"})}return r})();function V(r,u){if(1&r){const e=o.EpF();o.TgZ(0,"input",24),o.NdJ("input",function(t){o.CHM(e);const n=o.oxw(2);return o.KtG(n.formatarCPF(t,n.addFuncionarioForm))})("keyup",function(t){o.CHM(e);const n=o.oxw(2);return o.KtG(n.formatarCPF(t,n.addFuncionarioForm))})("keydown",function(t){o.CHM(e);const n=o.oxw(2);return o.KtG(n.formatarCPF(t,n.addFuncionarioForm))}),o.qZA()}}function $(r,u){if(1&r){const e=o.EpF();o.TgZ(0,"input",25),o.NdJ("input",function(t){o.CHM(e);const n=o.oxw(2);return o.KtG(n.formatarRG(t,n.addFuncionarioForm))})("keyup",function(t){o.CHM(e);const n=o.oxw(2);return o.KtG(n.formatarRG(t,n.addFuncionarioForm))})("keydown",function(t){o.CHM(e);const n=o.oxw(2);return o.KtG(n.formatarRG(t,n.addFuncionarioForm))}),o.qZA()}}function R(r,u){if(1&r){const e=o.EpF();o.TgZ(0,"input",26),o.NdJ("input",function(t){o.CHM(e);const n=o.oxw(2);return o.KtG(n.formatarCNPJ(t,n.addFuncionarioForm))})("keyup",function(t){o.CHM(e);const n=o.oxw(2);return o.KtG(n.formatarCNPJ(t,n.addFuncionarioForm))})("keydown",function(t){o.CHM(e);const n=o.oxw(2);return o.KtG(n.formatarCNPJ(t,n.addFuncionarioForm))}),o.qZA()}}function G(r,u){if(1&r){const e=o.EpF();o.TgZ(0,"div")(1,"form",1),o.NdJ("ngSubmit",function(){o.CHM(e);const t=o.oxw();return o.KtG(t.handleSubmitAddClient())}),o.TgZ(2,"div",2)(3,"div",3)(4,"label",4),o._uU(5,"Pessoa F\xedsica"),o.qZA(),o.TgZ(6,"p-radioButton",5),o.NdJ("onClick",function(){o.CHM(e);const t=o.oxw();return o.KtG(t.onTipoPessoaChange(t.addFuncionarioForm))}),o.qZA(),o.TgZ(7,"label",6),o._uU(8,"Pessoa Jur\xeddica"),o.qZA(),o.TgZ(9,"p-radioButton",7),o.NdJ("onClick",function(){o.CHM(e);const t=o.oxw();return o.KtG(t.onTipoPessoaChange(t.addFuncionarioForm))}),o.qZA()(),o._UZ(10,"input",8)(11,"input",9)(12,"input",10)(13,"input",11),o.YNc(14,V,1,0,"input",12),o.YNc(15,$,1,0,"input",13),o.YNc(16,R,1,0,"input",14),o.TgZ(17,"div",15),o._UZ(18,"input",16)(19,"input",17)(20,"input",18)(21,"input",19),o.TgZ(22,"div",20)(23,"p-dropdown",21),o.NdJ("onChange",function(t){o.CHM(e);const n=o.oxw();return o.KtG(n.onCidadeChange(t.value))}),o.qZA()()(),o.TgZ(24,"div",22)(25,"button",23),o._uU(26,"Concluir"),o.qZA()()()()()}if(2&r){const e=o.oxw();let i,t,n;o.xp6(1),o.Q6J("formGroup",e.addFuncionarioForm),o.xp6(13),o.Q6J("ngIf","PESSOA_FISICA"===(null==(i=e.addFuncionarioForm.get("tipoPessoa"))?null:i.value)),o.xp6(1),o.Q6J("ngIf","PESSOA_FISICA"===(null==(t=e.addFuncionarioForm.get("tipoPessoa"))?null:t.value)),o.xp6(1),o.Q6J("ngIf","PESSOA_JURIDICA"===(null==(n=e.addFuncionarioForm.get("tipoPessoa"))?null:n.value)),o.xp6(7),o.Q6J("options",e.cidades)}}function B(r,u){if(1&r){const e=o.EpF();o.TgZ(0,"input",24),o.NdJ("input",function(t){o.CHM(e);const n=o.oxw(2);return o.KtG(n.formatarCPF(t,n.editFuncionarioForm))})("keyup",function(t){o.CHM(e);const n=o.oxw(2);return o.KtG(n.formatarCPF(t,n.editFuncionarioForm))})("keydown",function(t){o.CHM(e);const n=o.oxw(2);return o.KtG(n.formatarCPF(t,n.editFuncionarioForm))}),o.qZA()}}function j(r,u){if(1&r){const e=o.EpF();o.TgZ(0,"input",25),o.NdJ("input",function(t){o.CHM(e);const n=o.oxw(2);return o.KtG(n.formatarRG(t,n.editFuncionarioForm))})("keyup",function(t){o.CHM(e);const n=o.oxw(2);return o.KtG(n.formatarRG(t,n.editFuncionarioForm))})("keydown",function(t){o.CHM(e);const n=o.oxw(2);return o.KtG(n.formatarRG(t,n.editFuncionarioForm))}),o.qZA()}}function H(r,u){1&r&&o._UZ(0,"input",28)}function Y(r,u){if(1&r){const e=o.EpF();o.TgZ(0,"div")(1,"form",1),o.NdJ("ngSubmit",function(){o.CHM(e);const t=o.oxw();return o.KtG(t.handleSubmitEditClient())}),o.TgZ(2,"div",2)(3,"div",3)(4,"label",4),o._uU(5,"Pessoa F\xedsica"),o.qZA(),o.TgZ(6,"p-radioButton",5),o.NdJ("onClick",function(){o.CHM(e);const t=o.oxw();return o.KtG(t.onTipoPessoaChange(t.editFuncionarioForm))}),o.qZA(),o.TgZ(7,"label",6),o._uU(8,"Pessoa Jur\xeddica"),o.qZA(),o.TgZ(9,"p-radioButton",7),o.NdJ("onClick",function(){o.CHM(e);const t=o.oxw();return o.KtG(t.onTipoPessoaChange(t.editFuncionarioForm))}),o.qZA()(),o._UZ(10,"input",8)(11,"input",9)(12,"input",10)(13,"input",11),o.YNc(14,B,1,0,"input",12),o.YNc(15,j,1,0,"input",13),o.YNc(16,H,1,0,"input",27),o.TgZ(17,"div",15),o._UZ(18,"input",16)(19,"input",17)(20,"input",18)(21,"input",19),o.TgZ(22,"div",20)(23,"p-dropdown",21),o.NdJ("onChange",function(t){o.CHM(e);const n=o.oxw();return o.KtG(n.onCidadeChange(t.value))}),o.qZA()()(),o.TgZ(24,"div",22)(25,"button",23),o._uU(26,"Concluir"),o.qZA()()()()()}if(2&r){const e=o.oxw();let i,t,n;o.xp6(1),o.Q6J("formGroup",e.editFuncionarioForm),o.xp6(13),o.Q6J("ngIf","PESSOA_FISICA"===(null==(i=e.editFuncionarioForm.get("tipoPessoa"))?null:i.value)),o.xp6(1),o.Q6J("ngIf","PESSOA_FISICA"===(null==(t=e.editFuncionarioForm.get("tipoPessoa"))?null:t.value)),o.xp6(1),o.Q6J("ngIf","PESSOA_JURIDICA"===(null==(n=e.editFuncionarioForm.get("tipoPessoa"))?null:n.value)),o.xp6(7),o.Q6J("options",e.cidades)}}let Q=(()=>{class r{updateValidators(e){const i=e.get("tipoPessoa")?.value,t=e.get("cpf"),n=e.get("cnpj");t?.clearValidators(),n?.clearValidators(),"PESSOA_FISICA"===i?(t?.setValidators([a.kI.required,a.kI.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]),n?.setValue("")):"PESSOA_JURIDICA"===i&&(n?.setValidators([a.kI.required,a.kI.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)]),t?.setValue("")),t?.updateValueAndValidity(),n?.updateValueAndValidity()}formatarRG(e,i){const t=e.target.value.replace(/\D/g,"");let n="";n=t.length<=9?t.replace(/(\d{2})(\d{3})(\d{3})/,"$1.$2.$3"):t.substring(0,9),i.get("rg")?.setValue(n)}formatarCPF(e,i){const t=e.target.value.replace(/\D/g,"");let n="";n=t.length<=11?t.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,"$1.$2.$3-$4"):t.substring(0,14),i.get("cpf")?.setValue(n)}formatarCNPJ(e,i){const t=e.target.value.replace(/\D/g,"");let n="";n=t.length<=14?t.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,"$1.$2.$3/$4-$5"):t.substring(0,18),i.get("cnpj")?.setValue(n)}onTipoPessoaChange(e){this.updateValidators(e)}onCidadeChange(e){this.cidadeService.findById(e).pipe((0,d.R)(this.destroy$)).subscribe({next:i=>{i&&(this.cidadeSelecionada=i)},error(i){console.log(i)}}),this.estadoService.findById(this.cidadeSelecionada?.estado?.id).subscribe({next:i=>{this.cidadeSelecionada.estado=i},error:i=>{console.error("Erro ao buscar o estado associado:",i)}})}constructor(e,i,t,n,c,f,mo,fo,ho){this.formBuilder=e,this.messageService=i,this.router=t,this.estadoService=n,this.cidadeService=c,this.funcionarioService=f,this.ref=mo,this.datePipe=fo,this.funcionarioDTO=ho,this.destroy$=new S.x,this.tipoPessoa=[{label:"Pessoa F\xedsica",value:"PESSOA_FISICA"},{label:"Pessoa Jur\xeddica",value:"PESSOA_JURIDICA"}],this.TipoPessoaSelected=[],this.funcionarioDatas=[],this.cidades=[],this.addFuncionarioAction=l.CREATE_FUNCIONARIO_EVENT,this.editFuncionarioAtion=l.EDIT_FUNCIONARIO_EVENT,this.addFuncionarioForm=this.formBuilder.group({nome:["",a.kI.required],telefone:["",a.kI.required],endereco:this.formBuilder.group({rua:["",a.kI.required],numero:["",a.kI.required],complemento:[""],bairro:["",a.kI.required],cidade:this.formBuilder.group({cidId:[null,a.kI.required],nome:["",a.kI.required],estado:this.formBuilder.group({id:[null],nome:[""],sigla:[""],cidades:[[]],dataCriacao:[this.getDate()],dataAtualizacao:[""]})})}),cargo:["",a.kI.required],salario:["",a.kI.required],cpf:[""],rg:[""],cnpj:[""],tipoPessoa:["PESSOA_FISICA",a.kI.required],dataCriacao:[this.getDate(),a.kI.required],dataAtualizacao:[""]}),this.editFuncionarioForm=this.formBuilder.group({id:[null],nome:["",a.kI.required],telefone:["",a.kI.required],endereco:this.formBuilder.group({rua:["",a.kI.required],numero:["",a.kI.required],complemento:[""],bairro:["",a.kI.required],cidade:this.formBuilder.group({cidId:[null,a.kI.required],nome:["",a.kI.required],estado:this.formBuilder.group({id:[null],nome:[""],sigla:[""],cidades:[[]],dataCriacao:[this.getDate()],dataAtualizacao:[""]})})}),cargo:["",a.kI.required],salario:["",a.kI.required],cpf:[""],rg:[""],cnpj:[""],tipoPessoa:["PESSOA_FISICA",a.kI.required],dataCriacao:[this.getDate()],dataAtualizacao:[""]})}ngOnInit(){if(this.onTipoPessoaChange(this.addFuncionarioForm),this.onTipoPessoaChange(this.editFuncionarioForm),this.funcionarioAction=this.ref.data,this.funcionarioAction?.event.action===this.editFuncionarioAtion&&this.funcionarioAction?.funcionariosList){const e=this.funcionarioAction?.event?.id;this.getFuncionarioSelectedDatas(e),this.setCidadeNosFormularios(this.cidadeSelecionada),this.updateValidators(this.editFuncionarioForm)}this.getCidades()}setCidadeNosFormularios(e){const i=this.addFuncionarioForm.get("endereco"),t=this.editFuncionarioForm.get("endereco"),n=e.cidId;i.get("cidade.cidId")?.setValue(n),i.get("cidade.nome")?.setValue(e?.nome),i.get("cidade.estado.id")?.setValue(e?.estado?.id),t.get("cidade.cidId")?.setValue(n),t.get("cidade.nome")?.setValue(e?.nome),t.get("cidade.estado.id")?.setValue(e?.estado?.id);const c=this.getDate();i.get("cidade.estado.dataCriacao")?.setValue(c),t.get("cidade.estado.dataCriacao")?.setValue(c)}getDate(){return this.datePipe.transform(new Date,"dd/MM/yyyy HH:mm")||""}getCidades(){this.cidadeService.findAll().pipe((0,d.R)(this.destroy$)).subscribe({next:e=>{e.length>0&&(this.cidades=e,this.cidades.length>0&&(this.cidadeSelecionada=this.cidades[0],this.setCidadeNosFormularios(this.cidadeSelecionada)))},error:e=>{console.log(e)}})}handleSubmitAddClient(){const e=[];if(Object.keys(this.addFuncionarioForm.controls).forEach(i=>{const t=this.addFuncionarioForm.get(i);t&&t.invalid&&e.push(i)}),e.length>0){const i=`Os campos ${e.join(", ")} est\xe3o inv\xe1lidos.`;return this.markFormGroupTouched(this.addFuncionarioForm),void this.messageService.add({severity:"warn",summary:"Aviso",detail:i,life:3e3})}this.funcionarioService.create(this.addFuncionarioForm.value).pipe((0,d.R)(this.destroy$)).subscribe({next:i=>{i&&(this.addFuncionarioForm.reset(),this.messageService.add({severity:"success",summary:"Sucesso",detail:`O funcionario ${i.nome} foi criado com sucesso!`,life:2e3}))},error:i=>{console.error("Erro durante a solicita\xe7\xe3o:",i),this.messageService.add({severity:"error",summary:"Erro",detail:`Erro ao criar funcionario ${i.error.error}.`,life:4e3}),console.log(i)}})}handleSubmitEditClient(){const e=[];if(Object.keys(this.editFuncionarioForm.controls).forEach(c=>{const f=this.editFuncionarioForm.get(c);f&&f.invalid&&e.push(c)}),e.length>0){const c=`Os campos ${e.join(", ")} est\xe3o inv\xe1lidos.`;return this.markFormGroupTouched(this.editFuncionarioForm),void this.messageService.add({severity:"warn",summary:"Aviso",detail:c,life:3e3})}this.setCidadeNosFormularios(this.cidadeSelecionada);const i=this.datePipe.transform(new Date,"dd/MM/yyyy HH:mm"),t=this.editFuncionarioForm.value.endereco;this.funcionarioService.update({id:this.funcionarioAction.event.id,nome:this.editFuncionarioForm.value.nome,telefone:this.editFuncionarioForm.value.telefone,endereco:{rua:t.rua,numero:t.numero,complemento:t.complemento,bairro:t.bairro,cidade:{cidId:this.cidadeSelecionada.cidId}},cargo:this.editFuncionarioForm.value.cargo,salario:this.editFuncionarioForm.value.salario,cpf:this.editFuncionarioForm.value.cpf,rg:this.editFuncionarioForm.value.rg,cnpj:this.editFuncionarioForm.value.cnpj,tipoPessoa:this.editFuncionarioForm.value.tipoPessoa,dataCriacao:this.editFuncionarioForm.value.dataCriacao,dataAtualizacao:null!==i?i:void 0}).pipe((0,d.R)(this.destroy$)).subscribe({next:c=>{c&&(this.messageService.add({severity:"success",summary:"Sucesso",detail:"O cliente foi editado com sucesso!",life:2e3}),this.editFuncionarioForm.reset())},error:c=>{console.log(c),this.messageService.add({severity:"error",summary:"Erro",detail:`Erro ao editar funcionario, ${c.error.error}`,life:2e3})}})}markFormGroupTouched(e){Object.values(e.controls).forEach(i=>{i instanceof a.cw?this.markFormGroupTouched(i):i.markAsTouched()})}getFuncionarioSelectedDatas(e){const i=this.funcionarioAction.funcionariosList;if(i.length>0){const t=i.find(n=>n?.id===e);t&&(this.funcionarioSelectedDatas=t,this.cidadeSelecionada=t.endereco.cidade,this.editFuncionarioForm.patchValue({id:t.id,nome:t.nome,telefone:t.telefone,cpf:t.cpf,rg:t.rg,cargo:t.cargo,salario:t.salario,cnpj:t.cnpj,tipoPessoa:t.tipoPessoa,dataCriacao:t.dataCriacao,dataAtualizacao:t.dataAtualizacao,endereco:{rua:t.endereco.rua,numero:t.endereco.numero,complemento:t.endereco.complemento,bairro:t.endereco.bairro,cidade:{cidId:t.endereco.cidade.cidId}}}),this.editFuncionarioForm.updateValueAndValidity())}}setUserDatas(){this.funcionarioService.findAll().pipe((0,d.R)(this.destroy$)).subscribe({next:e=>{e.length>0&&(this.funcionarioDatas=e,this.funcionarioDatas&&this.funcionarioDTO.setFuncionariosDatas(this.funcionarioDatas))}})}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete()}static#o=this.\u0275fac=function(i){return new(i||r)(o.Y36(a.qu),o.Y36(h.ez),o.Y36(F.F0),o.Y36(U.s),o.Y36(M.F),o.Y36(E),o.Y36(m.S),o.Y36(p.uU),o.Y36(b))};static#e=this.\u0275cmp=o.Xpm({type:r,selectors:[["app-funcionarios-form"]],decls:2,vars:2,consts:[[4,"ngIf"],[3,"formGroup","ngSubmit"],[1,"card","flex","flex-column","md:flex-column","gap-3"],[1,"p-field","flex","flex-row","justify-content-center","align-items-center","align-content-center","m-1"],["for","pessoaFisica",1,"mr-3"],["inputId","pessoaFisica","name","tipoPessoa","value","PESSOA_FISICA","formControlName","tipoPessoa",1,"mr-5","p-radiobutton",3,"onClick"],["for","pessoaJuridica",1,"mr-3"],["inputId","pessoaJuridica","name","tipoPessoa","value","PESSOA_JURIDICA","formControlName","tipoPessoa",1,"p-radiobutton",3,"onClick"],["pInputText","","placeholder","Nome","formControlName","nome"],["pInputText","","placeholder","Cargo","formControlName","cargo"],["pInputText","","placeholder","Salario","formControlName","salario"],["pInputText","","placeholder","Telefone","formControlName","telefone"],["pInputText","","placeholder","CPF","formControlName","cpf",3,"input","keyup","keydown",4,"ngIf"],["pInputText","","placeholder","RG","formControlName","rg",3,"input","keyup","keydown",4,"ngIf"],["pInputText","","placeholder","CNPJ","formControlName","cnpj",3,"input","keyup","keydown",4,"ngIf"],["formGroupName","endereco"],["pInputText","","placeholder","Rua","formControlName","rua"],["pInputText","","placeholder","N\xfamero","formControlName","numero"],["pInputText","","placeholder","Complemento","formControlName","complemento"],["pInputText","","placeholder","Bairro","formControlName","bairro"],["formGroupName","cidade"],["styleClass","w-full","placeholder","Selecione a cidade","formControlName","cidId","optionLabel","nome","optionValue","cidId",3,"options","onChange"],[1,"flex","flex-row","justify-content-center","align-items-center","align-content-center","m-1"],["type","submit",1,"p-button"],["pInputText","","placeholder","CPF","formControlName","cpf",3,"input","keyup","keydown"],["pInputText","","placeholder","RG","formControlName","rg",3,"input","keyup","keydown"],["pInputText","","placeholder","CNPJ","formControlName","cnpj",3,"input","keyup","keydown"],["pInputText","","placeholder","CNPJ","formControlName","cnpj",4,"ngIf"],["pInputText","","placeholder","CNPJ","formControlName","cnpj"]],template:function(i,t){1&i&&(o.YNc(0,G,27,5,"div",0),o.YNc(1,Y,27,5,"div",0)),2&i&&(o.Q6J("ngIf",t.funcionarioAction.event.action===t.addFuncionarioAction),o.xp6(1),o.Q6J("ngIf",t.funcionarioAction.event.action===t.editFuncionarioAtion))},dependencies:[p.O5,a._Y,a.Fj,a.JJ,a.JL,a.sg,a.u,a.x0,T.EU,A.o,I.Lt]})}return r})();function K(r,u){if(1&r&&(o.TgZ(0,"div",2)(1,"strong"),o._uU(2,"CPF:"),o.qZA(),o._uU(3),o.qZA()),2&r){const e=o.oxw(2);o.xp6(3),o.hij(" ",e.funcionario.cpf," ")}}function z(r,u){if(1&r&&(o.TgZ(0,"div",2)(1,"strong"),o._uU(2,"RG:"),o.qZA(),o._uU(3),o.qZA()),2&r){const e=o.oxw(2);o.xp6(3),o.hij(" ",e.funcionario.rg," ")}}function L(r,u){if(1&r&&(o.TgZ(0,"div",2)(1,"strong"),o._uU(2,"CNPJ:"),o.qZA(),o._uU(3),o.qZA()),2&r){const e=o.oxw(2);o.xp6(3),o.hij(" ",e.funcionario.cnpj," ")}}function W(r,u){if(1&r&&(o.TgZ(0,"div",1)(1,"div",2)(2,"strong"),o._uU(3,"ID:"),o.qZA(),o._uU(4),o.qZA(),o.TgZ(5,"div",2)(6,"strong"),o._uU(7,"Tipo:"),o.qZA(),o._uU(8),o.qZA(),o.TgZ(9,"div",2)(10,"strong"),o._uU(11,"Nome:"),o.qZA(),o._uU(12),o.qZA(),o.TgZ(13,"div",2)(14,"strong"),o._uU(15,"Telefone:"),o.qZA(),o._uU(16),o.qZA(),o.TgZ(17,"div",2)(18,"strong"),o._uU(19,"Salario:"),o.qZA(),o._uU(20),o.ALo(21,"currency"),o.qZA(),o.TgZ(22,"div",2)(23,"strong"),o._uU(24,"Cargo:"),o.qZA(),o._uU(25),o.qZA(),o.TgZ(26,"div",2)(27,"strong"),o._uU(28,"Endere\xe7o:"),o.qZA(),o._uU(29),o.qZA(),o.YNc(30,K,4,1,"div",3),o.YNc(31,z,4,1,"div",3),o.YNc(32,L,4,1,"div",3),o.qZA()),2&r){const e=o.oxw();o.xp6(4),o.hij(" ",e.funcionario.id," "),o.xp6(4),o.hij(" ","PESSOA_FISICA"===e.funcionario.tipoPessoa?"Pessoa F\xedsica":"Pessoa Jur\xeddica"," "),o.xp6(4),o.hij(" ",e.funcionario.nome," "),o.xp6(4),o.hij(" ",e.funcionario.telefone," "),o.xp6(4),o.hij(" ",o.gM2(21,15,e.funcionario.salario,"BRL","symbol","1.2-2")," "),o.xp6(5),o.hij(" ",e.funcionario.cargo," "),o.xp6(4),o.gL8(" ",e.funcionario.endereco.rua,", ",e.funcionario.endereco.numero," - ",e.funcionario.endereco.complemento,", ",e.funcionario.endereco.bairro,", ",e.funcionario.endereco.cidade.nome,", ",null==e.funcionario.endereco.cidade.estado?null:e.funcionario.endereco.cidade.estado.nome," "),o.xp6(1),o.Q6J("ngIf","PESSOA_FISICA"===e.funcionario.tipoPessoa),o.xp6(1),o.Q6J("ngIf","PESSOA_FISICA"===e.funcionario.tipoPessoa),o.xp6(1),o.Q6J("ngIf","PESSOA_JURIDICA"===e.funcionario.tipoPessoa)}}let X=(()=>{class r{constructor(e,i){this.ref=e,this.config=i}ngOnInit(){this.funcionario=this.config.data.funcionario}close(){this.ref.close()}static#o=this.\u0275fac=function(i){return new(i||r)(o.Y36(m.E7),o.Y36(m.S))};static#e=this.\u0275cmp=o.Xpm({type:r,selectors:[["app-funcionarios-view"]],decls:1,vars:1,consts:[["class","p-grid p-dir-col",4,"ngIf"],[1,"p-grid","p-dir-col"],[1,"p-col"],["class","p-col",4,"ngIf"]],template:function(i,t){1&i&&o.YNc(0,W,33,20,"div",0),2&i&&o.Q6J("ngIf",t.funcionario)},dependencies:[p.O5,p.H9]})}return r})();var oo=s(5226),eo=s(3066);function to(r,u){if(1&r){const e=o.EpF();o.TgZ(0,"tr")(1,"th",7)(2,"div",8)(3,"div",8),o._uU(4," ID "),o.qZA(),o.TgZ(5,"div",8),o._UZ(6,"p-sortIcon",9)(7,"p-columnFilter",10),o.qZA()()(),o.TgZ(8,"th",11)(9,"div",8)(10,"div",8),o._uU(11," Nome "),o.qZA(),o.TgZ(12,"div",8),o._UZ(13,"p-sortIcon",12)(14,"p-columnFilter",13),o.qZA()()(),o.TgZ(15,"th",14)(16,"div",8)(17,"div",8),o._uU(18," Telefone "),o.qZA(),o.TgZ(19,"div",8),o._UZ(20,"p-sortIcon",15)(21,"p-columnFilter",16),o.qZA()()(),o.TgZ(22,"th",17)(23,"div",8)(24,"div",8),o._uU(25," Rua "),o.qZA(),o.TgZ(26,"div",8),o._UZ(27,"p-sortIcon",18)(28,"p-columnFilter",19),o.qZA()()(),o.TgZ(29,"th",20)(30,"div",8)(31,"div",8),o._uU(32," RG "),o.qZA(),o.TgZ(33,"div",8),o._UZ(34,"p-sortIcon",21)(35,"p-columnFilter",22),o.qZA()()(),o.TgZ(36,"th",23)(37,"div",8)(38,"div",8),o._uU(39," CPF "),o.qZA(),o.TgZ(40,"div",8),o._UZ(41,"p-sortIcon",24)(42,"p-columnFilter",25),o.qZA()()(),o.TgZ(43,"th",26)(44,"div",8)(45,"div",8),o._uU(46," Complemento "),o.qZA(),o.TgZ(47,"div",8),o._UZ(48,"p-sortIcon",27)(49,"p-columnFilter",28),o.qZA()()(),o.TgZ(50,"th",29)(51,"div",8)(52,"div",8),o._uU(53," Cidade "),o.qZA(),o.TgZ(54,"div",8),o._UZ(55,"p-sortIcon",30)(56,"p-columnFilter",31),o.qZA()()(),o.TgZ(57,"th")(58,"div",32)(59,"p-button",33),o.NdJ("onClick",function(){o.CHM(e);const t=o.oxw();return o.KtG(t.handleFuncionarioEvent(t.createFuncionarioEvent))}),o.qZA()()()()}2&r&&(o.xp6(7),o.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),o.xp6(7),o.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),o.xp6(7),o.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),o.xp6(7),o.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),o.xp6(7),o.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),o.xp6(7),o.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),o.xp6(7),o.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1),o.xp6(7),o.Q6J("showMatchModes",!1)("showOperator",!1)("showAddButton",!1))}function io(r,u){if(1&r&&(o.ynx(0),o._uU(1),o._UZ(2,"br"),o.BQk()),2&r){const e=o.oxw().$implicit;o.xp6(1),o.HOy(" ",null==e||null==e.endereco?null:e.endereco.rua," ",null==e||null==e.endereco?null:e.endereco.numero," ",null==e||null==e.endereco?null:e.endereco.complemento," ",null==e||null==e.endereco?null:e.endereco.bairro," ")}}function no(r,u){if(1&r){const e=o.EpF();o.TgZ(0,"tr")(1,"td"),o._uU(2),o.qZA(),o.TgZ(3,"td"),o._uU(4),o.qZA(),o.TgZ(5,"td"),o._uU(6),o.qZA(),o.TgZ(7,"td"),o.YNc(8,io,3,4,"ng-container",34),o.qZA(),o.TgZ(9,"td"),o._uU(10),o.qZA(),o.TgZ(11,"td"),o._uU(12),o.qZA(),o.TgZ(13,"td"),o._uU(14),o.qZA(),o.TgZ(15,"td"),o._uU(16),o.qZA(),o.TgZ(17,"td")(18,"div",35)(19,"button",36),o.NdJ("click",function(){const n=o.CHM(e).$implicit,c=o.oxw();return o.KtG(c.handleFuncionarioEvent(c.editFuncionarioEvent,null==n?null:n.id))}),o.qZA(),o.TgZ(20,"button",37),o.NdJ("click",function(){const n=o.CHM(e).$implicit,c=o.oxw();return o.KtG(c.handleDeleteFuncionario(null==n?null:n.id,null==n?null:n.nome))}),o.qZA(),o.TgZ(21,"button",38),o.NdJ("click",function(){const n=o.CHM(e).$implicit,c=o.oxw();return o.KtG(c.handleFuncionarioEvent(c.viewFuncionarioEvent,null==n?null:n.id))}),o.qZA()()()()}if(2&r){const e=u.$implicit;o.xp6(2),o.Oqu(null==e?null:e.id),o.xp6(2),o.Oqu(null==e?null:e.nome),o.xp6(2),o.Oqu(null==e?null:e.telefone),o.xp6(2),o.Q6J("ngIf",null!==(null==e?null:e.endereco)),o.xp6(2),o.Oqu(null==e?null:e.rg),o.xp6(2),o.Oqu(null==e?null:e.cpf),o.xp6(2),o.Oqu(null==e||null==e.endereco?null:e.endereco.complemento),o.xp6(2),o.Oqu(null==e||null==e.endereco||null==e.endereco.cidade?null:e.endereco.cidade.nome)}}const ro=function(){return["nome","rua","cpf","rg","cidade"]},ao=function(){return{"min-width":"75rem"}};let so=(()=>{class r{constructor(){this.funcionarios=[],this.clienteEvent=new o.vpe,this.deleteClientEvent=new o.vpe,this.createFuncionarioEvent=l.CREATE_FUNCIONARIO_EVENT,this.editFuncionarioEvent=l.EDIT_FUNCIONARIO_EVENT,this.viewFuncionarioEvent=l.VIEW_FUNCIONARIO_EVENT}handleFuncionarioEvent(e,i){void 0!==e&&""!==e&&this.clienteEvent.emit(i&&null!==i?{action:e,id:i}:{action:e})}handleDeleteFuncionario(e,i){e&&null!==e&&this.deleteClientEvent.emit({func_id:e,nome:i})}static#o=this.\u0275fac=function(i){return new(i||r)};static#e=this.\u0275cmp=o.Xpm({type:r,selectors:[["app-funcionarios-table"]],inputs:{funcionarios:"funcionarios"},outputs:{clienteEvent:"clienteEvent",deleteClientEvent:"deleteClientEvent"},decls:7,vars:11,consts:[[1,"grid"],[1,"col-12"],["styleClass","shadow-3 mt-5 text-indigo-400","header","Funcionarios"],["dataKey","id","currentPageReportTemplate","Mostrando {first} de {last} de {totalRecords} funcionarios",3,"value","rows","paginator","responsive","globalFilterFields","tableStyle","selection","rowHover","showCurrentPageReport","selectionChange"],["usersTable",""],["pTemplate","header"],["pTemplate","body"],["pSortableColumn","id"],[1,"flex","justify-content-between","align-itens-center"],["field","id"],["type","text","field","id","display","menu","matchMode","contains",3,"showMatchModes","showOperator","showAddButton"],["pSortableColumn","nome"],["field","nome"],["type","text","field","nome","display","menu","matchMode","contains",3,"showMatchModes","showOperator","showAddButton"],["pSortableColumn","telefone"],["field","telefone"],["type","text","field","telefone","display","menu","matchMode","contains",3,"showMatchModes","showOperator","showAddButton"],["pSortableColumn","rua"],["field","rua"],["type","text","field","rua","display","menu","matchMode","contains",3,"showMatchModes","showOperator","showAddButton"],["pSortableColumn","rg"],["field","rg"],["type","text","field","rg","display","menu","matchMode","contains",3,"showMatchModes","showOperator","showAddButton"],["pSortableColumn","cpf"],["field","cpf"],["type","text","field","cpf","display","menu","matchMode","contains",3,"showMatchModes","showOperator","showAddButton"],["pSortableColumn","complemento"],["field","complemento"],["type","text","field","complemento","display","menu","matchMode","contains",3,"showMatchModes","showOperator","showAddButton"],["pSortableColumn","cidade"],["field","cidade"],["type","text","field","cidade","display","menu","matchMode","contains",3,"showMatchModes","showOperator","showAddButton"],[1,"flex","justify-content-center"],["styleClass","p-button-info","icon","pi pi-plus","label","Novo","pTooltip","Cadastrar novo Funcionario","tooltipPosition","top",3,"onClick"],[4,"ngIf"],[1,"flex","justify-content-center","gap-3","align-itens-center","align-content-center"],["pButton","","pRipple","","icon","pi pi-pencil","pTooltip","Editar Funcionario","tooltipPosition","top",1,"p-button-rounded","p-button-warning",3,"click"],["pButton","","pRipple","","icon","pi pi-trash","pTooltip","Excluir Funcionario","tooltipPosition","top",1,"p-button-rounded","p-button-danger",3,"click"],["pButton","","pRipple","","icon","pi pi-eye","pTooltip","Visualizar Funcionario","tooltipPosition","top",1,"p-button-rounded","p-button-sucess",3,"click"]],template:function(i,t){1&i&&(o.TgZ(0,"div",0)(1,"div",1)(2,"p-card",2)(3,"p-table",3,4),o.NdJ("selectionChange",function(c){return t.funcionarioSelected=c}),o.YNc(5,to,60,24,"ng-template",5),o.YNc(6,no,22,8,"ng-template",6),o.qZA()()()()),2&i&&(o.xp6(3),o.Q6J("value",t.funcionarios)("rows",10)("paginator",!0)("responsive",!0)("globalFilterFields",o.DdM(9,ro))("tableStyle",o.DdM(10,ao))("selection",t.funcionarioSelected)("rowHover",!0)("showCurrentPageReport",!0))},dependencies:[p.O5,x.Z,h.jx,v.Hq,v.zx,_.iA,_.lQ,_.fz,_.xl,y.u]})}return r})();const co=function(){return{widith:"50vw"}},uo=[{path:"",component:(()=>{class r{constructor(e,i,t,n,c,f){this.funcionarioService=e,this.funcionarioDtransferService=i,this.router=t,this.messageService=n,this.confirmationService=c,this.dialogService=f,this.destroy$=new S.x,this.funcionariosList=[],this.sidebarVisible=!1}ngOnInit(){this.getServiceFuncionariosDatas()}getServiceFuncionariosDatas(){const e=this.funcionarioDtransferService.getFuncionariosDatas();e.length>0?this.funcionariosList=e:this.getAPIfuncionariosDatas()}getAPIfuncionariosDatas(){this.funcionarioService.findAll().pipe((0,d.R)(this.destroy$)).subscribe({next:e=>{this.funcionariosList=e},error:e=>{console.log(e),this.router.navigate(["home"]),this.messageService.add({severity:"error",summary:"Erro.",detail:"Erro ao buscar funcionarios",life:2500})}})}handleFuncionariotAction(e){e.action===l.CREATE_FUNCIONARIO_EVENT||e.action===l.EDIT_FUNCIONARIO_EVENT?(this.ref=this.dialogService.open(Q,{header:e?.action,width:"70%",contentStyle:{overflow:"auto"},baseZIndex:1e4,maximizable:!0,data:{event:e,funcionariosList:this.funcionariosList}}),this.ref.onClose.pipe((0,d.R)(this.destroy$)).subscribe({next:()=>this.getAPIfuncionariosDatas()})):this.handleViewFuncionarioAction(e)}handleOpenSidebar(){this.sidebarVisible=!this.sidebarVisible}handleDeleteFuncionarioAction(e){e&&this.confirmationService.confirm({message:`Deseja realmente deletar o funcionario ${e?.nome}?`,header:"Confirma\xe7\xe3o de exclus\xe3o",icon:"pi pi-exclamation-triangle",acceptLabel:"Sim",rejectLabel:"N\xe3o",accept:()=>this.deleteFuncionario(e?.func_id)})}handleViewFuncionarioAction(e){e&&this.funcionarioService.findById(e?.id).pipe((0,d.R)(this.destroy$)).subscribe({next:i=>{i&&(this.ref=this.dialogService.open(X,{header:e?.action,width:"70%",contentStyle:{overflow:"auto"},baseZIndex:1e4,maximizable:!0,data:{funcionario:i}}),this.ref.onClose.pipe((0,d.R)(this.destroy$)).subscribe({next:()=>this.getAPIfuncionariosDatas()}))},error(i){console.log(i)}})}deleteFuncionario(e){e&&this.funcionarioService.delete(e).pipe((0,d.R)(this.destroy$)).subscribe({next:i=>{this.getAPIfuncionariosDatas(),this.messageService.add({severity:"success",summary:"Sucesso",detail:"Funcionario Excluido com sucesso!",life:2500})},error:i=>{console.log(i),this.messageService.add({severity:"error",summary:"Erro",detail:`Erro ao excluir funcionario ${i.error.error}`,life:3500})}})}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete()}static#o=this.\u0275fac=function(i){return new(i||r)(o.Y36(E),o.Y36(b),o.Y36(F.F0),o.Y36(h.ez),o.Y36(h.YP),o.Y36(m.xA))};static#e=this.\u0275cmp=o.Xpm({type:r,selectors:[["app-funcionarios-home"]],decls:4,vars:5,consts:[[3,"openSidebarEvent"],[3,"sidebarVisible"],[3,"funcionarios","clienteEvent","deleteClientEvent"]],template:function(i,t){1&i&&(o.TgZ(0,"app-toolbar",0),o.NdJ("openSidebarEvent",function(){return t.handleOpenSidebar()}),o.qZA(),o._UZ(1,"app-side-bar",1),o.TgZ(2,"app-funcionarios-table",2),o.NdJ("clienteEvent",function(c){return t.handleFuncionariotAction(c)})("deleteClientEvent",function(c){return t.handleDeleteFuncionarioAction(c)}),o.qZA(),o._UZ(3,"p-confirmDialog")),2&i&&(o.xp6(1),o.Q6J("sidebarVisible",t.sidebarVisible),o.xp6(1),o.Q6J("funcionarios",t.funcionariosList),o.xp6(1),o.Akn(o.DdM(4,co)))},dependencies:[oo.n,eo.P,Z.Q,so]})}return r})()}];var lo=s(6208);let po=(()=>{class r{static#o=this.\u0275fac=function(i){return new(i||r)};static#e=this.\u0275mod=o.oAB({type:r});static#t=this.\u0275inj=o.cJS({providers:[m.xA,h.YP,p.uU],imports:[p.ez,a.u5,a.UX,F.Bz.forChild(uo),lo.m,g.JF,x.d,T.cc,v.hJ,_.U$,w.zz,N.Iu,A.j,P.A,O.L$,m.DL,I.kW,Z.D,y.z]})}return r})()}}]);