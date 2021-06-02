import React, { useContext, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { authContext } from './context/Auth'
import axios from 'axios'
import Header from './components/Header/Header'
import UserProfile from './components/Profile/UserProfile'
import ProfileUser from './components/Profile/Profile'
import EmailVerification from './components/Verification/EmailVerification'
import Loader from './components/Loader/Loader'
import LandingPage from './components/LnadingPage/LandingPage'

function App() {
  let { auth, setAuth, setLoad, globalLoading } = useContext(authContext)

  useEffect(() => {
    const refreshUser = async () => {
      try {
        var config = {
          method: 'get',
          url: '/user/me',
        }

        let response = await axios(config)
        console.log(response)
        if (response.data.success) {
          await setAuth({
            user: response.data.data,
            authenticated: true,
          })
          setLoad(false)
        }
      } catch (err) {
        console.log('e', err)
        setLoad(false)
      }
    }
    refreshUser()
  }, [])

  return (
    <>
      {!globalLoading ? (
        <Router>
          <Switch>
            <div>
              <Header />
              <Route exact path='/' component={LandingPage} />
              <Route exact path='/profile' component={UserProfile} />
              {/* <Route exact path='/profile' component={ProfileUser} /> */}
              <Route
                exact
                path='/verification/:id'
                component={EmailVerification}
              />
            </div>
          </Switch>
        </Router>
      ) : (
        <Loader />
      )}
    </>
  )
}

export default App
