import {NextFunction, Request, Response} from "express";
import { Transaction, TransactionRepository } from "../../entity/hourlystats.repository";
import * as moment from "moment";

export class TransactionController {
  private transactionRepository = new TransactionRepository()

  async create(request: Request, response: Response, next: NextFunction): Promise<{
    success: boolean,
    message: string,
    data: Transaction
  }> {
    try{
        const transaction = await this.transactionRepository.createTransaction({
            temperature: request.body.temperature,
            current: request.body.current,
            lightIntensity: request.body.lightIntensity,
            tokenID: request.body.tokenID
        });
        return {
            success: true,
            message: "Transaction created successfully",
            data: transaction
        }
    } catch (error) {
        return {
            success: false,
            message: `Transaction creation failed: ${error}`,
            data: null
        }
    }
}

    async get(request: Request, response: Response, next: NextFunction): Promise<{
        success: boolean,
        message: string,
        data: Transaction[]
    }> {
        try{
            const transaction = await this.transactionRepository.getTransaction({
                tokenID: request.query.tokenID as string,
                from: moment.utc(request.query.from as string).subtract(3, "hours").toDate(),
                to: moment.utc(request.query.to as string).subtract(3, "hours").toDate(),
            });
            return {
                success: true,
                message: "Transaction fetched successfully",
                data: transaction
            }
        } catch (error) {
            return {
                success: false,
                message: `Transaction fetch failed with error: ${error}`,
                data: null
            }
        }
    }
}
