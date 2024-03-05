import { Test, TestingModule } from '@nestjs/testing'
import { LoanApplicationDto } from './dto/loan-application.dto'
import { RepaymentDto } from './dto/repayment.dto'
import { IFineractError } from './interfaces/fineract-error.interface'
import { LoansController } from './loans.controller'
import { LoansService } from './loans.service'

vi.mock('./loans.service', () => {
  const LoansService = vi.fn()
  LoansService.prototype.createLoanApplication = vi.fn()
  LoansService.prototype.createRepayment = vi.fn()

  return { LoansService }
})

describe('LoansController', () => {
  let controller: LoansController
  let service: LoansService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoansController],
      providers: [LoansService],
    }).compile()

    controller = module.get<LoansController>(LoansController)
    service = module.get<LoansService>(LoansService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('createLoanApplication', () => {
    it('should create a new loan application', async () => {
      const loanApplication = {
        clientId: 1,
        productId: 1,
        principal: 1000,
      } as LoanApplicationDto

      const response = { status: 'ok', errors: [] }

      vi.mocked(service).createLoanApplication.mockResolvedValue({
        status: 'ok',
        errors: [],
      })

      const result = await controller.createLoanApplication(loanApplication)

      expect(result).toStrictEqual(response)
      expect(service.createLoanApplication).toHaveBeenCalledWith(
        loanApplication,
      )
    })

    it('should return an error if the loan application fails', async () => {
      const loanApplication = {
        clientId: 1,
        productId: 1,
        principal: 1000,
      } as LoanApplicationDto

      const errors: IFineractError = {
        defaultUserMessage: 'Failed to create loan',
        developerMessage: 'Failed to create loan',
        userMessageGlobalisationCode:
          'error.msg.loan.with.externalId.already.used',
        httpStatusCode: '400',
        errors: [
          {
            args: [],
            developerMessage: 'Failed to create loan',
            defaultUserMessage: 'Failed to create loan',
            parameterName: 'id',
            userMessageGlobalisationCode:
              'error.msg.loan.with.externalId.already.used',
          },
        ],
      }

      const response = {
        status: 'error',
        errors,
      }

      vi.mocked(service).createLoanApplication.mockRejectedValueOnce(
        new Error(undefined, { cause: response }),
      )

      const result = await controller.createLoanApplication(loanApplication)

      expect(result).toStrictEqual(response)
    })
  })

  describe('create repayment', () => {
    it('should create a new repayment', async () => {
      const repayment: RepaymentDto = {
        dateFormat: 'dd-MM-yyyy',
        locale: 'en',
        transactionAmount: 100,
        externalId: '1',
        note: 'Repayment',
        paymentTypeId: '',
        transactionDate: '01-01-2021',
      }

      const loanId = 1
      const response = { status: 'ok', errors: [] }

      vi.mocked(service).createRepayment.mockResolvedValue({
        status: 'ok',
        errors: [],
      })

      const result = await controller.createRepayment(loanId, repayment)

      expect(result).toStrictEqual(response)
      expect(service.createRepayment).toHaveBeenCalledWith(loanId, repayment)
    })

    it('should return an error if the repayment fails', async () => {
      const badRepayment = {} as RepaymentDto

      const loanId = 1

      const errors: IFineractError = {
        defaultUserMessage: 'Failed to create repayment',
        developerMessage: 'Failed to create repayment',
        userMessageGlobalisationCode:
          'error.msg.loan.with.externalId.already.used',
        httpStatusCode: '400',
        errors: [
          {
            args: [],
            developerMessage: 'Failed to create repayment',
            defaultUserMessage: 'Failed to create repayment',
            parameterName: 'id',
            userMessageGlobalisationCode:
              'error.msg.loan.with.externalId.already.used',
          },
        ],
      }

      const response = {
        status: 'error',
        errors,
      }

      vi.mocked(service).createRepayment.mockRejectedValueOnce(
        new Error(undefined, { cause: response }),
      )

      const result = await controller.createRepayment(loanId, badRepayment)

      expect(result).toStrictEqual(response)
    })
  })
})
