import React, { useContext, useState } from 'react'
import TextField from '@material-ui/core/TextField'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Dialog } from '@material-ui/core'
import { CircularProgress } from '@material-ui/core'
import axios from 'axios'
import Loader from '../Loader/Loader'
import { authContext } from '../../context/Auth'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 440,
    display: 'flex',
    minHeight: 500,
    overflow: 'hidden',
    boxSizing: 'border-box',
    padding: 40,
  },

  form: {
    '&': {
      width: '100%',
      maxWidth: 390,
    },

    '& .Inputs': {
      display: 'grid',
      gridRowGap: 24,
    },

    '& .userBio': {
      '& .MuiFormControl-root': {
        width: '100%',
        height: 'auto',

        '& .MuiOutlinedInput-multiline': {
          minHeight: 100,
          width: '-webkit-fill-available',
        },

        '& .MuiOutlinedInput-root': {
          height: 'inherit',
          padding: 15,
        },

        '& .MuiInputBase-root': {
          display: 'block',
        },
      },
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

      '& .editButton': {
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
}))

export default function Update({ open, onClose, user }) {
  const classes = useStyles()
  const [state, setState] = useState({
    firstName: user.firstname,
    lastName: user.lastname,
    email: user.email,
    username: user.username,
    bio: user.description,
  })
  const [loader, setLoader] = useState(false)
  const [fNameET, setFNameET] = useState('')
  const [lNameET, setLNameET] = useState('')
  const { setAuth } = useContext(authContext)

  const changeHandler = (e) => {
    const { name, value } = e.target

    if (name === 'firstName') {
      if (value.length < 3) setFNameET('Too Short')
      if (value.length === 0 || value.length >= 3) setFNameET('')
    }

    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const submitHandler = (e) => {
    e.preventDefault()

    if (!state.firstName) setFNameET('Field cannot be empty')
    if (!state.lastName) setLNameET('Field cannot be empty')

    if (!state.firstName || !state.lastName) return
    setLoader(true)

    const data = {
      firstname: state.firstName,
      lastname: state.lastName,
      description: state.bio,
    }

    axios({
      method: 'post',
      url: '/user/update',
      data: data,
    })
      .then(function (res) {
        setAuth({
          authenticated: true,
          user: res.data.data,
        })
        onClose()
        setLoader(false)
        // console.log(res)
      })
      .catch(function (error) {
        console.log(error.data)
        setLoader(false)
      })
  }

  if (!user) {
    return <Loader />
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby='form-dialog-title'
        maxWidth='md'
      >
        <div className={classes.root}>
          <div>
            <DialogTitle id='form-dialog-title' className={classes.header}>
              <div>Edit Profile</div>
            </DialogTitle>
            <DialogContent className={classes.formContainer}>
              <form
                className={classes.form}
                autoComplete='off'
                onSubmit={submitHandler}
                noValidate
              >
                <div className='Inputs'>
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
                      label='Username'
                      variant='outlined'
                      value={state.email}
                      className={classes.inputStyle}
                      disabled
                    />
                  </div>

                  <div className='inputContainer'>
                    <TextField
                      label='Email'
                      variant='outlined'
                      value={state.username}
                      className={classes.inputStyle}
                      disabled
                    />
                  </div>

                  <div className='userBio'>
                    <TextField
                      multiline
                      label='Bio'
                      variant='outlined'
                      name='bio'
                      onChange={changeHandler}
                      value={state.bio}
                      className={classes.inputStyle}
                      required
                      InputLabelProps={{ required: false }}
                    />
                  </div>
                </div>

                <div className='formFooter'>
                  <Button className='editButton' type='submit'>
                    {loader ? <CircularProgress /> : 'Edit profile'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
