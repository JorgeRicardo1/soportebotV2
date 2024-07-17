import { User } from "../../../shared/interfaces/user.interface"

export interface Caso  {
  id: number
  subject: string
  authorName: string
  companyName: string
  groupName: string
  priorityName: string
  stateName: string
  registrationDate: string
  solutionDateExpected: string
}
