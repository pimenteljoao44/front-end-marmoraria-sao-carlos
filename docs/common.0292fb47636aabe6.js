"use strict";(self.webpackChunkmarmoraria_sao_carlos=self.webpackChunkmarmoraria_sao_carlos||[]).push([[592],{2098:(l,h,s)=>{s.d(h,{F:()=>i});var n=s(9862),_=s(553),r=s(4946),p=s(459);let i=(()=>{class e{constructor(t,o){this.httpClient=t,this.cookieService=o,this.baseUrl=_.N.baseUrl,this.JWT_TOKEN=this.cookieService.get("USER_INFO")}get httpOptions(){return{headers:new n.WM({"Content-Type":"application/json",Authorization:`Bearer ${this.JWT_TOKEN}`})}}findAll(){return this.httpClient.get(`${this.baseUrl}/api/cidade`,this.httpOptions)}findById(t){return this.httpClient.get(`${this.baseUrl}/api/cidade/${t}`,this.httpOptions)}create(t){return this.httpClient.post(`${this.baseUrl}/api/cidade`,t,this.httpOptions)}update(t){return this.httpClient.put(`${this.baseUrl}/api/cidade/${t?.cidId}`,t,this.httpOptions)}delete(t){return this.httpClient.delete(`${this.baseUrl}/api/cidade/${t}`,this.httpOptions)}static#t=this.\u0275fac=function(o){return new(o||e)(r.LFG(n.eN),r.LFG(p.N))};static#s=this.\u0275prov=r.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})()},3004:(l,h,s)=>{s.d(h,{s:()=>i});var n=s(9862),_=s(553),r=s(4946),p=s(459);let i=(()=>{class e{constructor(t,o){this.httpClient=t,this.cookieService=o,this.baseUrl=_.N.baseUrl,this.JWT_TOKEN=this.cookieService.get("USER_INFO")}get httpOptions(){return{headers:new n.WM({"Content-Type":"application/json",Authorization:`Bearer ${this.JWT_TOKEN}`})}}findAll(){return this.httpClient.get(`${this.baseUrl}/api/estado`,this.httpOptions)}findById(t){return this.httpClient.get(`${this.baseUrl}/api/estado/${t}`,this.httpOptions)}create(t){return this.httpClient.post(`${this.baseUrl}/api/estado`,t,this.httpOptions)}update(t){return this.httpClient.put(`${this.baseUrl}/api/estado/${t?.id}`,t,this.httpOptions)}delete(t){return this.httpClient.delete(`${this.baseUrl}/api/estado/${t}`,this.httpOptions)}static#t=this.\u0275fac=function(o){return new(o||e)(r.LFG(n.eN),r.LFG(p.N))};static#s=this.\u0275prov=r.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})()},5207:(l,h,s)=>{s.d(h,{m:()=>i});var n=s(9862),_=s(553),r=s(4946),p=s(459);let i=(()=>{class e{constructor(t,o){this.httpClient=t,this.cookieService=o,this.baseUrl=_.N.baseUrl,this.JWT_TOKEN=this.cookieService.get("USER_INFO")}get httpOptions(){return{headers:new n.WM({"Content-Type":"application/json",Authorization:`Bearer ${this.JWT_TOKEN}`})}}findAll(){return this.httpClient.get(`${this.baseUrl}/produto`,this.httpOptions)}findById(t){return this.httpClient.get(`${this.baseUrl}/produto/${t}`,this.httpOptions)}create(t){return this.httpClient.post(`${this.baseUrl}/produto`,t,this.httpOptions)}update(t){return this.httpClient.put(`${this.baseUrl}/produto/${t?.id}`,t,this.httpOptions)}delete(t){return this.httpClient.delete(`${this.baseUrl}/produto/${t}`,this.httpOptions)}static#t=this.\u0275fac=function(o){return new(o||e)(r.LFG(n.eN),r.LFG(p.N))};static#s=this.\u0275prov=r.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})()},6444:(l,h,s)=>{s.d(h,{u:()=>p});var n=s(5619),_=s(8180),r=s(4946);let p=(()=>{class i{constructor(){this.produtoDataEmitter$=new n.X(null),this.produtosDatas=[]}setProdutosDatas(a){a&&this.produtoDataEmitter$.next(a)}getProdutosDataEmitter(){return this.produtoDataEmitter$.asObservable()}getProdutosDatas(){return this.produtoDataEmitter$.pipe((0,_.q)(1)).subscribe({next:a=>{a&&(this.produtosDatas=a)}}),this.produtosDatas}static#t=this.\u0275fac=function(t){return new(t||i)};static#s=this.\u0275prov=r.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})()},3574:(l,h,s)=>{s.d(h,{q:()=>p});var n=s(5619),_=s(8180),r=s(4946);let p=(()=>{class i{constructor(){this.usersDataEmitter$=new n.X(null),this.usersDatas=[]}setUsersDatas(a){a&&(this.usersDataEmitter$.next(a),this.getUsersDatas())}getUsersDatas(){return this.usersDataEmitter$.pipe((0,_.q)(1)).subscribe({next:a=>{a&&(this.usersDatas=a)}}),this.usersDatas}static#t=this.\u0275fac=function(t){return new(t||i)};static#s=this.\u0275prov=r.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})()}}]);