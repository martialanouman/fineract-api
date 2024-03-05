import { IFineractError } from './fineract-error.interface'

export interface IFineractResponse {
  status: 'ok' | 'error'
  statusCode?: number
  error: IFineractError | null
}
