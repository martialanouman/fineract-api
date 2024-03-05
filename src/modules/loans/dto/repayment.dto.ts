import { IsNumber, IsOptional, IsString } from 'class-validator'
import { IRepayment } from '../interfaces/repayment.interface'

export class RepaymentDto implements IRepayment {
  @IsString()
  transactionDate: string

  @IsNumber()
  transactionAmount: number

  @IsString()
  @IsOptional()
  externalId: string

  @IsString()
  @IsOptional()
  paymentTypeId: string

  @IsString()
  @IsOptional()
  note: string

  @IsString()
  dateFormat: string

  @IsString()
  locale: string
}
