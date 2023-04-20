import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {TokenEntity} from "../../entity/token.model";
import { Token, TokenRepository } from "../../entity/token.repository";

export class TokenController {
    private TokenRepository = new TokenRepository()

    async verify(request: Request, response: Response, next: NextFunction): Promise<{
        success: boolean,
        message: string,
        data: Token
    }> {
        try{
            const token = await this.TokenRepository.getToken(request.query.token as string);
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

    async update(request: Request, response: Response, next: NextFunction): Promise<{
        success: boolean,
        message: string,
        data: Token
    }> {
        try{
            const token = await this.TokenRepository.updateToken({
                token: request.query.token as string,
                isUsed: true
            })
            return {
                success: true,
                message: "Token updated successfully",
                data: token
            }
        } catch (error) {
            return {
                success: false,
                message: `Token update failed: ${error}`,
                data: null
            }
        }
    }

    async getByPhoneNumber(request: Request, response: Response, next: NextFunction): Promise<{
        success: boolean,
        message: string,
        data: Token
    }> {
        try{
            const token = await this.TokenRepository.getTokenByPhoneNumber(request.query.phoneNumber as string);
            return {
                success: true,
                message: "Token fetched successfully",
                data: token
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Token fetch failed: ${error}`,
                data: null
            }
        }
    }
}
