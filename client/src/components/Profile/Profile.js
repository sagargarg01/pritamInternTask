import { Button, IconButton, makeStyles } from '@material-ui/core'
import React, { useContext, useState } from 'react'
import Loader from '../Loader/Loader'
import Update from '../updateProfile/Update'
import EditIcon from '@material-ui/icons/Edit'
import { authContext } from '../../context/Auth'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 64,
    padding: 5,

    '& .wallScreenContainer': {
      border: '1px solid',
      width: 800,
      height: 200,
      margin: 'auto',
      background: 'grey',
      position: 'relative',

      '& .profileContainer': {
        padding: '30px 20px',
        border: '1px solid',
        width: 250,
        margin: 'auto',
        marginTop: 77,
        background: 'white',

        '& .profileSubContainer': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',

          '& .profilePicture': {
            height: 100,
            width: 100,
            border: '1px solid',
            borderRadius: 100,
            backgroundColor: 'white',
            backgroundSize: 'cover',

            '&:hover': {
              cursor: 'pointer',
            },
          },

          '& .nameContainerInProfile': {
            marginTop: 30,
          },
        },
      },

      '& .editIconButton': {
        position: 'absolute',
        borderRadius: 100,
        background: 'white',
        top: 10,
        right: 10,

        '& .MuiIconButton-root': {
          color: '#018786',
          padding: 5,
        },
      },
    },

    '& .userBioContainer': {
      margin: 'auto',
      marginTop: 250,
      width: 800,
      minHeight: 100,
      background: '#e8e8e8',
      border: '1px solid',
      boxSizing: 'border-box',
      padding: 24,
    },
  },

  button: {
    width: '100%',
    marginTop: 50,

    '& .MuiButton-root': {
      width: '100%',
    },
  },
}))

export default function ProfileUser() {
  const classes = useStyles()
  const [openDialog, setOpenDialog] = useState(false)
  const { auth, setAuth } = useContext(authContext)
  const [user, setUser] = useState(null)
  const [loader, setLoader] = useState(true)

  const onClose = () => setOpenDialog(false)

  const avatarClickHandler = () => {
    const input = document.getElementById('avatar')
    input.click()
  }

  const wallImageClickHandler = () => {
    const input = document.getElementById('wallImage')
    input.click()
  }

  useState(() => {
    if (auth.authenticated) {
      setLoader(false)
      setUser(auth.user)
    } else setUser(null)
  }, [auth, setAuth])

  if (loader) return <Loader />

  return (
    <div className={classes.root}>
      <div className='wallScreenContainer'>
        <div className='profileContainer'>
          <div className='profileSubContainer'>
            <div
              className='profilePicture'
              style={{ backgroundImage: `url(${user.avatar.url})` }}
              onClick={avatarClickHandler}
            >
              <input
                type='file'
                name='avatar'
                id='avatar'
                accept='image/*'
                hidden
              />
            </div>
            <div className='nameContainerInProfile'>
              <div style={{ fontSize: 24, fontWeight: 500 }}>
                {user.firstname} {user.lastname}
              </div>
              <div style={{ textAlign: 'center' }}>{user.username}</div>
            </div>
          </div>
          <div className={classes.button}>
            <Button variant='outlined' onClick={() => setOpenDialog(true)}>
              edit
            </Button>
          </div>
        </div>

        <div className='editIconButton'>
          <IconButton onClick={wallImageClickHandler}>
            <EditIcon />
          </IconButton>

          <input
            type='file'
            name='wallImage'
            id='wallImage'
            accept='image/*'
            hidden
          />
        </div>
      </div>

      <div className='userBioContainer'>ADD Bio</div>

      <Update open={openDialog} onClose={onClose} user={user} />
    </div>
  )
}
