import React, { useState, useEffect, useContext } from 'react'
import { useRouteMatch } from 'react-router-dom'
import firebase from '../../firebase'
import { Spinner } from 'react-bootstrap'
import './index.css'
import { Link } from 'react-router-dom'
import { UserContext } from '../../filterContext'
import { Button } from '@material-ui/core'

export default function RecipeDetail(props) {

  // context variables
  const { user } = useContext(UserContext)

  // state variables
  const [recipe, setRecipe] = useState(null)
  const [columnDirection, setColumnDirection] = useState('column')
  const [bodyDirection, setBodyDirection] = useState(window.innerWidth > 600 ? 'row' : columnDirection)

  const match = useRouteMatch('/recipe/:rid')

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
                  {
                    recipe.orig_link === "none" || recipe.orig_link === ""
                      ? null
                      : <Button href={recipe.orig_link} target="_none" variant="outlined" className="mr-2">visit original site</Button>
                  }
                  {
                    user && user.uid === recipe.uid
                      ? <Link to={`/edit/${recipe.id}`}>
                          <Button variant="outlined" className="mr-2">edit recipe</Button>
                        </Link>
                      : null
                  }
                  <Button id="toggle-button" variant="outlined" className="mr-2" onClick={toggleViewOrder}>toggle view order</Button>
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