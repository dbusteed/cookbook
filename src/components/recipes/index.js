import React, { useContext } from 'react'
import RecipeCard from '../recipeCard'
import { Spinner } from 'react-bootstrap'
import { FilterContext, RecipeContext, UserContext } from '../../context'

export default function Recipes(props) {

  // context variables
  const { recipes } = useContext(RecipeContext)
  const { filter } = useContext(FilterContext)
  const { user } = useContext(UserContext)

  // filter recipes based using the FilterContext
  let renderRecipes = recipes

  // filter on title
  if (filter.search.title) {
    renderRecipes = renderRecipes.filter(r => r.name.toLowerCase().search(filter.search.title) >= 0)
  }

  // filter on ingredients
  if (filter.search.ingredients) {
    renderRecipes = renderRecipes.filter(r => r.ingredients.toLowerCase().search(filter.search.ingredients) >= 0)
  }

  // filter on tag
  if (filter.tag) {
    renderRecipes = renderRecipes.filter(r => {
      if (r.tags) { return r.tags.split('<SEP>').indexOf(filter.tag) >= 0 }
      else { return false }
    })
  }

  // filter on category
  if (filter.category) {
    renderRecipes = renderRecipes.filter(r => r.category === filter.category)
  }

  // filter on user
  if (user) {
    if (filter.userRecipes) {
      renderRecipes = renderRecipes.filter(r => r.uid === user.uid)
    }
  }

  const filterDetails = () => {
    return (
      <p style={{textAlign: "center"}} className="filter-details m-0">
        Filter: <span className="bold-detail">{filter.userRecipes ? 'my' : 'all'}</span> recipes        
        { filter.search.title ? <>, <span className="bold-detail">search: </span>"{filter.search.title}"</> : '' }
        { filter.search.ingredients ? <>, <span className="bold-detail">ingredients: </span>"{filter.search.ingredients}"</> : '' }
        { filter.tag ? <>, <span className="bold-detail">tag: </span>{filter.tag}</> : '' }
        { filter.category ? <>, <span className="bold-detail">category: </span>{filter.category}</> : '' }
      </p>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>

      <div className="filter-details-container p-2 px-3 mb-4" style={{ borderBottom: ".75px solid rgb(192, 192, 192)", borderRadius: "2%" }}>        
        {filterDetails()}
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