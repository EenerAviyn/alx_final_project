import { getRepository, Repository } from "typeorm"
import { TokenEntity } from "./token.model"
import { TransactionEntity } from "./transaction.model"
import { schemaToTransaction, Transaction } from "./transaction.repository"

export type Token = {
  token: string
  tokenAmount: number
  isUsed: boolean
  transaction: Transaction
}

export class TokenRepository extends Repository<TokenEntity> {
  private repository

  constructor() {
    super()
    this.repository = getRepository(TokenEntity)
  }

  async createToken (
    token: {
      token: string,
      tokenAmount: number,
      transactionID: string
    }
  ): Promise<Token> {
    const transaction = await getRepository(TransactionEntity).findOne({
      where: { id: token.transactionID }
    })
    const newToken = this.repository.create({
      token: token.token,
      tokenAmount: token.tokenAmount,
      transaction: transaction
    })
    const savedToken = await this.repository.save(newToken)
    return schemaToToken(savedToken)
  }

  async updateToken (
    token: {
      token: string,
      isUsed: boolean
    }
  ): Promise<Token> {
    const tok = await this.repository.findOne({
      where: {
        token: token.token
      }
    })
    await this.repository.update(tok.id, token)
    const updatedToken =  await this.repository
      .createQueryBuilder("token")
      .leftJoinAndSelect("token.transaction", "transaction")
      .where("token.token = :token", { token: token.token })
      .getOne()
    return schemaToToken(updatedToken)
  }

  async getToken(token: string): Promise<Token> {
    const res = await this.repository
      .createQueryBuilder("token")
      .leftJoinAndSelect("token.transaction", "transaction")
      .where("token.token = :token", { token })
      .getOne()
      
    return schemaToToken(res)
  }

  async getTokenByPhoneNumber(phoneNumber: string): Promise<Token> {
    const res = await this.repository
      .createQueryBuilder("token")
      .leftJoinAndSelect("token.transaction", "transaction")
      .where("transaction.phoneNumber = :phoneNumber", { phoneNumber })
      .andWhere("token.isUsed = :isUsed", { isUsed: false })
      .getOne()
    return schemaToToken(res)
  }
}

export const schemaToToken = (record: TokenEntity): Token => {
  return {
    token: record.token!,
    tokenAmount: record.tokenAmount!,
    isUsed: record.isUsed!,
    transaction: schemaToTransaction(record.transaction!)
  }
}
