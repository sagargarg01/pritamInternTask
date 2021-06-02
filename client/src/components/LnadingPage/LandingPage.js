import React from 'react'
import Box from '@material-ui/core/Box'

function LandingPage() {
  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      style={{
        minHeight: '100vh',
        fontSize: 50,
        fontFamily: 'sans-serif',
        textAlign: 'center',
      }}
    >
      Pritam Nursery Internship task <br />
      Login to continue
    </Box>
  )
}

export default LandingPage
