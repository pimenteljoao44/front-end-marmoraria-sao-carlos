import { Cidade } from "../cidade/Cidade";

export interface Estado {
  id?:any;
  nome:string;
  sigla:string;
  cidades?:Array<Cidade>;
}
