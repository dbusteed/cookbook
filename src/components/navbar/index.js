import React, { useState, useContext, useEffect } from 'react'
import { Form, FormControl, Button , Dropdown, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import { FilterContext, UserContext } from '../../filterContext'
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Collapse } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'

// icons TODO all rounded
import HomeRoundedIcon from '@material-ui/icons/HomeRounded'
import AddRoundedIcon from '@material-ui/icons/AddRounded'
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded'
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded'
import MenuRoundedIcon from '@material-ui/icons/MenuRounded'
import SearchRoundedIcon from '@material-ui/icons/SearchRounded'

import Divider from '@material-ui/core/Divider'

export default function NavBar() {

  const [search, setSearch] = useState('')
  const [drawer, setDrawer] = useState(false)
  const [drawerFilter, setDrawerFilter] = useState(false)
  const [filterMenu, setFilterMenu] = useState(null)
  
  const {filter, setFilter} = useContext(FilterContext)
  const {user, setUser} = useContext(UserContext)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('yes user!')
        setFilter({...filter, userRecipes: true})
      } else {
        console.log('no user!')
      }
    })
  }, [])

  const handleSignout = () => {
    console.log('signing out!')
    firebase.auth().signOut()
    setUser(null)
    setFilter({...filter, userRecipes: false})
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setFilter({...filter, search: search.toLowerCase()})
  }

  const handleCategory = (cat) => {
    setFilter({...filter, category: cat})
  }

  const handleUserRecipes = (bool) => {
    setFilter({...filter, userRecipes: bool})
  }

  const closeDrawer = () => {
    setDrawer(false)
    setDrawerFilter(false)
  }

  firebase.auth().onAuthStateChanged(user => {
    setUser(user)
  })

  const categories = ["Breakfast", "Lunch/Dinner", "Snacks/Sides", "Desserts", "Other"]

  return (
    <>
      <div className="full-navbar">
        <div className="navbox side-nav-box">
          <div className="navitem">
            <Link to="/">
              <IconButton>
                <HomeRoundedIcon style={{color: "black"}} fontSize="large" />
              </IconButton>
            </Link>
          </div>
        </div>

        <div className="navbox center-nav-box">
          <Form onSubmit={handleSearch} inline>
            <FormControl type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
            {/* <IconButton type="submit"><SearchRoundedIcon style={{color: "black"}} fontSize="large" /></IconButton> */}
          </Form>

          <IconButton aria-controls="full-filter-menu" aria-haspopup="true" onClick={(e) => setFilterMenu(e.currentTarget)}>
            <FilterListRoundedIcon style={{color: "black"}} fontSize="large" />
          </IconButton>

          <Menu
            className="full-filter-menu"
            anchorEl={filterMenu}
            open={Boolean(filterMenu)}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            onClose={() => setFilterMenu(null)}
            style={{padding: "10px"}}
          >
            <MenuItem 
              selected={filter.category === ''} 
              onClick={() => {
                handleCategory('')
                setFilterMenu(null)
              }}>All Categories</MenuItem>
            {
              categories.map(cat => (
                <MenuItem key={cat}
                  selected={filter.category === cat}
                  onClick={() => {
                    handleCategory(cat)
                    setFilterMenu(null)
                  }}>{cat}</MenuItem>
              ))
            }
            {
              user
              ?
              [
                <hr key={"hr"} />,
                
                <MenuItem key={"my"}
                  selected={filter.userRecipes}
                  onClick={() => {
                    handleUserRecipes(true)
                    setFilterMenu(null)
                  }}>My Recipes</MenuItem>,
                
                <MenuItem key={"all"}
                  selected={!filter.userRecipes}
                  onClick={() => {
                    handleUserRecipes(false)
                    setFilterMenu(null)
                  }}>All Recipes</MenuItem>,
              ]
              : null
            }
          </Menu>
        </div>

        <div className="navbox side-nav-box side-nav-box-right">
          <div className="navitem mr-2">
            {
              user
              ? 
                <>
                  <Link to="/add">                    
                      <IconButton>
                        <AddRoundedIcon style={{color: "black"}} fontSize="large" />
                      </IconButton>                    
                  </Link>                                  
                  
                  <IconButton onClick={handleSignout}>
                    <ExitToAppRoundedIcon style={{color: "black"}} fontSize="large" />
                  </IconButton>                  
                </>

              : 
              <Link to="/login">            
                <IconButton>
                  <ExitToAppRoundedIcon style={{color: "black"}} fontSize="large" />
                </IconButton>                
              </Link>
            }
          </div>
        </div>
      </div>

      <div className="mini-navbar">
        <div className="mini-navbar-top">
          <IconButton onClick={() => setDrawer(true)}>
            <MenuRoundedIcon style={{color: "black"}} fontSize="large" />
          </IconButton>
          
          <Form onSubmit={handleSearch} style={{flexFlow: "nowrap", justifyContent: "flex-end", flexGrow: "1"}} inline> 
            <FormControl type="text" placeholder="Search" className="mr-1" value={search} onChange={e => setSearch(e.target.value)} />
            <IconButton type="submit"><SearchRoundedIcon style={{color: "black"}} fontSize="large" /></IconButton>
          </Form>
          
          {/* opens with the button is pressed */}
          <Drawer open={drawer} onClose={closeDrawer}>
            <div className="mr-4" style={{height: "100%"}}>
              <List>
                <Link to={"/"} className="text-body text-decoration-none">
                  <ListItem onClick={closeDrawer}>
                    <ListItemIcon><HomeRoundedIcon style={{color: "black"}} /></ListItemIcon>
                    <ListItemText primary={"Home"} />
                  </ListItem>
                </Link> 
                <ListItem onClick={() => setDrawerFilter(!drawerFilter)}>
                  <ListItemIcon><FilterListRoundedIcon style={{color: "black"}} /></ListItemIcon>
                  <ListItemText primary={"Filter Recipes"} />
                </ListItem>
                <Collapse in={drawerFilter} timeout="auto">
                  <List className="pl-5">
                    <ListItem selected={filter.category === ''}
                      onClick={() => handleCategory('')}>
                      <ListItemText primary={"All Categories"} />
                    </ListItem>
                    {
                      categories.map(cat => (
                        <ListItem key={cat}
                          selected={filter.category === cat}
                          onClick={() => handleCategory(cat)}>
                          <ListItemText primary={cat} />
                        </ListItem>
                      ))
                    }
                    {
                      user
                      ? <>
                          <Divider className="my-1" />
                          <ListItem selected={filter.userRecipes}
                            onClick={() => handleUserRecipes(true)}>
                            <ListItemText primary="My Recipes" />
                          </ListItem>
                          <ListItem selected={!filter.userRecipes}
                            onClick={() => handleUserRecipes(false)}>
                            <ListItemText primary="All Recipes" />
                          </ListItem>
                        </>
                      : null
                    }
                  </List>
                </Collapse>
                {
                  user
                  ? 
                    <>
                      <Link to={"/add"} className="text-body text-decoration-none">
                        <ListItem onClick={closeDrawer}>
                          <ListItemIcon><AddRoundedIcon style={{color: "black"}} /></ListItemIcon>
                          <ListItemText primary={"Add Recipe"} />
                        </ListItem>
                      </Link>
                      {/* <Divider /> */}
                      <Link to={"/"} className="text-body text-decoration-none">
                        <ListItem onClick={() => {
                          handleSignout()
                          closeDrawer()
                        }}>
                          <ListItemIcon><ExitToAppRoundedIcon style={{color: "black"}} /></ListItemIcon>
                          <ListItemText primary={"Signout"} />
                        </ListItem>
                      </Link>
                    </>
                  : 
                    <>
                      {/* <Divider /> */}
                      <Link to={"/login"} className="text-body text-decoration-none">
                        <ListItem onClick={closeDrawer}>
                          <ListItemIcon><ExitToAppRoundedIcon style={{color: "black"}} /></ListItemIcon>
                          <ListItemText primary={"Login"} />
                        </ListItem>
                      </Link>
                    </>
                }
              </List>
            </div>
          </Drawer>
        </div>
      </div>
    </>
  )
}
