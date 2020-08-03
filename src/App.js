import React, { useState, useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import NavBar from './components/navbar'
import RecipeList from './components/recipeList'
import RecipeDetail from './components/recipeDetail'
import Login from './components/login'
import Signup from './components/signup'
import AddRecipe from './components/addRecipe'
import EditRecipe from './components/editRecipe'
import Help from './components/help'
import { FilterContext, startingFilter, RecipeContext, UserContext, MetaContext, AllUsersContext } from './context'
import firebase from './firebase'

export default function App() {

  const [filter, setFilter] = useState(startingFilter)
  const [recipes, setRecipes] = useState([])
  const [meta, setMeta] = useState({'tags': '', 'categories': ''})
  const [user, setUser] = useState(null)
  const [allUsers, setAllUsers] = useState(null)

  useEffect(() => {
    const db = firebase.firestore()
    let recRef = db.collection('recipes')
    let docs = []

    let metaRef = db.collection('meta').doc('meta')
    metaRef.get().then(doc => {
      setMeta({
        'categories': doc.data().categories,
        'tags': doc.data().tags
      })
    })

    let usersRef = db.collection('users')
    let users = {}
    usersRef.get().then(query => {
      query.forEach(doc => {
        users[doc.id] = doc.data()
      })
    }).then(() => {
      setAllUsers(users)
    })

    console.log('GRABBING RECIPES!')
    recRef.get().then(query => {
      query.forEach(doc => {
        docs.push({...doc.data(), id: doc.id}) 
      })

      // sort by date
      // docs.sort((a,b) => b.create_date - a.create_date)

      // sort by name
      docs.sort(function(a,b) {
        if(a.name > b.name) {
          return 1
        }
        if(b.name > a.name) {
          return -1
        }
        return 0
      })

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
            <AllUsersContext.Provider value={{allUsers, setAllUsers}}>
              <MetaContext.Provider value={{meta, setMeta}}>

                <div style={{display: "flex", flexDirection: "column", height: "100vh" }}>
                  
                  <NavBar />
                  
                  <div id="content">
                    <div className="content-gutter"></div>
                    <div className="main-content">
                      <Switch>
                        <Route path="/recipe" component={RecipeDetail} />
                        <Route path="/login" component={Login} />
                        <Route path="/signup" component={Signup} />
                        <Route path="/add" component={AddRecipe} />
                        <Route path="/edit" component={EditRecipe} />
                        <Route path="/help" component={Help} />
                        <Route path="/" component={RecipeList}/>
                      </Switch>
                    </div>
                    <div className="content-gutter"></div>
                  </div>
                
                </div>

              </MetaContext.Provider>
            </AllUsersContext.Provider>
          </UserContext.Provider>
        </RecipeContext.Provider>
      </FilterContext.Provider>

    </Router>
  )
}