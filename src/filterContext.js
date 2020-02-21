import { createContext } from "react"

export const startingFilter = {
  search: '',
  category: '',
  userRecipes: false
}

export const FilterContext = createContext(startingFilter)

export const RecipeContext = createContext([])

export const UserContext = createContext(null)