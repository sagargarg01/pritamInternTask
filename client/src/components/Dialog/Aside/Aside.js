import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Image from '../../../assets/images/asideImage/loginImage.png'
import LoginWithGoogle from '../Login/GoogleLogin'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 440,
    minWidth: 300,
    height: '100%',
    background: 'white',
    // padding: '52px 64px',
    // boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    '& img': {
      height: 350,
    },
  },

  LoginButton: {
    position: 'absolute',
    bottom: 50,
  },
}))

export default function Aside({ showLoginForm, onClose }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <img src={Image} alt='' />

      {!showLoginForm ? (
        <div className={classes.LoginButton}>
          <LoginWithGoogle onClose={onClose} text='Sign up With Google' />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
