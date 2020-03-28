import React, { useState, useContext, useEffect } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import firebase from '../../firebase'
import { UserContext } from '../../context'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { Button } from '@material-ui/core'
import categories from '../../other/categories'

export default function EditRecipe(props) {
  
  // context variables
  const { user } = useContext(UserContext)

  // state variables
  const [recipe, setRecipe] = useState({uid: ''})
  const [imageURL, setImageURL] = useState('')
  const [imageFile, setImageFile] = useState('')
  const [error, setError] = useState([])
  const [dialog, setDialog] = useState(false)
  
  // other hooks
  const match = useRouteMatch('/edit/:rid')
  const history = useHistory()

  // firebase connections
  const storageRef = firebase.storage().ref()
  const db = firebase.firestore()
  
  useEffect(() => {
    let docRef = db.collection('recipes').doc(match.params.rid)

    docRef.get().then(doc => {
      setRecipe(
        {
          ...doc.data(),
          id: doc.id,
          ingredients: doc.data().ingredients.replace(/<SEP>/g, "\n"),
          directions: doc.data().directions.replace(/<SEP>/g, "\n"),
          notes: doc.data().notes.replace(/<SEP>/g, "\n")
        }
      )
    })
    .catch(err => {
      console.log(err)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleSubmit = (e) => {
    e.preventDefault()
    
    // TODO better  validation checking crap

    let formErrors = []
    let img_path = ''

    if (recipe.name === '') {
      formErrors.push('recipe name missing')
    }

    if (recipe.ingredients === '') {
      formErrors.push('recipe ingredients missing')
    }

    if (recipe.directions === '') {
      formErrors.push('recipe directions missing')
    }

    if (imageFile === '' && imageURL === '') {
      img_path = recipe.img_path
    }

    if (formErrors.length > 0) {
      setError(formErrors)
      window.scrollTo(0, 0)
      return
    }

    // if no new image path as given
    if (!img_path) {
  
      // delete if old image in storage 
      if(!(/https?:/.test(recipe.img_path))) {
        let imageRef = storageRef.child(`images/${recipe.img_path}`)
        imageRef.delete()
        .then(() => {
          console.log('recipe image deleted')
        })
        .catch((err) => {
          console.log(err)
        })
      } 
    

      if(imageFile) {
        img_path = recipe.name.replace(/[^A-Za-z]/g, '').slice(0,10) + Date.now().toString() + '.' + imageFile.name.split('.').pop()
        
        console.log('writing to storage')
        let imageRef = storageRef.child(`images/${img_path}`)
        imageRef.put(imageFile)
        .then(res => {
          console.log('img good')
        })
        .catch(err => {
          console.log('img bad')
        })
        
      } else {
        img_path = imageURL
      }
    }

    let newRecipe = {
      name: recipe.name,
      ingredients: recipe.ingredients.replace(/\n/g, "<SEP>"),
      directions: recipe.directions.replace(/\n/g, "<SEP>"),
      category: recipe.category,
      notes: recipe.notes.replace(/\n/g, "<SEP>"),
      img_path: img_path,
      orig_link: recipe.orig_link,
      uid: user.uid,
      create_date: recipe.create_date,
      modify_date: Date.now()
    }

    console.log('new recipe', newRecipe)

    // console.log('pushing to DB')
    db.collection('recipes').doc(recipe.id).set(newRecipe)
      .then(res => {
        console.log('great success')
      })
      .then(() => {
        history.push(`/recipe/${recipe.id}`)
      })
      .catch(err => {
        console.log('failure')
      })

      // TODO loading or some sorta feedback?
  }

  const handleDelete = (confirm) => {
    if (confirm) {
      db.collection('recipes').doc(match.params.rid).delete()
      .then(() => {
        console.log('recipe deleted')
        
        if (!(/https?:/.test(recipe.img_path))) {
          let imageRef = storageRef.child(`images/${recipe.img_path}`)
          imageRef.delete()
          .then(() => {
            console.log('recipe image deleted')
          })
          .catch((err) => {
            console.log(err)
          })
        } 

      })
      .then(() => {
        history.push(`/`)
      })
      .catch((err) => {
        console.log(err)
      })
    }
    setDialog(false)
  }

  // useEffect(() => {
  //   console.log(user)
  if (!user || user.uid !== recipe.uid) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    )
  }
  // }, [])

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>

      <div className="content-gutter-no-collapse"></div>


      <div className="form-view" style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>

      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: 'center'}}>
        <div>
          <h1>Edit</h1>
        </div>
        
        <div>
          <Button onClick={() => setDialog(true)} variant="contained" color="secondary">delete</Button>
          <Dialog
            open={dialog}
            onClose={() => handleDelete(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{`Delete ${recipe.name}?`}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this recipe?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={() => handleDelete(false)}>
                Nevermind
              </Button>
              <Button variant="contained" color="secondary" onClick={() => handleDelete(true)}>
                Yes, delete recipe
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>

      {
        error
        ? <ul> {error.map((e,i) => (<li key={i} style={{color: "red"}}>{e}</li>))} </ul>
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
            rows="5" />
        </Form.Group>

        <Form.Group controlId="directions">
          <Form.Label>Directions</Form.Label>
          <Form.Control as="textarea"
            value={recipe.directions}
            onChange={e => setRecipe({...recipe, directions: e.target.value})} 
            rows="5"/>
        </Form.Group>

        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control as="select"
            value={recipe.category}
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
                value={imageURL}
                onChange={e => setImageURL(e.target.value)} />
            </div>
            <div>
              <Form.Label className="mx-2">OR</Form.Label>
            </div>
            <div className="d-flex flex-direction-row">
                <label style={{backgroundColor: imageFile ? "#3f51b5" : "", color: imageFile ? "white" : ""}} className="MuiButtonBase-root MuiButton-root MuiButton-outlined">
                  {imageFile ? imageFile.name : "upload"} 
                  <input type="file" 
                    style={{display: 'none'}}
                    onChange={e => setImageFile(e.target.files[0])} />
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
            update
          </Button>
        </div>
        
      </Form>

    </div>

    <div className="content-gutter-no-collapse"></div>
    </div>
  )
}
