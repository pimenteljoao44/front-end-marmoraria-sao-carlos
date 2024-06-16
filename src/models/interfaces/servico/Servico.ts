import { Funcionario } from "../funcionario/Funcionario";
import { OrdemDeServico } from "../os/OrdemDeServico";

export interface Servico {
  id?:any;
  descricao:string;
  valor:number;
  quantidade:number;
  ordensDeServico:Array<OrdemDeServico>;
  funcionario:Funcionario;
}
