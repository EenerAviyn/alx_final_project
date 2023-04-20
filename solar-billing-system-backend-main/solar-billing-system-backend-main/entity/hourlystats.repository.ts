import { getRepository, Repository } from "typeorm";
import { TransactionEntity } from "./hourlystats.model";
import { TokenEntity } from "./token.model";

export type Transaction = {
    temperature: number,
    current: number,
    lightIntensity: string,
    token: TokenEntity
}

export class TransactionRepository extends Repository<TransactionEntity> {
    private repository

    constructor() {
        super()
        this.repository = getRepository(TransactionEntity)
    }

    async createTransaction (
        transaction: {
            temperature: number,
            current: number,
            lightIntensity: string,
            tokenID: string
        }
    ): Promise<Transaction> {
        const newTransaction = this.repository.create(transaction)
        const savedTransaction = await this.repository.save(newTransaction)
        return schemaToTransaction(savedTransaction)
    }
    
    async getTransaction(period: {
        tokenID?: string,
        from: Date,
        to: Date
    }): Promise<Transaction[]> {
        const transaction = await this.repository
            .createQueryBuilder("transaction")
            .leftJoinAndSelect("transaction.token", "token")
            .where("transaction.createdAt BETWEEN :from AND :to", { from: period.from, to: period.to })
            .andWhere("token.id = :tokenID", { tokenID: period.tokenID })
            .getMany()
        return transaction.map(stat => schemaToTransaction(stat))
    }
}

const schemaToTransaction = (record: TransactionEntity): Transaction => {
    return {
        temperature: record.temperature!,
        current: record.current!,
        lightIntensity: record.lightIntensity!,
        token: record.token!
    }
}

