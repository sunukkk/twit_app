import React, { useState } from 'react'
import {authService} from 'fbase'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import 'styles/authForm.scss'

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true); // true 회원가입, false 로그인
  const [error, setError] = useState('');

  
const onChange = (e) => {
  const {target:{name, value}} = e;
  if(name ==='email'){
    setEmail(value);
  }else if(name === 'password'){
    setPassword(value)
  }
} 

const onSubmit = async (e) => {
  e.preventDefault();

  try{
    let data;
    if(newAccount){
      //회원가입
      data = await createUserWithEmailAndPassword(authService, email, password);
    } else {
      data = await signInWithEmailAndPassword(authService, email, password);
    }
    console.log(data);
  } catch(error) {
      console.log('error->', error);
      setError(error.message)
  }

}

const toggleAccount = () => setNewAccount(prev => !prev)


  return (
    <>
      <form onSubmit={onSubmit} className='container'>
        <input name="email" type="email" placeholder = "Email" required value={email} onChange={onChange} className='authInput'/>
        <input name="password" type="password" placeholder = "Password" required value={password} onChange={onChange} className='authInput'/>
        <input type="submit" value = {newAccount ? "Create Account" : "Log In"} className='authInput authSubmit' />
        {error && <span className='authError'>{error}</span>}
      </form>
      <span onClick={toggleAccount} className='authSwitch'>
        {newAccount ? "Sign In" : "Create Account" }
      </span>
    </>
  )
}

export default AuthForm