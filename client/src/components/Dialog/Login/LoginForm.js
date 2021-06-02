import React, { useState, useContext } from 'react'
import './Login.css'
import TextField from '@material-ui/core/TextField'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import { Button, DialogContentText } from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import LoginWithGoogle from './GoogleLogin'
import { useHistory } from 'react-router'
import { authContext } from '../../../context/Auth'

const useStyles = makeStyles((theme) => ({
  root: {
    '&': {
      width: '100%',
      maxWidth: 390,
    },

    '& .loginInputs': {
      display: 'grid',
      gridRowGap: 24,
    },

    '& .MuiTextField-root': {
      width: '100%',
      maxWidth: 390,

      '& .MuiButtonBase-root': {
        color: 'rgba(0,0,0,0.6)',
      },
    },

    '& .MuiInputLabel-outlined': {
      color: 'rgba(0,0,0,0.6)',
    },

    '& .MuiFormLabel-root.Mui-error': {
      color: '#f44336',
    },

    '& .formFooter': {
      marginTop: 22,
      textAlign: 'center',
      color: 'rgba(0,0,0,0.6)',

      '& .logInButton': {
        width: '100%',
        maxWidth: 392,
        height: 48,
        background: '#017374',
        borderRadius: 4,
        fontWeight: 500,
        fontSize: 14,
        lineHeight: '16px',
        letterSpacing: 1.25,
        textTransform: 'uppercase',
        color: '#FFFFFF',
        boxShadow: 'none',
        margin: '6px 0px',

        [theme.breakpoints.down(1441)]: {
          margin: ' 18px 0px',
        },

        '&:hover': {
          background: '#026363',
        },

        '& .MuiCircularProgress-root': {
          height: '24px !important',
          width: '24px !important',
          color: '#FFFFFF',
        },
      },
    },
  },

  inputStyle: {
    '& > .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#017374',
    },

    '& > .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '',
    },

    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: '#f44336;',
    },
  },

  header: {
    padding: 0,
  },

  formContainer: {
    overflowY: 'visible',
    padding: 0,
    marginTop: 32,
  },
  googleHolder: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
}))

export default function LoginForm({ setShowLoginForm, onClose }) {
  const classes = useStyles()
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailErrorText, setEmailErrorText] = useState('')
  const [passwordErrorText, setPasswordErrorText] = useState('')
  let { auth, setAuth, setSnack } = useContext(authContext)

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/
    if (emailRegex.test(email)) {
      return true
    } else {
      return false
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()

    if (!email) setEmailErrorText('Field cannot be empty')
    if (!password) setPasswordErrorText('Field cannot be empty')

    if (!email || !password) {
      return
    }

    if (!validateEmail(email)) {
      setEmailErrorText('Please enter a valid email!')
      return
    }

    setLoading(true)

    var data = JSON.stringify({ email: email, password: password })
    var config = {
      method: 'post',
      url: '/user/login',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }

    axios(config)
      .then(function (response) {
        if (response.data.success) {
          setAuth({
            user: response.data.data,
            authenticated: true,
          })
        }
        onClose()
        history.push('/profile')
      })
      .catch(function (error) {
        setLoading(false)
        if (error.response.data.verified === false)
          setSnack(error.response.data.message)
        else setEmailErrorText('Incorrect Email/Password')
      })
  }

  const clickHandler = () => {
    let passwordInput = document.getElementById('loginPassword')
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text'
    } else {
      passwordInput.type = 'password'
    }
    passwordInput.focus()
  }

  return (
    <div className='loginFormContainer'>
      <div>
        <DialogTitle id='form-dialog-title' className={classes.header}>
          <div>Log in</div>
        </DialogTitle>
        <DialogContent className={classes.formContainer}>
          <form
            className={classes.root}
            autoComplete='off'
            onSubmit={submitHandler}
            noValidate
          >
            <div className='loginInputs'>
              <div className='inputContainer'>
                <TextField
                  InputLabelProps={{ required: false }}
                  id='loginEmail'
                  label='Email'
                  error={Boolean(emailErrorText)}
                  helperText={emailErrorText}
                  variant='outlined'
                  type='email'
                  value={email}
                  className={classes.inputStyle}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className='inputContainer'>
                <TextField
                  error={Boolean(passwordErrorText)}
                  helperText={passwordErrorText}
                  InputLabelProps={{ required: false }}
                  id='loginPassword'
                  label='Password'
                  variant='outlined'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={classes.inputStyle}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={clickHandler}
                          edge='end'
                        >
                          <Visibility />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>

            <div className='formFooter'>
              <Button type='submit' className='logInButton' variant='contained'>
                {loading ? <CircularProgress /> : 'LOG IN'}
              </Button>

              <DialogContentText>
                <div style={{ marginTop: 6 }}>
                  Don't have an account?{' '}
                  <span
                    className='toggleButton'
                    onClick={() => setShowLoginForm(false)}
                  >
                    SIGN UP
                  </span>
                </div>
              </DialogContentText>
            </div>
          </form>
        </DialogContent>
      </div>

      <div className={classes.googleHolder}>
        <LoginWithGoogle onClose={onClose} text='Log in with Google' />
      </div>
    </div>
  )
}
