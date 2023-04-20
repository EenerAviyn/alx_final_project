import React, {  useRef, useState } from 'react';
import './App.css';
import * as api from './api/api.routes';
import { Alert } from './components/alert';

const App = (): JSX.Element => {
  const [displayError, setErrorState] = useState(false)
  const [displaySuccess, setSuccessState] = useState(false)
  const [token, setTokenState] = useState('')

  const requestIDRef = useRef('')
  const tokenRef = useRef('')

  const submitForm = async (e: any): Promise<void> => {
    e.preventDefault();
    const amount: number = Number((document.getElementById('amount') as HTMLInputElement).value);
    const phoneNumber: string = (document.getElementById('phoneNumber') as HTMLInputElement).value;
    const data = {
      amount,
      phoneNumber
    }

    const transaction = await api.lipaNaMpesa(data);
    console.log(transaction);
    if (transaction.success === false) {
      setErrorState(true)
    } else {
      console.log(transaction.data.requestID)
      requestIDRef.current = transaction.data.requestID
      setSuccessState(true)
      setTimeout(() => {
        setSuccessState(false)
      }, 10000)
      if(!displayError) {
        let count = 0;
        const interval = setInterval(async () => {
          const transactionStatus = await api.getTransactionStatus({ requestID: requestIDRef.current })
          count++;
          if (transactionStatus.data.status === 'success') {
            const token = await api.getToken({ phoneNumber })
            console.log(token, 'token')
            if(token.data.token.length > 0) {
              tokenRef.current = token.data.token
              setTokenState(token.data.token)
            } else {
              setErrorState(true)
            }
            clearInterval(interval)
          } else if (transactionStatus.data.status === 'failed') {
            clearInterval(interval)
            setErrorState(true)
          }
          if(count >= 10) {
            clearInterval(interval)
            setErrorState(true)
          }
        }, 5000)
      }
    }  
    setTokenState(tokenRef.current) 
  }

  return (
    <div className="App">
        <div className="title">
          Charging Station
        </div>
        <form onSubmit={submitForm}>
            <div className="input-group">
                <label>
                  Amount:
                  <input type="text" id="amount" name="amount" placeholder="1000" required />
                </label>
            </div>
            <div className="input-group">
              <label>
                Phone number:
                <input type="text" id="phoneNumber" name="phoneNumber" placeholder="254701010101" required />
              </label>
            </div>
            <div className="submit-group">
                <input type="submit" value="Submit" /> 
            </div>
        </form>
        { displaySuccess && (
          <Alert message="Enter your pin on your phone to complete transaction" type="success" />
        )}
        { displayError && (
          <Alert message="Something went wrong. Please restart transaction" type="failed" />
        )}
        { token.length > 0 && (
          <Alert message={`Your token is ${token}, Enter it on the charging station to start chaging`} type="success" />
        )}
    </div>
  );
}



export default App;
