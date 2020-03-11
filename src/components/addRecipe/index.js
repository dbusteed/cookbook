import React, { useState, useContext } from 'react'
import { Form } from 'react-bootstrap'
import Login from '../login'
import firebase from '../../firebase'
import { UserContext } from '../../context'
import { useHistory } from 'react-router-dom'
import { Button } from '@material-ui/core'
import categories from '../../other/categories'

export default function AddRecipe(props) {
  
  // state variables
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: '',
    directions: '',
    category: 'Breakfast',
    notes: '',
    imageURL: '',
    imageFile: '',
    orig_link: ''
  })
  const [error, setError] = useState([])

  // context variables
  const { user } = useContext(UserContext)

  // other hooks
  const history = useHistory()

  // firebase connections
  const storageRef = firebase.storage().ref()
  const db = firebase.firestore()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // TODO better  validation checking crap

    let formErrors = []

    if (recipe.name === '') {
      formErrors.push('recipe name missing')
    }

    if (recipe.ingredients === '') {
      formErrors.push('recipe ingredients missing')
    }

    if (recipe.directions === '') {
      formErrors.push('recipe directions missing')
    }

    if (recipe.imageFile === '' && recipe.imageURL === '') {
      formErrors.push('recipe image missing')
    }

    if (formErrors.length > 0) {
      setError(formErrors)
      window.scrollTo(0, 0)
      return
    }

    let img_path = ''
    if(recipe.imageFile) {
      img_path = recipe.name.replace(/[^A-Za-z]/g, '').slice(0,10) + Date.now().toString() + '.' + recipe.imageFile.name.split('.').pop()

      let imageRef = storageRef.child(`images/${img_path}`)
      imageRef.put(recipe.imageFile)
        .then(res => {
          console.log('img good')
        })
        .catch(err => {
          console.log('img bad')
        })

    } else {
      img_path = recipe.imageURL
    }

    let timestamp = Date.now()

    let newRecipe = {
      name: recipe.name,
      ingredients: recipe.ingredients.replace(/\n/g, "<SEP>"),
      directions: recipe.directions.replace(/\n/g, "<SEP>"),
      category: recipe.category,
      notes: recipe.notes.replace(/\n/g, "<SEP>"),
      img_path: img_path,
      orig_link: recipe.orig_link,
      uid: user.uid,
      create_date: timestamp,
      modify_date: timestamp
    }

    db.collection('recipes').add(newRecipe)
      .then(res => {
        console.log('great success')
      })
      .then(() => {
        history.push('/') // need to refresh page context?
      })
      .catch(err => {
        console.log('failure')
      })

      // TODO loading or some sorta feedback?
  }

  if (!user) {
    return <Login />
  }

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>

      <div className="content-gutter-no-collapse"></div>

      <div className="form-view" style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>

      <h1 style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: 'center'}}>Add Recipe</h1>

      {
        error
        ? <ul> {error.map((e,i) => (<li style={{color: "red"}} key={i}>{e}</li>))} </ul>
        : null
      }

      <Form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>
        <Form.Group controlId="name">
          <Form.Label>Recipe Name</Form.Label>
          <Form.Control type="text" 
            value={recipe.name} 
            onChange={e => setRecipe({...recipe, name: e.target.value})} />
        </Form.Group>

        <Form.Group controlId="ingredients">
          <Form.Label>Ingredients</Form.Label>
          <Form.Control as="textarea" 
            value={recipe.ingredients}
            onChange={e => setRecipe({...recipe, ingredients: e.target.value})} 
            placeholder={"enter each ingredient separated by a new line"}
            rows="5" />
        </Form.Group>

        <Form.Group controlId="directions">
          <Form.Label>Directions</Form.Label>
          <Form.Control as="textarea"
            value={recipe.directions}
            onChange={e => setRecipe({...recipe, directions: e.target.value})}
            placeholder={"enter each direction separated by a new line"}
            rows="5"/>
        </Form.Group>

        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control as="select"
            onChange={e => setRecipe({...recipe, category: e.target.value})}>
            {
              categories.map(cat => (
                <option key={cat}>{cat}</option>
              ))
            }
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="notes">
          <Form.Label>Notes (optional)</Form.Label>
          <Form.Control as="textarea"
            value={recipe.notes}
            onChange={e => setRecipe({...recipe, notes: e.target.value})} 
            rows="3"/>
        </Form.Group>

        <Form.Group>
          <Form.Label>Recipe Image</Form.Label>
          <div className="d-flex flex-direction-row align-items-center justify-content-center">
            <div className="flex-grow-1">
              <Form.Control type="text"
                placeholder="Paste in an image URL"
                value={recipe.imageURL}
                onChange={e => setRecipe({...recipe, imageURL: e.target.value})} />
            </div>
            <div>
              <Form.Label className="mx-2">OR</Form.Label>
            </div>
            <div className="d-flex flex-direction-row">
                <label style={{backgroundColor: recipe.imageFile ? "#3f51b5" : "", color: recipe.imageFile ? "white" : ""}} className="MuiButtonBase-root MuiButton-root MuiButton-outlined">
                  {recipe.imageFile ? recipe.imageFile.name : "upload"} 
                  <input type="file" 
                    style={{display: 'none'}}
                    onChange={e => setRecipe({...recipe, imageFile: e.target.files[0]})} />
                </label>
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId="origURL">
          <Form.Label>Original Recipe URL (optional)</Form.Label>
          <Form.Control type="text"
            value={recipe.orig_link}
            onChange={e => setRecipe({...recipe, orig_link: e.target.value})} />
        </Form.Group>

        <div style={{alignSelf: 'center'}}>
          <Button className="mb-5 mt-2 mr-3" color="primary" variant="contained" type="submit">
            add
          </Button>
        </div>

      </Form>

    </div>

    <div className="content-gutter-no-collapse"></div>
    </div>
  )
}
