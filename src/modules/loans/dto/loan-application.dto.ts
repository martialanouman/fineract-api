import { IsNumber, IsString } from 'class-validator'
import { ILoanApplication } from '../interfaces/loan-application.interface'

export class LoanApplication implements ILoanApplication {
  @IsNumber()
  amortizationType: number

  @IsNumber()
  clientId: number

  @IsString()
  dateFormat: string

  @IsString()
  expectedDisbursementDate: string

  @IsString()
  externalId: string

  @IsNumber()
  interestCalculationPeriodType: number

  @IsNumber()
  interestRatePerPeriod: number

  @IsNumber()
  interestType: number

  @IsNumber()
  loanTermFrequency: number

  @IsString()
  locale: string

  @IsNumber()
  loanTermFrequencyType: number

  @IsString()
  loanType: string

  @IsNumber()
  numberOfRepayments: number

  @IsNumber()
  principal: number

  @IsNumber()
  productId: number

  @IsNumber()
  repaymentEvery: number

  @IsNumber()
  repaymentFrequencyType: number

  @IsString()
  repaymentsStartingFromDate: string

  @IsString()
  submittedOnDate: string

  @IsString()
  transactionProcessingStrategyCode: string
}
