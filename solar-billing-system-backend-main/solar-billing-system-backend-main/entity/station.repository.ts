import { getRepository, Repository } from "typeorm"
import { TokenEntity } from "./token.model"

export type Token = {
  name: string,
  city: string,
  coordinates: {
    longitude: number
    latitude: number
  }
}

export class TokenRepository extends Repository<TokenEntity> {
  private repository

  constructor() {
    super()
    this.repository = getRepository(TokenEntity)
  }

  async createToken (
    token: {
      name: string,
      city: string,
      coordinates: {
        longitude: number
        latitude: number
      }
    }
  ): Promise<Token> {
    const newToken = this.repository.create(token)
    const savedToken = await this.repository.save(newToken)
    return schemaToToken(savedToken)
  }

  async getToken(id: string): Promise<Token> {
    const token = await this.repository.findOne({
      where: {
        id: id
      }
    })
    return schemaToToken(token)
  }
}

const schemaToToken = (record: TokenEntity): Token => {
  return {
    name: record.name!,
    city: record.city!,
    coordinates: {
      longitude: record.coordinates?.longitude,
      latitude: record.coordinates?.latitude
    }
  }
}
