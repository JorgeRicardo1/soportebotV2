import { User } from "../../../shared/interfaces/user.interface"

export interface Caso  {
  ticket: string,
  user : User,
  date : Date,
  resume: string,
  state: {
    enviado : boolean,
    recibido : boolean,
    enRevision : boolean,
    solucionado : boolean
  }
}
