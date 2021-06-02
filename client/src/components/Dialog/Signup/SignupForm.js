import React, { useState, useContext } from 'react'
import TextField from '@material-ui/core/TextField'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import './Signup.css'
import { CircularProgress } from '@material-ui/core'
import axios from 'axios'
import { authContext } from '../../../context/Auth'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 390,
    margin: 'auto',

    '& .signupInputs': {
      display: 'grid',
      gridRowGap: 24,
    },

    '& .MuiTextField-root': {
      width: '100%',
      maxWidth: 390,

      '& .MuiOutlinedInput-root': {
        height: 56,
      },

      '& .MuiButtonBase-root': {
        color: 'rgba(0,0,0,0.6)',
      },

      '& .MuiInputLabel-outlined': {
        color: 'rgba(0,0,0,0.6)',
      },

      '& .MuiFormLabel-root.Mui-error': {
        color: '#f44336',
      },
    },

    '& .MuiOutlinedInput-input': {
      padding: '16.5px 14px',
    },

    '& .formFooter': {
      textAlign: 'center',
      color: 'rgba(0,0,0,0.6)',

      '& .signUpButton': {
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
        margin: ' 24px 0px 20px 0px',

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

  header: {
    padding: 0,
    marginTop: -30,

    [theme.breakpoints.down(1044)]: {
      marginTop: 0,
    },
  },

  formContainer: {
    overflowY: 'visible',
    padding: 0,
    marginTop: 20,
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
}))

export default function SignupForm({ setShowLoginForm, onClose }) {
  const classes = useStyles()

  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [fNameET, setFNameET] = useState('')
  const [lNameET, setLNameET] = useState('')
  const [usernameET, setUsernameET] = useState('')
  const [emailET, setEmailET] = useState('')
  const [passwordET, setPasswordET] = useState('')
  const [confpassET, setConfPassET] = useState('')

  let { setSnack } = useContext(authContext)

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

    if (state.password !== state.confirmPassword) {
      setConfPassET('Does not match password. Try again')
      return
    }
    if (!state.email) setEmailET('Field cannot be empty')
    if (!state.password) setPasswordET('Field cannot be empty')
    if (!state.confirmPassword) setConfPassET('Field cannot be empty')
    if (!state.firstName) setFNameET('Field cannot be empty')
    if (!state.lastName) setLNameET('Field cannot be empty')
    if (!state.userName) setUsernameET('Field cannot be empty')
    if (state.password.length < 6) setPasswordET('Password is too short')

    if (
      !state.email ||
      !state.password ||
      !state.firstName ||
      !state.lastName ||
      !state.userName ||
      !state.confirmPassword ||
      usernameET ||
      passwordET
    )
      return

    if (!validateEmail(state.email)) {
      setEmailET('Please enter a valid email!')
      return
    }

    setLoading(true)
    const data = {
      firstname: state.firstName,
      lastname: state.lastName,
      email: state.email,
      username: state.userName.toLowerCase(),
      password: state.password,
    }

    axios({
      method: 'post',
      url: '/user/signup',
      data: data,
    })
      .then(function (res) {
        onClose()
        setSnack(
          'Mail has been sent to the email provided. Please check your inbox to verify your email before continuing to the website'
        )
      })
      .catch(function (error) {
        console.log(error.response.data)
        setLoading(false)
        if (error.response.data.type === 'userName')
          setUsernameET(error.response.data.message)
        else setEmailET(error.message)
      })
  }

  const showPasswordClickHandler = () => {
    let passwordInput = document.getElementById('signupPassword')
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text'
    } else {
      passwordInput.type = 'password'
    }
    passwordInput.focus()
  }

  const showConfirmPasswordClickHandler = () => {
    let passwordInput = document.getElementById('confirmPassword')
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text'
    } else {
      passwordInput.type = 'password'
    }
    passwordInput.focus()
  }

  const changeHandler = (e) => {
    const { name, value } = e.target

    if (name === 'firstName') {
      if (value.length < 3) setFNameET('Too Short')
      if (value.length === 0 || value.length >= 3) setFNameET('')
    }

    if (name === 'userName') validateUsername(value)

    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const letters = /[a-z]/i
  const containOneAlphabet = (str) => str.match(letters)

  const regex = /^(?!\.)(?!.*\.$)(?!.*?\.\.)[a-zA-Z0-9_.]+$/
  const checkForDots = (str) => str.match(regex)

  const validateUsername = (userName) => {
    if (userName.length < 3) setUsernameET('Too Short')
    if (userName.length === 0 || userName.length >= 3) setUsernameET('')

    if (
      (checkForDots(userName) === null ||
        userName.length > 30 ||
        !containOneAlphabet(userName)) &&
      userName.length != 0
    )
      setUsernameET('Invalid Format')
  }

  const checkUserName = (e) => {
    let key = e.key
    let keyCharCode = key.charCodeAt(0)

    if (keyCharCode === 46 || keyCharCode === 95) {
      return key
    }
    // 0-9
    if (keyCharCode >= 48 && keyCharCode <= 57) {
      return key
    }
    // A-Z
    if (keyCharCode >= 65 && keyCharCode <= 90) {
      return key
    }
    // a-z
    if (keyCharCode >= 97 && keyCharCode <= 122) {
      return key
    }

    e.preventDefault()
    return false
  }

  return (
    <div className='signupFormContainer'>
      <div className='signupForm'>
        <DialogTitle
          id='form-dialog-title'
          className={`${classes.header} headerQuery`}
        >
          <div>Create an account</div>
        </DialogTitle>

        <DialogContent className={classes.formContainer}>
          <form
            className={`${classes.root} signupFormStyles`}
            noValidate
            autoComplete='off'
            onSubmit={submitHandler}
          >
            <div className='signupInputs'>
              <div style={{ display: 'flex' }}>
                <div className='inputContainer'>
                  <TextField
                    label='First Name'
                    className={classes.inputStyle}
                    error={Boolean(fNameET)}
                    helperText={fNameET}
                    variant='outlined'
                    name='firstName'
                    value={state.firstName}
                    onChange={changeHandler}
                    required
                    InputLabelProps={{ required: false }}
                  />
                </div>
                <div style={{ width: 20 }} />
                <div className='inputContainer'>
                  <TextField
                    label='Last Name'
                    className={classes.inputStyle}
                    error={Boolean(lNameET)}
                    helperText={lNameET}
                    variant='outlined'
                    name='lastName'
                    value={state.lastName}
                    onChange={changeHandler}
                    required
                    InputLabelProps={{ required: false }}
                  />
                </div>
              </div>

              <div className='inputContainer'>
                <TextField
                  InputLabelProps={{ required: false }}
                  className={classes.inputStyle}
                  error={Boolean(usernameET)}
                  helperText={usernameET}
                  label='Username'
                  name='userName'
                  variant='outlined'
                  onKeyPress={checkUserName}
                  value={state.userName}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className='inputContainer'>
                <TextField
                  error={Boolean(emailET)}
                  helperText={emailET}
                  className={classes.inputStyle}
                  label='Email'
                  variant='outlined'
                  type='email'
                  name='email'
                  value={state.email}
                  onChange={changeHandler}
                  required
                  InputLabelProps={{ required: false }}
                />
              </div>
              <div className='inputContainer'>
                <TextField
                  error={Boolean(passwordET)}
                  helperText={passwordET}
                  InputLabelProps={{ required: false }}
                  id='signupPassword'
                  label='Password'
                  variant='outlined'
                  type='password'
                  name='password'
                  value={state.password}
                  onChange={changeHandler}
                  required
                  className={classes.inputStyle}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={showPasswordClickHandler}
                          edge='end'
                        >
                          <Visibility />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className='inputContainer'>
                <TextField
                  error={Boolean(confpassET)}
                  helperText={confpassET}
                  InputLabelProps={{ required: false }}
                  name='confirmPassword'
                  id='confirmPassword'
                  label='Confirm Password'
                  variant='outlined'
                  type='password'
                  value={state.confirmPassword}
                  onChange={changeHandler}
                  required
                  className={classes.inputStyle}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={showConfirmPasswordClickHandler}
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
              <Button className='signUpButton' type='submit'>
                {loading ? <CircularProgress /> : 'SIGN UP'}
              </Button>
            </div>

            <div className='formFooter'>
              Already have an account?{' '}
              <span
                className='toggleButton'
                onClick={() => setShowLoginForm(true)}
              >
                LOG IN
              </span>
            </div>
          </form>
        </DialogContent>
      </div>
    </div>
  )
}
