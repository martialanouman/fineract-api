import { IsNumber, IsString } from 'class-validator'
import { IRepayment } from '../interfaces/repayment.interface'

export class RepaymentDto implements IRepayment {
  @IsString()
  transactionDate: string

  @IsNumber()
  transactionAmount: number

  @IsString()
  externalId: string

  @IsString()
  paymentTypeId: string

  @IsString()
  note: string

  @IsString()
  dateFormat: string

  @IsString()
  locale: string
}
