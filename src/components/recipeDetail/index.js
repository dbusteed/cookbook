import React, { useState, useEffect, useContext } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import firebase from '../../firebase'
import { Spinner } from 'react-bootstrap'
import './index.css'
import { Link } from 'react-router-dom'
import { UserContext, FilterContext } from '../../context'
import { CopyToClipboard } from 'react-copy-to-clipboard'

// material stuff and icons
import { Button, IconButton, Snackbar, Chip } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import ViewDayRoundedIcon from '@material-ui/icons/ViewDayRounded'
import ShareRoundedIcon from '@material-ui/icons/ShareRounded'


export default function RecipeDetail(props) {

  // context variables
  const { user } = useContext(UserContext)
  const { filter, setFilter } = useContext(FilterContext)

  // state variables
  const [recipe, setRecipe] = useState(null)
  const [columnDirection, setColumnDirection] = useState('column')
  const [bodyDirection, setBodyDirection] = useState(window.innerWidth > 600 ? 'row' : columnDirection)
  const [snackbar, setSnackbar] = useState(false)

  // other hooks
  const match = useRouteMatch('/recipe/:rid')
  const history = useHistory()

  // TODO don't call? just read from context?
  useEffect(() => {
    const db = firebase.firestore() // handle bad id
    let docRef = db.collection('recipes').doc(match.params.rid)

    docRef.get().then(doc => {
      setRecipe({ ...doc.data(), id: doc.id })
      // document.title = doc.data().name
    })
    .catch(err => {
      console.log('ERROR', err)
    })

    toggleViewOrder()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  window.addEventListener('resize', () => {
    updateBodyDirection()
  })

  const handleTagFilter = (tag) => {
    setFilter({...filter, tag: tag})
    history.push('/')
  }

  const toggleViewOrder = () => {
    columnDirection === 'column' ? setColumnDirection('column-reverse') : setColumnDirection('column')
    updateBodyDirection()
  }

  const updateBodyDirection = () => {
    setBodyDirection(window.innerWidth > 600 ? 'row' : columnDirection)
  }

  const strikeThru = (e) => {
    e.currentTarget.style.textDecoration = e.currentTarget.style.textDecoration ? '' : 'line-through'
  }

  return (
    <div>
      {
        recipe && recipe.name

          ?

          <div>
            <div className="recipe-detail-container">

              <div className="recipe-header">
                <div className="recipe-header-left">
                  <h1 style={{ textAlign: "center" }}>{recipe.name}</h1>
                </div>

                <div style={{ textAlign: "center" }} className="recipe-detail-buttons">

                  <IconButton id="toggle-button" onClick={toggleViewOrder}>
                    <ViewDayRoundedIcon style={{color: "black"}} fontSize={"small"} />
                  </IconButton>   
                  
                  <CopyToClipboard text={window.location.href}>
                    <IconButton onClick={() => {setSnackbar(true)}}>
                      <ShareRoundedIcon style={{color: "black"}} fontSize={"small"} />
                    </IconButton>
                  </CopyToClipboard>            
                  
                  {
                    user && user.uid === recipe.uid                      
                      ? <Link to={`/edit/${recipe.id}`}>
                          <IconButton>
                            <EditRoundedIcon style={{color: "black"}} fontSize={"small"} />
                          </IconButton>
                        </Link>
                      : null
                  }
                  
                </div>
              </div>

              <hr />

              <div className="recipe-body" style={{ flexDirection: bodyDirection }}>

                <div id="directions-list">
                  <h2>Directions</h2>
                  <ul>
                    {
                      recipe.directions.split('<SEP>').map((dir, idx) => {
                        if (dir.startsWith('#')) {
                          return <p className="list-subheading" key={idx}>{dir.replace('#', '').trim().toUpperCase()}</p>
                        } else if (dir.trim() === '') {
                          return <br key={idx} />
                        } else {
                          return <li onClick={strikeThru} className="mb-2 detail-li" key={idx}>{dir}</li>
                        }                        
                      })
                    }
                  </ul>
                </div>

                <div id="ingredients-list">
                  <h2>Ingredients</h2>
                  <ul>
                    {
                      recipe.ingredients.split('<SEP>').map((ing, idx) => {
                        if (ing.startsWith('#')) {
                          return <p className="list-subheading" key={idx}>{ing.replace('#', '').trim().toUpperCase()}</p>
                        } else if (ing.trim() === '') {
                          return <br key={idx} />
                        } else {
                          return <li onClick={strikeThru} className="mb-2 detail-li" key={idx}>{ing}</li>
                        }
                      })
                    }
                  </ul>
                </div>

              </div>

              {
                recipe.notes
                
                ?
                
                <div className="other-recipe-body mt-3">
                  <h2>Notes</h2>
                  <ul>
                    {
                      recipe.notes.split("<SEP>").map((note, idx) => (
                        <li onClick={strikeThru} className="mb-2" key={idx}>{note}</li>
                      ))
                    }
                  </ul>
                </div>

                : null
              }


              {/* <hr /> */}

              <div className="recipe-footer">
                <div className="recipe-footer-tags">                      
                  {
                    recipe.tags &&
                    
                    <>
                    {
                      recipe.tags.split("<SEP>").map(tag => (
                        <div className="chip-container" key={tag}>
                          <Chip onClick={() => handleTagFilter(tag)} key={tag} variant="outlined" label={tag} />
                        </div>
                      ))
                    }
                    </>
                  }
                </div>
                <div className="recipe-footer-link">
                  {
                    recipe.orig_link === "none" || recipe.orig_link === ""
                    ? null
                    : <div>                        
                        <Button variant="contained" size="small" href={recipe.orig_link} disableElevation>visit original site</Button>                    
                      </div>
                  }
                </div>
              </div>
          
            </div>

            <Snackbar
              variant={"primary"}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              open={snackbar}
              onClose={() => setSnackbar(false)}
              autoHideDuration={3000}
            >
              <Alert elevation={6} variant="filled" severity="info">Copied to clipboard</Alert>
            </Snackbar>

          </div>

          :

          <Spinner animation="border" role="status" style={{ position: 'absolute', left: "50%" }}>
            <span className="sr-only">Loading...</span>
          </Spinner>
      }
    </div>
  )
}