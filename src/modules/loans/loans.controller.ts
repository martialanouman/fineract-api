import { Controller } from '@nestjs/common'
import { LoanApplicationDto } from './dto/loan-application.dto'
import { LoansService } from './loans.service'

@Controller('loans')
export class LoansController {
  constructor(private service: LoansService) {}

  createLoanApplication(data: LoanApplicationDto) {
    return this.service.createLoanApplication(data).catch((error) => error)
  }
}
