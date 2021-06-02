import { Snackbar } from '@material-ui/core'
import react, { createContext, useState } from 'react'

export const authContext = createContext({})

const AuthProvider = ({ children }) => {
  const [auth, setAuthData] = useState({
    user: null,
    authenticated: false,
  })

  const [globalLoading, setGloabalLoading] = useState(true)
  const [snack, setSnack] = useState('')

  const setAuth = (data) => {
    setAuthData(data)
  }

  const setLoad = (data) => {
    setGloabalLoading(data)
  }

  return (
    <authContext.Provider
      value={{ auth, setAuth, globalLoading, setLoad, snack, setSnack }}
    >
      {children}

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={Boolean(snack)}
        autoHideDuration={3000}
        onClose={() => setSnack('')}
        message={snack}
        key={snack ? snack : undefined}
      />
    </authContext.Provider>
  )
}

export default AuthProvider
