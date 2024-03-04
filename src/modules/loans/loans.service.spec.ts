import { HttpService } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { type AxiosResponse } from 'axios'
import { of, throwError } from 'rxjs'
import { type ILoanApplication } from './interfaces/loan-application.interface'
import { LoansService } from './loans.service'

vi.mock('@nestjs/axios')

describe('LoansService', () => {
  let service: LoansService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoansService],
    })
      .useMocker((token) => {
        if (token === HttpService) {
          const MockHttpService = vi.mocked(HttpService)
          return new MockHttpService()
        }
      })
      .compile()

    service = module.get<LoansService>(LoansService)
    httpService = module.get<HttpService>(HttpService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create a new load application', async () => {
    it('should create a new loan application', async () => {
      const loanApplication: ILoanApplication = {
        amortizationType: 1,
        clientId: 1,
        dateFormat: 'dd-MM-yyyy',
        expectedDisbursementDate: '04-03-2024',
        externalId: '786444UUUYYH7',
        interestCalculationPeriodType: 1,
        interestRatePerPeriod: 12,
        interestType: 0,
        loanTermFrequency: 3,
        locale: 'en_US',
        loanTermFrequencyType: 2,
        loanType: 'individual',
        numberOfRepayments: 3,
        principal: 1000,
        productId: 1,
        repaymentEvery: 1,
        repaymentFrequencyType: 2,
        repaymentsStartingFromDate: '04-04-2024',
        submittedOnDate: '04-03-2024',
        transactionProcessingStrategyCode: 'mifos-standard-strategy',
      }
      const url = 'https://localhost:8443/fineract-provider/api/v1/loans'

      vi.mocked(httpService.post).mockReturnValueOnce(
        of({
          status: 200,
          data: { clientId: 1, loanId: 1 },
        } as AxiosResponse),
      )

      const result = await service.createLoanApplication(loanApplication)

      expect(result.status).toBe('ok')
      expect(result.errors.length).toBe(0)

      expect(httpService.post).toHaveBeenCalledOnce()
      expect(httpService.post).toHaveBeenCalledWith(url, loanApplication)
    })
  })

  it('should return an error message when the loan application fails', async () => {
    const badLoanApplication = {} as ILoanApplication

    const errorMessage = 'Invalid loan application'
    const statusCode = 400

    vi.mocked(httpService.post).mockReturnValueOnce(
      throwError(() => ({
        response: {
          status: statusCode,
          data: {
            httpStatusCode: statusCode,
            developerMessage: errorMessage,
            defaultUserMessage: errorMessage,
            errors: [
              {
                developerMessage: 'Loan with externalId is already registered.',
                defaultUserMessage:
                  'Loan with externalId is already registered.',
                userMessageGlobalisationCode:
                  'error.msg.loan.with.externalId.already.used',
                parameterName: 'id',
                args: [],
              },
            ],
          },
        },
      })),
    )

    const result = await service.createLoanApplication(badLoanApplication)

    expect(result.status).toBe('error')
    expect(result.errors.length).toBe(1)
    expect(result.statusCode).toBe(statusCode)
  })
})
