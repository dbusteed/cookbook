import React, { useState, useContext } from 'react'
import { Form } from 'react-bootstrap'
import firebase from '../../firebase'
import { UserContext, FilterContext } from '../../filterContext'
import { useHistory, Link } from 'react-router-dom'
import { Button } from '@material-ui/core'

export default function Login(props) {

  // state variables
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState([])

  const {setUser} = useContext(UserContext)
  const {filter, setFilter} = useContext(FilterContext)

  const history = useHistory()

  const handleSubmit = (e) => {
    e.preventDefault()

    let formErrors = []

    if (email === '') {
      formErrors.push('email address missing')
    }

    if (password === '') {
      formErrors.push('password missing')
    }

    if (formErrors.length > 0) {
      setError(formErrors)
      return
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(res => {
      setUser(res.user)
      setFilter({...filter, userRecipes: true})
    })
    .then(() => {
      history.push('/')
    })
    .catch(e => {
      formErrors.push('incorrect email / password')
      setError(formErrors)
    })
  }


  
  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>

      <div className="content-gutter-no-collapse"></div>

      <div className="form-view" style={{flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>

        <h1 className="text-center">login</h1>

        {
          error
          ? <ul> {error.map((e,i) => (<li style={{color: "red"}} key={i}>{e}</li>))} </ul>
          : null
        }

        <Form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </Form.Group>

          <Button style={{alignSelf: 'center'}} color="primary" variant="contained" type="submit">
            login
          </Button>
        </Form>

        <div className="mt-5">
          <p style={{textAlign: "center"}}>
            No account? Make one <Link to="/signup">here</Link>
          </p>
        </div>
      </div>

      <div className="content-gutter-no-collapse"></div>

    </div>
  )
}