import { Status } from 'src/models/enums/os/Status';
import { Prioridade } from './../../enums/os/Prioridade';
import { Cliente } from '../cliente/Cliente';
import { Produto } from '../produto/Produto';
import { Servico } from '../servico/Servico';
export interface OrdemDeServico {
  id?:any;
  dataAbertura?: string;
  dataFechamento?: string;
  prioridade:Prioridade;
  status:Status;
  funcionario:number;
  cliente:Cliente,
  observacoes?:string;
  descricao?:string;
  valorTotal:number;
  desconto:number;
  produtos:Array<Produto>;
  servicos:Array<Servico>
}
