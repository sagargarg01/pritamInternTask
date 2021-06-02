import React, { useContext } from 'react'
import { Button, Menu, withStyles } from '@material-ui/core'
import { Fade } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { authContext } from '../../context/Auth'
import axios from 'axios'

const StyledMenu = withStyles({
  paper: {
    width: 320,
    transition: 'all 225ms ease-in !important',
    border: '1px solid #d3d4d5',
    top: '64px !important',
    left: 'unset !important',
    right: 20,
    borderRadius: '0px 0px 4px 4px',

    '& > ul': {
      padding: 0,

      '& li': {
        padding: '19px 20px',
      },
    },
  },
})((props) => (
  <Menu
    disableScrollLock
    elevation={0}
    TransitionComponent={Fade}
    getContentAnchorEl={null}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: 108,
    boxSizing: 'border-box',
    padding: '20px 0px 16px 20px',
    borderBottom: '1px solid rgba(0,0,0,0.12)',
    display: 'flex',
    gridColumnGap: 24,

    '& .overlayUserImg': {
      height: 72,
      width: 72,

      '& img': {
        height: '100%',
        width: '100%',
        borderRadius: '100%',
      },
    },

    '& .overlayUserInfo': {
      '& .overlayUserName': {
        fontSize: 16,
        lineHeight: '24px',
        letterSpacing: 0.15,
        textTransform: 'capitalize',
      },

      '& .overlayUserEmail': {
        fontSize: 14,
        lineHeight: '20px',
        letterSpacing: 0.25,
        color: 'rgba(0, 0, 0, 0.6)',
      },

      '& .overlayLogoutButton': {
        '& .MuiButton-root': {
          height: 18,
          width: 82,
          marginTop: 10,
          padding: 0,
          justifyContent: 'flex-start',
          color: '#018786',
          letterSpacing: 1.25,

          '& .MuiSvgIcon-root': {
            height: 13.5,
            width: 13.5,
            marginLeft: 4,
            color: '#018786',
          },
        },
      },
    },
  },
}))

function MenuOverlay({ anchorEl, handleMenuClose }) {
  const classes = useStyles()
  const menuId = 'primary-account-menu'
  const { auth, setAuth } = useContext(authContext)
  const { user } = auth

  const handleSignout = () => {
    axios({ method: 'get', url: '/user/signout' })
      .then((res) => {
        setAuth({
          data: null,
          authenticated: false,
        })
        handleMenuClose()
      })
      .catch((err) => console.log(err.data.response))
  }

  const User = () => {
    return (
      <div className={classes.root}>
        <div className='overlayUserImg'>
          <img src={user.avatar.url} alt={user.name} />
        </div>
        <div className='overlayUserInfo'>
          <div className='overlayUserName'>
            {user.firstname} {user.lastname}
          </div>
          <div className='overlayUserEmail'>{user.email}</div>
          <div className='overlayLogoutButton'>
            <Button onClick={handleSignout}>
              logout
              <ExitToAppIcon color='secondary' />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <StyledMenu
        anchorEl={anchorEl}
        id={menuId}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <User />
      </StyledMenu>
    </div>
  )
}

export default MenuOverlay
