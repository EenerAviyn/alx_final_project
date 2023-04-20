import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {TokenEntity} from "../../entity/token.model";
import { Token, TokenRepository } from "../../entity/token.repository";

export class TokenController {
  private TokenRepository = new TokenRepository()

  async create(request: Request, response: Response, next: NextFunction): Promise<{
    success: boolean,
    message: string,
    data: Token
  }> {
        try{
            const token = await this.TokenRepository.createToken({
                name: request.body.name,
                city: request.body.city,
                coordinates: {
                    longitude: request.body.coordinates.longitude,
                    latitude: request.body.coordinates.latitude
                }
            });
            return {
                success: true,
                message: "Token created successfully",
                data: token
            }
        } catch (error) {
            return {
                success: false,
                message: `Token creation failed: ${error}`,
                data: null
            }
        }
    }

    async get(request: Request, response: Response, next: NextFunction): Promise<{
        success: boolean,
        message: string,
        data: Token
    }> {
        try{
            const token = await this.TokenRepository.getToken(request.params.id as string);
            return {
                success: true,
                message: "Token fetched successfully",
                data: token
            }
        } catch (error) {
            return {
                success: false,
                message: `Token fetch failed: ${error}`,
                data: null
            }
        }
    }
}
