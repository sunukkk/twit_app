import React, { useState } from 'react'
import {authService} from 'fbase'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import 'styles/auth.scss'
import AuthForm from 'components/AuthForm';



function Auth() {



const onSocialClick = async (e) => {

  let provider
  const {target:{name}} = e
  if(name === "google"){
    provider = new GoogleAuthProvider();

  }else if(name === "github"){
    provider = new GithubAuthProvider();

  }
  const data = await signInWithPopup(authService, provider)
  console.log('data ->',data)
}

  return (
    <div className='authContainer'>
      <FontAwesomeIcon icon = "fa-brands fa-twitter" size="10x" color={"#04aaff"} style={{marginBottom:30}}/>
      <AuthForm />
      <div className='authBtns'>
        <button className='authBtn' name="google" onClick={onSocialClick}>Continue with Google <FontAwesomeIcon icon = "fa-brands fa-google" /></button>
        <button className='authBtn' name="github" onClick={onSocialClick}>Continue with GitHub <FontAwesomeIcon icon = "fa-brands fa-github" /></button>
      </div>
    </div>
  )
}

export default Auth