export interface ILoanApplication {
  amortizationType: number
  clientId: number
  dateFormat: string
  expectedDisbursementDate: string
  externalId: string
  interestCalculationPeriodType: number
  interestRatePerPeriod: number
  interestType: number
  loanTermFrequency: number
  locale: string
  loanTermFrequencyType: number
  loanType: string
  numberOfRepayments: number
  principal: number
  productId: number
  repaymentEvery: number
  repaymentFrequencyType: number
  repaymentsStartingFromDate: string
  submittedOnDate: string
  transactionProcessingStrategyCode: string
}
