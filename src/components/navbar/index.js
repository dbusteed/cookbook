import React, { useState, useContext, useEffect } from 'react'
import './index.css'
import { Form, FormControl } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import { FilterContext, UserContext, startingFilter, MetaContext } from '../../context'

// material stuff
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Collapse, TextField, Button, Paper } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'

// material icons
import HomeRoundedIcon from '@material-ui/icons/HomeRounded'
import AddRoundedIcon from '@material-ui/icons/AddRounded'
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded'
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded'
import MenuRoundedIcon from '@material-ui/icons/MenuRounded'
import SearchRoundedIcon from '@material-ui/icons/SearchRounded'
// import HelpOutlineRoundedIcon from '@material-ui/icons/HelpOutlineRounded'

export default function NavBar() {

  const [search, setSearch] = useState('')
  const [advName, setAdvName] = useState('')
  const [advIng, setAdvIng] = useState('')
  const [drawer, setDrawer] = useState(false)
  const [searchDrawer, setSearchDrawer] = useState(false)
  const [drawerFilter, setDrawerFilter] = useState(false)
  const [filterMenu, setFilterMenu] = useState(null)
  const [categories, setCategories] = useState([])
  
  const {filter, setFilter} = useContext(FilterContext)
  const {user, setUser} = useContext(UserContext)
  const {meta} = useContext(MetaContext)

  useEffect(() => {

    let cats = meta.categories.split('<SEP>')
    setCategories(cats)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta])

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setFilter({...filter, userRecipes: true})
      }
    })
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSignout = () => {
    console.log('signing out!')
    firebase.auth().signOut()
    setUser(null)
    setFilter({...filter, userRecipes: false})
  }

  const handleSearch = (s) => {
    setSearch(s)
    setFilter({...filter, search: {...filter.search, title: s.toLowerCase()}})
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

  const resetFilter = () => {
    setSearch('')
    setAdvName('')
    setAdvIng('')
    setFilter({...startingFilter, userRecipes: user ? true : false})
  }

  firebase.auth().onAuthStateChanged(user => {
    setUser(user)
  })

  return (
    <>
      <Paper className="full-navbar my-nav" elevation={3}>
        <div className="navbox side-nav-box">
          <div className="navitem">
            <Link to="/" onClick={resetFilter}>
              <IconButton>
                <HomeRoundedIcon style={{color: "black"}} fontSize="large" />
              </IconButton>
            </Link>
          </div>
          {/* <div className="navitem">
            <Link to="/help">
              <IconButton>
                <HelpOutlineRoundedIcon style={{color: "black"}} fontSize="large" />
              </IconButton>
            </Link>
          </div> */}
        </div>

        <div className="navbox center-nav-box">
          <Form onSubmit={e => e.preventDefault()} inline>
            <FormControl type="text" placeholder="Search" value={search}  onChange={e => handleSearch(e.target.value)} />            
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
            <MenuItem onClick={() => {
              setSearchDrawer(true)
              setFilterMenu(null)
            }}>
              Advanced Search
            </MenuItem>

            <hr />

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

          <Drawer anchor="top" open={searchDrawer} onClose={() => setSearchDrawer(false)}> 
            <div className="adv-search-container">
              <h2>Advanced Search</h2>
              <hr />
              <TextField className="mb-2" value={advName} onChange={e => setAdvName(e.target.value)} label="search by name" variant="outlined" />
              <TextField className="mb-2" value={advIng} onChange={e => setAdvIng(e.target.value)} label="search by ingredient" variant="outlined" />
              <Button className="my-2" variant="outlined" onClick={() => {                
                setFilter({...filter, search: {title: advName.toLowerCase(), ingredients: advIng.toLowerCase()}})
                setDrawer(false)
                setSearchDrawer(false)
              }}>search</Button>
            </div>
          </Drawer>

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
      </Paper>

      <Paper className="mini-navbar my-nav" elevation={3}>
        <div className="mini-navbar-top">
          <IconButton onClick={() => setDrawer(true)}>
            <MenuRoundedIcon style={{color: "black"}} fontSize="large" />
          </IconButton>
          
          <Form onSubmit={e => e.preventDefault()} style={{flexFlow: "nowrap", justifyContent: "flex-end", flexGrow: "1"}} inline> 
            <FormControl type="text" placeholder="Search" className="mr-3" value={search} onChange={e => handleSearch(e.target.value)} />
          </Form>
          
          {/* opens with the button is pressed */}
          <Drawer open={drawer} onClose={closeDrawer}>
            <div className="mr-4" style={{height: "100%"}}>
              <List>
                <Link to={"/"} className="text-body text-decoration-none">
                  <ListItem onClick={() => {
                    closeDrawer()
                    resetFilter()
                  }}>
                    <ListItemIcon><HomeRoundedIcon style={{color: "black"}} /></ListItemIcon>
                    <ListItemText primary={"Home"} />
                  </ListItem>
                </Link>
                <ListItem onClick={() => {
                  setSearchDrawer(true)
                  setFilterMenu(null)
                }}>
                  <ListItemIcon><SearchRoundedIcon style={{color: "black"}} /></ListItemIcon>
                  <ListItemText primary={"Advanced Search"} />
                </ListItem>
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
      </Paper>
    </>
  )
}
