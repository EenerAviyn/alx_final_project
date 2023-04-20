import {NextFunction, Request, Response} from "express"
import { schemaToTransaction, Transaction, TransactionRepository } from "../../entity/transaction.repository"
import * as _ from "lodash"
import { MpesaApi } from "../../services/mpesaApi"
import { Token, TokenRepository } from "../../entity/token.repository"
import { TransactionEntity } from "../../entity/transaction.model"

export interface MpesaResponse {
    Body: {
        stkCallback: {
            MerchantRequestID: string
            CheckoutRequestID: string
            ResultCode: number
            ResultDesc: string
            CallbackMetadata?:  {
                Item: {
                    Name: string
                    Value: string | number
                }[]
            }
        }
    }
}

export class TransactionController {
    private transactionRepository: TransactionRepository
    private tokenRepository: TokenRepository
    private mpesaApi: MpesaApi

    constructor() {
        this.transactionRepository = new TransactionRepository()
        this.tokenRepository = new TokenRepository()
        this.mpesaApi = new MpesaApi()
    }

    async create(request: Request, response: Response, next: NextFunction): Promise<{
        success: boolean,
        message: string,
        data: Transaction
    }> {
        try{
            const tx = await this.mpesaApi.initiateTransaction({
                amount: request.body.amount,
                phoneNumber: request.body.phoneNumber,
            })

            if(!tx){
                return {
                    success: false,
                    message: 'Transaction failed',
                    data: tx
                }
            }

            if(tx.ResponseCode !== '0'){
                return {
                    success: false,
                    message: tx.ResponseDescription,
                    data: tx
                }
            }

            const transaction = await this.transactionRepository.createTransaction({
                amount: request.body.amount,
                phoneNumber: request.body.phoneNumber,
                status: 'pending',
                requestID: tx.CheckoutRequestID,
            })
            
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

    async getStatus(request: Request, response: Response, next: NextFunction): Promise<{
        success: boolean,
        message: string,
        data: Transaction
    }> {
        try{
            const transaction = await this.transactionRepository.findByRequestID(request.query.requestID as string)
            if(!transaction){
                return {
                    success: false,
                    message: 'Transaction not found',
                    data: null
                }
            }

            return {
                success: true,
                message: 'Transaction successful',
                data: schemaToTransaction(transaction)
            }
        } catch (error) {
            return {
                success: false,
                message: `Transaction status fetch failed: ${error}`,
                data: null
            }
        }
    }

    async get(request: Request, response: Response, next: NextFunction): Promise<{
        success: boolean,
        message: string,
        data: Transaction
    }> {
        try{
            const transaction = await this.transactionRepository.getTransaction({
                id: request.params.id as string || null,
                transactionCode: request.query.transactionCode as string || null,
                phoneNumber: request.query.phoneNumber as string || null
            })
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

    async lipaNaMpesaCallback(request: Request, response: Response, next: NextFunction): Promise<{
        success: boolean,
        message: string,
        data: Token
    }> {
        const res: MpesaResponse = request.body
        try{
            const tx: TransactionEntity = await this.transactionRepository.findByRequestID(res.Body.stkCallback.CheckoutRequestID)

            if(res.Body.stkCallback.ResultCode !== 0){
                await this.transactionRepository.updateTransaction(
                    tx.id, {
                    status: 'failed',
                    transactionCode: '',
                    mpesaResponse: res.Body.stkCallback
                })
                return {
                    success: false,
                    message: res.Body.stkCallback.ResultDesc,
                    data: null
                }
            }

            await this.transactionRepository.updateTransaction(
                tx.id, {
                transactionCode: res.Body.stkCallback.CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber').Value.toString(),
                mpesaResponse: res.Body.stkCallback,
                status: 'success'
            })

            const token = await this.tokenRepository.createToken({
                token: _.random(1000000000, 9999999999).toString(),
                tokenAmount: tx.amount,
                transactionID: tx.id,
            })

            return {
                success: true,
                message: 'Lipa na mpesa callback received, token generated',
                data: token
            }
        } catch (error) {
            return {
                success: false,
                message: `Lipa na mpesa callback failed with error: ${error}`,
                data: null
            }
        }
    }
}
