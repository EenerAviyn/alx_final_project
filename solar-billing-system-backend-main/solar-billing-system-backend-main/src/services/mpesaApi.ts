import axios from 'axios'
import * as moment from 'moment'
require('dotenv').config()

export class MpesaApi {
    private async getOAuthToken(): Promise<string> {
        const consumerKey: string = process.env.consumer_key
        const consumerSecret: string = process.env.consumer_secret
        const url: string = process.env.oauth_token_url
        const buffer: Buffer = Buffer.from(`${consumerKey}:${consumerSecret}`)
        const auth = `Basic ${buffer.toString('base64')}`
        try{
            const res = await axios.get(url,{
                headers: {
                    Authorization: auth,
                    'accept-encoding': '*'
                }
            })
            return res.data.access_token
        }catch(err){
            return null
        }
    }

    async initiateTransaction ({
        amount,
        phoneNumber
    }): Promise<any> {
        const token: string = await this.getOAuthToken()
        const auth: string = `Bearer ${token}`
        const timestamp: string = moment.utc().format('YYYYMMDDHHmmss')
        const url: string = process.env.lipa_na_mpesa_url
        const bsShortCode: string = process.env.lipa_na_mpesa_shortcode
        const passkey: string = process.env.lipa_na_mpesa_passkey
        const password: string = Buffer.from(`${bsShortCode}${passkey}${timestamp}`).toString('base64')
        const transactionType = 'CustomerPayBillOnline'
        const partyA = phoneNumber 
        const partyB = process.env.lipa_na_mpesa_shortcode
        const callBackUrl = process.env.lipa_na_mpesa_callback_url
        const accountReference = 'charging-station-test-ref'
        const transaction_desc = 'Charging Station Test'

        try {
            const res = (await axios.post(url,{
                BusinessShortCode: bsShortCode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: transactionType,
                Amount: amount,
                PartyA: partyA,
                PartyB: partyB,
                PhoneNumber: phoneNumber,
                CallBackURL: callBackUrl,
                AccountReference: accountReference,
                TransactionDesc: transaction_desc
            },{
                headers:{
                    Authorization: auth,
                    'accept-encoding': '*'
                }
            })).data

            return res
        }catch(err){
            return null
        }
    }
}
