import { User } from '../../../shared/interfaces/user.interface'


export interface infoEquipo  {
  usuario: User ,
  placa: number,
  ubicacion?: string,
  detalles?: string,
  resumen : string,
  ticket : string
}
