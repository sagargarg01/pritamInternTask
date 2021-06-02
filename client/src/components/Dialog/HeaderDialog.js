import React from 'react'
import './Dialog.css'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import { IconButton } from '@material-ui/core'
import Aside from './Aside/Aside'
import LoginForm from './Login/LoginForm'
import SignupForm from './Signup/SignupForm'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 960,
    height: 600,
    display: 'flex',
    minHeight: 500,
    overflow: 'hidden',

    '& .dialogFormContainer': {
      width: 520,
      padding: '52px 64px',
      boxSizing: 'border-box',
      position: 'relative',
    },
  },

  dialogCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
}))

function HeaderDialog({ open, onClose, showLoginForm, setShowLoginForm }) {
  const classes = useStyles()
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby='form-dialog-title'
        maxWidth='md'
      >
        <div className={classes.root}>
          <Aside showLoginForm={showLoginForm} onClose={onClose} />
          <div className='dialogFormContainer'>
            <IconButton
              aria-label='close'
              className={classes.dialogCloseButton}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
            {showLoginForm ? (
              <LoginForm
                setShowLoginForm={setShowLoginForm}
                onClose={onClose}
              />
            ) : (
              <SignupForm
                setShowLoginForm={setShowLoginForm}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default HeaderDialog
