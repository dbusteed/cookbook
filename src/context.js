import { createContext } from "react"

export const startingFilter = {
  search: {
    title: '',
    ingredients: ''
  },
  tag: '',
  category: '',
  userRecipes: false
}

export const FilterContext = createContext(startingFilter)
export const RecipeContext = createContext([])
export const UserContext = createContext(null)
export const User2Context = createContext(null)
export const AllUsersContext = createContext(null)
export const MetaContext = createContext(null)