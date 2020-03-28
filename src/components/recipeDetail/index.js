import React, { useState, useEffect, useContext } from 'react'
import { useRouteMatch } from 'react-router-dom'
import firebase from '../../firebase'
import { Spinner } from 'react-bootstrap'
import './index.css'
import { Link } from 'react-router-dom'
import { UserContext } from '../../context'

// material stuff and icons
import { Button, IconButton } from '@material-ui/core'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import WebRoundedIcon from '@material-ui/icons/WebRounded'
import ViewAgendaRoundedIcon from '@material-ui/icons/ViewAgendaRounded'
import ShareRoundedIcon from '@material-ui/icons/ShareRounded'


export default function RecipeDetail(props) {

  // context variables
  const { user } = useContext(UserContext)

  // state variables
  const [recipe, setRecipe] = useState(null)
  const [columnDirection, setColumnDirection] = useState('column')
  const [bodyDirection, setBodyDirection] = useState(window.innerWidth > 600 ? 'row' : columnDirection)

  const match = useRouteMatch('/recipe/:rid')

  // TODO don't call? just read from context?
  useEffect(() => {
    const db = firebase.firestore() // handle bad id
    let docRef = db.collection('recipes').doc(match.params.rid)

    docRef.get().then(doc => {
      setRecipe({ ...doc.data(), id: doc.id })
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
            <div>

              <div className="recipe-header">
                <div>
                  <h1 style={{ textAlign: "center" }} className="m-0">{recipe.name}</h1>
                </div>

                <div style={{ textAlign: "center" }} className="recipe-detail-buttons">
                  <IconButton>
                    <ShareRoundedIcon style={{color: "black"}} fontSize={"large"} />
                  </IconButton>
                  
                  {
                    recipe.orig_link === "none" || recipe.orig_link === ""
                      ? null                      
                      : <a href={recipe.orig_link} target="_blank">
                          <IconButton>
                            <WebRoundedIcon style={{color: "black"}} fontSize={"large"} />
                          </IconButton>
                        </a>
                  }
                  
                  {
                    user && user.uid === recipe.uid                      
                      ? <Link to={`/edit/${recipe.id}`}>
                          <IconButton>
                            <EditRoundedIcon style={{color: "black"}} fontSize={"large"} />
                          </IconButton>
                        </Link>
                      : null
                  }
                  
                  <IconButton id="toggle-button" onClick={toggleViewOrder}>
                    <ViewAgendaRoundedIcon style={{color: "black"}} fontSize={"large"} />
                  </IconButton>                  
                </div>
              </div>

              <hr />

              <div className="recipe-body" style={{ flexDirection: bodyDirection }}>

                <div id="directions-list">
                  <h2>Directions</h2>
                  <ul>
                    {
                      recipe.directions.split('<SEP>').map((dir, idx) => (
                        <li onClick={strikeThru} className="mb-2 detail-li" key={idx}>{dir}</li>
                      ))
                    }
                  </ul>
                </div>

                <div id="ingredients-list">
                  <h2>Ingredients</h2>
                  <ul>
                    {
                      recipe.ingredients.split('<SEP>').map((ing, idx) => (
                        <li onClick={strikeThru} className="mb-2 detail-li" key={idx}>{ing}</li>
                      ))
                    }
                  </ul>
                </div>

              </div>

              {
                recipe.notes
                
                ?
                
                <div className="other-recipe-body mt-3">
                  <h3>Notes</h3>
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

            </div>
          </div>

          :

          <Spinner animation="border" role="status" style={{ position: 'absolute', left: "50%" }}>
            <span className="sr-only">Loading...</span>
          </Spinner>
      }
    </div>
  )
}