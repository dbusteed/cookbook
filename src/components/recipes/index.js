import React, { useContext } from 'react'
import RecipeCard from '../recipeCard'
import { Spinner } from 'react-bootstrap'
import { FilterContext, RecipeContext, UserContext } from '../../filterContext'

export default function Recipes(props) {

  // context variables
  const { recipes, setRecipes } = useContext(RecipeContext)
  const { filter, setFilter } = useContext(FilterContext)
  const { user, setUser } = useContext(UserContext)

  let renderRecipes = recipes

  if (filter.search) {
    renderRecipes = renderRecipes.filter(r => r.name.toLowerCase().search(filter.search) >= 0)
  }

  if (filter.category) {
    renderRecipes = renderRecipes.filter(r => r.category === filter.category)
  }

  if (user) {
    if (filter.userRecipes) {
      renderRecipes = renderRecipes.filter(r => r.uid === user.uid)
    }
  }

  const filterDetails = () => {
    let text = `Showing ${filter.userRecipes ? 'my' : 'all'} recipes`
    text += filter.search ? ` with "${filter.search}"` : ''
    text += filter.category ? ` from ${filter.category} category` : ''
    return text
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>

      <div className="filter-details-container p-2 px-3 mb-4" style={{ borderBottom: ".75px solid rgb(192, 192, 192)", borderRadius: "2%" }}>
        <p style={{textAlign: "center"}} className="filter-details m-0">{filterDetails()}</p>
      </div>

      {
        renderRecipes

          ?

          <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline" }}>
            <ul style={{ listStyle: "none", display: "flex", flexWrap: "wrap", justifyContent: "center"}} className="p-0 m-0">
              {
                renderRecipes.map(recipe => (
                  <li key={recipe.id}>
                    <RecipeCard recipe={recipe} />
                  </li>
                ))
              }
            </ul>
          </div>

          :

          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
      }

    </div>
  )
}