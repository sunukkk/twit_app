import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'



function Navigation({userObj}) {
  console.log("userObj -->", userObj)
  return (
    <nav>
      <ul style={{display: "flex", justifyContent: "center", marginTop:50}}>
        <li>
          <Link to={'/'} style = {{ marginRight: 10 }}>
            <FontAwesomeIcon icon="fa-brands fa-twitter" size = '2x' color = {"#04aaff"}/>
          </Link>
        </li>

        <li>
          <Link to={'/profile'} style = {{display: "flex", flexDirection: "column"}}>
            <FontAwesomeIcon icon = "fa-solid fa-user" size = '2x' color = {"#04aaff"}/>
            <span style = {{ marginTop: 10 }}>
              {userObj.displayName ? `${userObj.displayName}의 Profile` : "Profile"}</span>
          </Link>
        </li>

      </ul>
      <img src={userObj.photoURL} width="100" height="100" alt="" style={{display: "block", margin: "0 auto", marginTop: 10}}/>
    </nav>
  )
}

export default Navigation