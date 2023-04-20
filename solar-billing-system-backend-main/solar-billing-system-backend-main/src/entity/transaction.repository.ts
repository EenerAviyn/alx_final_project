import { getRepository, Repository } from "typeorm";
import { TransactionEntity } from "./transaction.model";

export type Transaction = {
    amount: number;
    phoneNumber: string;
    requestID: string;
    transactionCode: string;
    mpesaResponse: {[key: string]: any};
    status: TransactionStatus;
}

export type TransactionStatus = 'pending' | 'success' | 'failed'

export class TransactionRepository extends Repository<TransactionEntity> {
    private repository

    constructor() {
        super()
        this.repository = getRepository(TransactionEntity)
    }

    async createTransaction (
        transaction: {
            amount: number,
            phoneNumber: string,
            status: TransactionStatus,
            requestID: string
        }
    ): Promise<Transaction> {
        const newTransaction = this.repository.create(transaction)
        const savedTransaction = await this.repository.save(newTransaction)
        return schemaToTransaction(savedTransaction)
    }

    async updateTransaction (
        id: string,
        transaction: {
            transactionCode: string,
            mpesaResponse: {[key: string]: any},
            status: TransactionStatus
        }
    ): Promise<Transaction> {
        const updatedTransaction = await this.repository.update(id, transaction)
        return schemaToTransaction(updatedTransaction)
    }

    async findByRequestID(requestID: string): Promise<TransactionEntity> {
        const transaction = await this.repository.findOne({
            where: {
                requestID: requestID
            }
        })
        return transaction
    }
    
    async getTransaction(tx: {
        id?: string,
        phoneNumber?: string,
        transactionCode?: string
    }): Promise<Transaction> {
        const transaction = await this.repository.findOne({
            where: [
                { id: tx.id },
                { phoneNumber: tx.phoneNumber },
                { transactionCode: tx.transactionCode }
            ],
            order: {
                createdAt: 'DESC'
            }
        })

        return schemaToTransaction(transaction)
    }
}

export const schemaToTransaction = (record: TransactionEntity): Transaction => {
    return {
        amount: record.amount!,
        phoneNumber: record.phoneNumber!,
        requestID: record.requestID!,
        transactionCode: record.transactionCode!,
        mpesaResponse: record.mpesaResponse!,
        status: record.status!
    }
}

