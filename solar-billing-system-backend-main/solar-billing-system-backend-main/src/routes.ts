import { body, param, query } from "express-validator";
import { TransactionController } from "./controllers/http/transactionController";
import { TokenController } from "../src/controllers/http/tokenController";

export const Routes = [{
  method: "post",
  route: "/transaction",
  controller: TransactionController,
  action: "create",
  validation: [
    body('amount').isNumeric(),
    body('phoneNumber').isMobilePhone('en-KE')
  ],
}, {
  method: "post",
  route: "/transaction/callback",
  controller: TransactionController,
  action: "lipaNaMpesaCallback",
  validation: [],
}, {
  method: "get",
  route: "/transaction",
  controller: TransactionController,
  action: "get",
  validation: [
    query('id').isUUID().optional(),
    query('transactionCode').isString().optional(),
    query('phoneNumber').isMobilePhone('en-KE').optional()
  ],
},  {
  method: "get",
  route: "/transaction/status",
  controller: TransactionController,
  action: "getStatus",
  validation: [
    query('requestID').isString()
  ],
}
 , {
  method: "patch",
  route: "/token/update",
  controller: TokenController,
  action: "update",
  validation: [
    query("token").isString(),
  ],
}, {
  method: "get",
  route: "/token/verify",
  controller: TokenController,
  action: "verify",
  validation: [
    query("token").isString(),
  ],
}, {
  method: "get",
  route: "/token/phoneNumber",
  controller: TokenController,
  action: "getByPhoneNumber",
  validation: [
    query("phoneNumber").isMobilePhone('en-KE'),
  ],
}
];
