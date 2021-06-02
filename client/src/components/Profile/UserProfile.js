import { Button, IconButton, makeStyles } from '@material-ui/core'
import React, { useContext, useState } from 'react'
import { authContext } from '../../context/Auth'
import Loader from '../Loader/Loader'
import Update from '../updateProfile/Update'
import EditIcon from '@material-ui/icons/Edit'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 64,
    padding: 5,

    '& .wallScreenContainer': {
      margin: 'auto',
      width: 800,
      height: 200,
      display: 'flex',
      alignItems: 'flex-end',
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      position: 'relative',
      backgroundSize: 'cover',

      '& .profileContainer': {
        padding: 20,
        display: 'flex',
        width: '100%',
        justifyContent: 'flex-end',
        position: 'relative',

        '& .profileSubContainer': {
          position: 'absolute',
          // border: '1px solid',
          left: 30,
          top: 0,

          '& .profilePicture': {
            height: 100,
            width: 100,
            border: '4px solid white',
            borderRadius: 100,
            backgroundColor: 'white',
            backgroundSize: 'cover',

            '&:hover': {
              cursor: 'pointer',
            },
          },
        },

        '& .editButton': {
          color: 'white',
          borderColor: 'white',
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
      marginTop: 125,
      width: 800,
      minHeight: 100,
      background: '#e8e8e8',
      border: '1px solid',
      boxSizing: 'border-box',
      padding: 24,
      borderRadius: 10,
      whiteSpace: 'pre-line',
    },
  },
}))

export default function UserProfile() {
  const classes = useStyles()
  const [openDialog, setOpenDialog] = useState(false)
  const { auth, setAuth } = useContext(authContext)
  const { user } = auth
  // const [loader, setLoader] = useState(true)
  const [profileImgUrl, setProfileImgUrl] = useState('')
  const [coverImgUrl, setCoverImgUrl] = useState('')

  const onClose = () => setOpenDialog(false)

  const avatarClickHandler = () => {
    const input = document.getElementById('avatar')
    input.click()
  }

  const avatarChangeHandler = (e) => {
    const profileImg = e.target.files[0]

    const formData = new FormData()
    formData.append('profileImg', profileImg)

    axios
      .post('/user/profile', formData, {})
      .then((res) => {
        setAuth({
          authenticated: true,
          user: res.data.data,
        })
        setProfileImgUrl(res.data.data.avatar.url)
      })
      .catch((err) => console.log(err))
  }

  const wallImageClickHandler = () => {
    const input = document.getElementById('wallImage')
    input.click()
  }

  const wallImageChangeHandler = (e) => {
    const coverImg = e.target.files[0]

    const formData = new FormData()
    formData.append('coverImg', coverImg)

    axios
      .post('/user/cover', formData, {})
      .then((res) => {
        setAuth({
          authenticated: true,
          user: res.data.data,
        })
        setCoverImgUrl(res.data.data.cover.url)
      })
      .catch((err) => console.log(err))
  }

  // if (loader) return <Loader />
  if (!auth.authenticated) {
    return <Redirect to={{ pathname: '/' }} />
  }

  return (
    <div className={classes.root}>
      <div
        className='wallScreenContainer'
        style={{
          backgroundImage: `url(${coverImgUrl || user.cover.url})`,
        }}
      >
        {console.log(user.cover.url)}
        <div className='profileContainer'>
          <div className='profileSubContainer'>
            <div
              className='profilePicture'
              style={{
                backgroundImage: `url(${profileImgUrl || user.avatar.url})`,
              }}
              onClick={avatarClickHandler}
            >
              <input
                type='file'
                name='avatar'
                id='avatar'
                accept='image/*'
                onChange={avatarChangeHandler}
                hidden
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              >
                {user.firstname} {user.lastname}
              </div>
              <div>{user.username}</div>
            </div>
          </div>
          <div>
            <Button
              variant='outlined'
              onClick={() => setOpenDialog(true)}
              className='editButton'
            >
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
            onChange={wallImageChangeHandler}
            hidden
          />
        </div>
      </div>

      <div className='userBioContainer'>
        {user.description ? user.description : 'Add Bio'}
      </div>

      <Update open={openDialog} onClose={onClose} user={user} />
    </div>
  )
}
