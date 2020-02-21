import React from 'react'
import { Link } from 'react-router-dom'
import './index.scss'

export default function RecipeCard(props) {
  
  const recipe = props.recipe
  const urlRegex = /https?:/
  
  let imgSrc = urlRegex.test(recipe.img_path) ? recipe.img_path : `https://firebasestorage.googleapis.com/v0/b/cookbook-96444.appspot.com/o/images%2F${recipe.img_path}?alt=media`

  return (
    <div className="recipe-card">
      <Link to={`/recipe/${recipe.id}`} className="text-body text-decoration-none ">

        <div className="recipe-card-inner m-3" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <img className="recipe-card-img" src={imgSrc} />
          <p style={{fontSize: "1.25rem", textAlign: "center"}} className="mt-1">{recipe.name}</p>
        </div>

      </Link>
    </div>
  )
}