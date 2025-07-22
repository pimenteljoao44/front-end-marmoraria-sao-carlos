import { Funcionario } from "../funcionario/Funcionario";

export interface Usuario {
  id?:any;
  nome:string;
  login:string;
  senha:any;
  email: string;
  nivelAcesso:any;
  token:string;
  funcionario?: Funcionario;
  funcionarioNome?: string;
}
