import React, { useState, useContext, useEffect } from 'react'
import { Form, Spinner, InputGroup } from 'react-bootstrap'
import firebase from '../../firebase'
import { UserContext, MetaContext } from '../../context'
import { useRouteMatch, useHistory } from 'react-router-dom'
// import categories from '../../other/categories'

import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

export default function EditRecipe(props) {
  
  // context variables
  const { user } = useContext(UserContext)
  const { meta, setMeta } = useContext(MetaContext)

  // state variables
  const [recipe, setRecipe] = useState({id: ''})
  const [imageURL, setImageURL] = useState('')
  const [imageFile, setImageFile] = useState('')
  const [error, setError] = useState([])
  const [dialog, setDialog] = useState(false)
  const [tag, setTag] = useState('')
  const [allTags, setAllTags] = useState({})
  const [trigger, setTrigger] = useState(0)
  const [categories, setCategories] = useState([])
  
  // other hooks
  const match = useRouteMatch('/edit/:rid')
  const history = useHistory()

  // firebase connections
  const storageRef = firebase.storage().ref()
  const db = firebase.firestore()

  // get categories from meta
  useEffect(() => {

    let cats = meta.categories.split('<SEP>')
    setCategories(cats)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta])

  useEffect(() => {
    console.log('meta useEffect')

    let tags = {}

    if (trigger !== recipe.id) {
      console.log('grabbing the data')

      if (recipe.id) {

        console.log('got the recipe id!')

        if (recipe.tags) {
          tags = recipe.tags.split('<SEP>').reduce((res, tag) => {
            res[tag] = true
            return res
          }, {})
        }

        console.log('meta', meta)
        
        meta.tags.split('<SEP>').forEach(tag => {
          if (!tags[tag]) {
            tags[tag] = false
          }
        })
       
        setTrigger(recipe.id)
      }  

    } else {
 
      meta.tags.split('<SEP>').forEach(tag => {
        if (allTags[tag]) {
          tags[tag] = allTags[tag]
        } else {
          tags[tag] = false
        }
      })
      
    }

    console.log(tags)

    setAllTags(tags)
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta, recipe.id])
  
  // get the recipe
  useEffect(() => {
    let docRef = db.collection('recipes').doc(match.params.rid)

    docRef.get()
      .then(doc => {
        setRecipe({
            ...doc.data(),
            id: doc.id,
            ingredients: doc.data().ingredients.replace(/<SEP>/g, "\n"),
            directions: doc.data().directions.replace(/<SEP>/g, "\n"),
            notes: doc.data().notes.replace(/<SEP>/g, "\n")
          })
        }
      )
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

    let tags = Object.entries(allTags).filter(([k,v]) => v).map(([k,v]) => k).join('<SEP>')

    let newRecipe = {
      name: recipe.name,
      ingredients: recipe.ingredients.replace(/\n/g, "<SEP>"),
      directions: recipe.directions.replace(/\n/g, "<SEP>"),
      category: recipe.category,
      tags: tags,
      notes: recipe.notes.replace(/\n/g, "<SEP>"),
      img_path: img_path,
      orig_link: recipe.orig_link,
      uid: recipe.uid,
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

  if (!user || (user.uid !== recipe.uid && user.uid !== 'bwf2xYmzWWNATWIExkT9zA1B5ax1')) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    )
  }

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>

      <div className="content-gutter"></div>

      <div className="form-view">

      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: 'center'}}>
        <div>
          <h1>Edit Recipe</h1>
        </div>
        
        <div>
          <Button onClick={() => setDialog(true)} variant="contained" color="secondary">delete</Button>
          {/* <IconButton onClick={() => setDialog(true)}>
            <DeleteRoundedIcon style={{color: "black"}} />
          </IconButton> */}
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

        <Form.Group controlId="tags">
          <Form.Label>Tags (optional)</Form.Label>
          <div className="tags-outer-container">
            <div className="tags-container">
              {
                Object.entries(allTags)
                  .map(([tag, checked]) => (
                    <div className="chip-container" key={tag}>
                      <Chip variant={checked ? "default" : "outlined"} label={tag} onClick={() => {
                        setAllTags({...allTags, [tag]: !checked})
                      }} />
                    </div>
                  ))
              }
            </div>
            <div className="add-tag-container">
              <InputGroup>
                <Form.Control type="text" 
                  value={tag}
                  onChange={e => setTag(e.target.value)}
                />
                <InputGroup.Append>
                  <Button variant="outlined" onClick={e => {

                    // prevent empty tags
                    if (tag) {
  
                      let tagLower = tag.toLowerCase()
                      
                      if (tag in allTags) {
                        setAllTags({...allTags, [tagLower]: true})
                      
                      } else {
                        // set allTags, so that the new tag is already selected
                        setAllTags({...allTags, [tagLower]: true})
                        
                        let newTags = ''
                        if (meta.tags === '') {
                          newTags = tagLower
                        } else {
                          newTags = meta.tags + `<SEP>${tagLower}`
                        }
                        
                        // set the Meta context, so that subsequent recipes show the new tag
                        setMeta({...meta, tags: newTags})
                        
                        // update the DB, so that the new tag is saved
                        db.collection('meta').doc('meta').set({
                          categories: meta.categories,
                          tags: newTags
                        })

                      }
                      
                      // clear the input
                      setTag('')
                    }
                    
                  }}>
                    add tag
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </div>
          </div>
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

    <div className="content-gutter"></div>
    </div>
  )
}
