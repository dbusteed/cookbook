import React, { useState, useContext } from 'react'
import { Form } from 'react-bootstrap'
import firebase from '../../firebase'
import { secret } from '../../secret' // "secret" is just some value
import { UserContext } from '../../context'
import { useHistory, Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'

export default function Signup(props) {

  // state variables
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [code, setCode] = useState('')
  const [errors, setErrors] = useState([])

  // context variables
  const {setUser} = useContext(UserContext)

  // hooks
  const history = useHistory()


  const handleSubmit = (e) => {
    e.preventDefault()

    let formErrors = []

    if (email === '') {
      formErrors.push('missing email')
    }

    if (password === '') {
      formErrors.push('missing password')
    }

    if (password2 === '') {
      formErrors.push('missing password confirmation')
    }

    if (password !== password2) {
      formErrors.push('passwords don\'t match')
    }

    if (code === '') {
      formErrors.push("missing signup code")
    } else if (code.toLowerCase() !== secret) {
      formErrors.push("invalid signup code")
    }

    if (password.length < 6) {
      formErrors.push('password needs to be at least 6 characters')
    }

    if (formErrors.length > 0) {
      setErrors(formErrors)
      return
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((res) => {
      setUser(res.user)

      // add user info to the database
      let db = firebase.firestore()
      let newUser = {'uname': email.split('@')[0]}
      db.collection('users').doc(res.user.uid).set(newUser)
    })
    .then(() => {
      history.push('/')
    })
    .catch((e) => {
      formErrors.push(e.message)
      setErrors(formErrors)
    })

  }
  
  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>

      <div className="content-gutter"></div>

      <div className="form-view" style={{flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>

        <Paper className="login-container" elevation={5}>

        <h1 className="text-center">Signup</h1>

        {
          errors
          ? <ul> {errors.map((e,i) => (<li style={{color: "red"}} key={i}>{e}</li>))} </ul>
          : null
        }

        <Form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}  >          
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" value={password2} onChange={e => setPassword2(e.target.value)} placeholder="" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Signup Code</Form.Label>
            <Form.Control type="password" value={code} onChange={e => setCode(e.target.value)} placeholder="" />
          </Form.Group>
          
          <Button style={{alignSelf: 'center'}} color="primary" variant="contained" type="submit">
            signup
          </Button>
        </Form>

        <div className="mt-5">
          <p style={{textAlign: "center"}}>
            Already have an account? Login <Link to="/login">here</Link>
          </p>
        </div>

        </Paper>

      </div>

      <div className="content-gutter"></div>
      
    </div>
  )
}