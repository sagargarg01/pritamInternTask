import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { CircularProgress } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  Loader: {
    height: '95vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    '& .MuiCircularProgress-colorPrimary': {
      color: '#018786',
    },
  },
}))

export default function Loader() {
  const classes = useStyles()
  return (
    <div className={classes.Loader}>
      <div>
        <CircularProgress />
      </div>
    </div>
  )
}
