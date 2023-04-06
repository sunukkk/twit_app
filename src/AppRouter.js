import Navigation from 'components/Navigation'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from 'routes/Auth'
import Home from 'routes/Home'
import Profiles from 'routes/Profiles'


function AppRouter({ isLoggedIn, userObj }) {

  return (
    <BrowserRouter>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path='/' element = {<Home userObj={userObj} />} />
            <Route path='/profile' element = {<Profiles userObj={userObj}/>} />
          </>
        ) : (
          <Route path='/' element = {<Auth />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter