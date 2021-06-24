import React, { useContext } from 'react'
import './index.css'
import RecipeCard from '../recipeCard'
import { Spinner } from 'react-bootstrap'
import { FilterContext, RecipeContext, UserContext } from '../../context'
import { Chip } from '@material-ui/core'

export default function RecipeList(props) {

  // context variables
  const { recipes } = useContext(RecipeContext)
  const { filter, setFilter } = useContext(FilterContext)
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
    
      renderRecipes = renderRecipes.filter(r => {
        if(r.uid === user.uid) { return true }
        else if('followers' in r && r.followers.indexOf(user.uid) >= 0) { return true }
        else { return false }
      })

    }
  }

  const filterDetails = () => {
    if (filter.userRecipes ||
        filter.category ||
        filter.tag ||
        filter.search.ingredients) {

      return (
        <div className="filter-details-container p-2 px-3 mb-4" style={{ borderBottom: ".75px solid rgb(192, 192, 192)", borderRadius: "2%" }}>
          {
            filter.userRecipes &&
            <Chip className="filter-chip" size="small" variant="outlined" onDelete={() => {
              setFilter({...filter, userRecipes: false})
            }} label={"My Recipes"} />
          }

          {/* {
            filter.search.title &&
            <Chip className="filter-chip" size="small" variant="outlined" onDelete={() => {
              setFilter({...filter, search: {...filter.search, title: ''}})
            }} label={`"${filter.search.title}"`} />
          } */}
          
          {
            filter.category &&
            <Chip className="filter-chip" size="small" variant="outlined" onDelete={() => {
              setFilter({...filter, category: ''})
            }} label={filter.category} />
          }

          {
            filter.tag &&
            <Chip className="filter-chip" size="small" variant="outlined" onDelete={() => {
              setFilter({...filter, tag: ''})
            }} label={filter.tag} />
          }

          {
            filter.search.ingredients &&
            <Chip className="filter-chip" size="small" variant="outlined" onDelete={() => {
              setFilter({...filter, search: {...filter.search, ingredients: ''}})
            }} label={`"${filter.search.ingredients}"`} />
          }
        </div>
      )
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>

      {filterDetails()}

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