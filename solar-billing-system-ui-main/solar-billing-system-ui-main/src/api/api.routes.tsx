import axios from "axios"

const url: string = "http://127.0.0.1:3055"

export const lipaNaMpesa = async (data: {
    amount: number,
    phoneNumber: string
}): Promise<any> => {
    return (await axios.post(`${url}/transaction`, data)).data
}

export const getTransactionStatus = async (data: {
    requestID: string
}): Promise<any> => {
    return (await axios.get(`${url}/transaction/status`, {
        params: {
            requestID: data.requestID
        }
    })).data
}

export const getToken = async (data: {
    phoneNumber: string
}): Promise<any> => {
    return (await axios.get(`${url}/token/phonenumber`,
        {
            params: {
                phoneNumber: data.phoneNumber
            }
        }
    )).data
}
