import React, { useState, useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import NavBar from './components/navbar'
import Recipes from './components/recipes'
import RecipeDetail from './components/recipeDetail'
import Login from './components/login'
import Signup from './components/signup'
import AddRecipe from './components/addRecipe'
import EditRecipe from './components/editRecipe'
import { FilterContext, startingFilter, RecipeContext, UserContext } from './filterContext'
import firebase from './firebase'

export default function App() {

  const [filter, setFilter] = useState(startingFilter)
  const [recipes, setRecipes] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const db = firebase.firestore()
    let recRef = db.collection('recipes')
    let docs = []

    // console.log('grabbing recipes!')
    recRef.get().then(query => {
      query.forEach(doc => {
        docs.push({...doc.data(), id: doc.id})
      })

      docs.sort((a,b) => b.create_date - a.create_date)

      setRecipes(docs)

    })
    .catch(err => {
      console.log(err)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Router>

      {/* maybe a better way to do this? */}
      <FilterContext.Provider value={{filter, setFilter}}>
        <RecipeContext.Provider value={{recipes, setRecipes}}>
          <UserContext.Provider value={{user, setUser}}>

            <div style={{display: "flex", flexDirection: "column"}}>
              
              <NavBar />
              
              <div id="content" className="mt-4">
                <div className="content-gutter"></div>
                <div className="main-content">
                  <Switch>
                    <Route path="/recipe" component={RecipeDetail} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/add" component={AddRecipe} />
                    <Route path="/edit" component={EditRecipe} />
                    <Route path="/" component={Recipes}/>
                  </Switch>
                </div>
                <div className="content-gutter"></div>
              </div>
            
            </div>

          </UserContext.Provider>
        </RecipeContext.Provider>
      </FilterContext.Provider>
    </Router>
  )
}