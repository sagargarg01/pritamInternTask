import React, { useContext } from 'react'
import GoogleLogin from 'react-google-login'
import { authContext } from '../../../context/Auth'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

function LoginWithGoogle({ onClose, text }) {
  let { auth, setAuth } = useContext(authContext)
  let history = useHistory()

  const handleSignIn = async (info) => {
    console.log(info)
    let { data } = await axios.post('/user/googlesignup', {
      token: info.tokenId,
    })
    console.log('RESPONSE', data)
    if (data.success) {
      console.log(data.data)
      await setAuth({
        user: data.data,
        authenticated: true,
      })
      onClose()
      history.push('/profile')
    }
  }

  return (
    <div>
      <GoogleLogin
        clientId='619709385260-6olepqg4hu4h2pf39petabe1t5qg58fs.apps.googleusercontent.com'
        buttonText={text}
        onSuccess={handleSignIn}
        onFailure={handleSignIn}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  )
}

export default LoginWithGoogle
