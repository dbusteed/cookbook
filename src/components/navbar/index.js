import React, { useState, useContext, useEffect } from 'react'
import './index.css'
import { Form, FormControl, InputGroup } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import firebase from '../../firebase'
import { FilterContext, UserContext, startingFilter, MetaContext } from '../../context'

// material stuff
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Collapse from '@mui/material/Collapse'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { FormControl as MUIFC } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'

// material icons
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'

export default function NavBar() {

  // state variables
  const [search, setSearch] = useState('')
  const [_1, setAdvTag] = useState('')
  const [_2, setAdvIng] = useState('')
  const [_3, setAdvCat] = useState('')
  const [_4, setAdvUser] = useState('')
  const [drawer, setDrawer] = useState(false)
  const [drawerFilter, setDrawerFilter] = useState(false)
  const [filterMenu, setFilterMenu] = useState(null)
  const [userMenu, setUserMenu] = useState(null)
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  
  // context variables
  const {filter, setFilter} = useContext(FilterContext)
  const {user, setUser} = useContext(UserContext)
  const {meta} = useContext(MetaContext)

  // other hooks
  const history = useHistory()

  // const theme = createTheme({
  //   components:
  // });

  useEffect(() => {
    let cats = meta.categories.split('<SEP>')
    setCategories(cats)

    let tags = meta.tags.split('<SEP>')
    setTags(tags)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta])

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setFilter({...filter, userRecipes: true})
        setAdvUser(true)
      } else {
        setAdvUser(false)
      }
    })
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSignout = () => {
    firebase.auth().signOut()
    setUser(null)
    setFilter({...filter, userRecipes: false})
    setUserMenu(null)
  }

  const handleSearch = (s) => {
    setSearch(s)
    setFilter({...filter, search: {...filter.search, title: s.toLowerCase()}})
    
    if (window.location.pathName !== '/') {
      history.push('/')
    }
  }

  const handleCategory = (cat) => {
    setFilter({...filter, category: cat})
    history.push('/')
  }

  const handleUserRecipes = (bool) => {
    setFilter({...filter, userRecipes: bool})
    history.push('/')
  }

  const closeDrawer = () => {
    setDrawerFilter(false)
    setDrawer(false)
  }

  const clearFilter = () => {
    setFilter({...startingFilter})
  }

  firebase.auth().onAuthStateChanged(user => {
    setUser(user)
  })

  return (
    <>
      <Paper className="full-navbar my-nav" elevation={3}>
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
          <Form onSubmit={e => e.preventDefault()} inline>
            <FormControl type="text" placeholder="Search" value={search}  onChange={e => handleSearch(e.target.value)} />
            <span className="search-x" style={{"display": search ? "block" : "none"}}>
              <ClearRoundedIcon style={{"color": "#6C747C"}} onClick={() => handleSearch('')} />
            </span>
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
            {
              user &&
                
                <MenuItem className="mb-2" style={{"justifyContent": "space-around"}}>
                  <>
                    <Button variant={filter.userRecipes ? "contained" : "text"} onClick={() => {
                      setAdvUser(true)
                      handleUserRecipes(true)
                    }}>My Recipes</Button>
                    <Button variant={filter.userRecipes ? "text" : "contained"} onClick={() => {
                      setAdvUser(false)
                      handleUserRecipes(false)
                    }}>All Recipes</Button>
                  </>
                </MenuItem>
            }

            <MenuItem
              className="mb-2"
              style={{"paddingBottom": 0}}
            >
              <MUIFC variant="outlined" style={{flex: "1 0 0"}}> 
                <InputLabel id="cat-label">filter by category</InputLabel>
                <Select
                  labelId="cat-label"
                  id="cat-label"
                  value={filter.category}
                  onChange={e => {
                    setAdvCat(e.target.value)
                    handleCategory(e.target.value)
                  }}
                  label="filter by category"
                >
                  <MenuItem value={""}>
                    <em>none</em>
                  </MenuItem>
                  {
                    categories.map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))
                  }
                </Select>
              </MUIFC>
            </MenuItem>

            <MenuItem 
              className="mb-2"
              style={{"paddingBottom": 0}}
            >
              <MUIFC variant="outlined" style={{flex: "1 0 0"}}> 
                <InputLabel id="tag-label">filter by tag</InputLabel>
                <Select
                  labelId="tag-label"
                  id="tag-label"
                  value={filter.tag}
                  onChange={e => {
                    setAdvTag(e.target.value)
                    setFilter({...filter, tag: e.target.value})
                    history.push('/')
                  }}
                  label="filter by tag"
                >
                <MenuItem value={""}>
                  <em>none</em>
                </MenuItem>
                {
                  tags.map(tag => (
                    <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                  ))
                }
                </Select>
              </MUIFC>
            </MenuItem>

            <MenuItem
              className="mb-3"
              style={{"paddingBottom": 0}}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <TextField
                value={filter.search.ingredients}
                onChange={e => {
                  setAdvIng(e.target.value)
                  setFilter()
                  setFilter({...filter, search: {...filter.search, ingredients: e.target.value.toLowerCase()}})
                  history.push('/')
                }}
                label="search by ingredient"
                variant="outlined" 
                style={{flex: "1 0 0"}}
              />
            </MenuItem>

            <MenuItem style={{"justifyContent": "center"}}>
              <Button variant="outlined" onClick={clearFilter}>Clear Filters</Button>
            </MenuItem>

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

                  <IconButton onClick={e => setUserMenu(e.currentTarget)}>
                    <AccountCircleRoundedIcon style={{color: "black"}} fontSize="large" />
                  </IconButton>

                  <Menu
                    anchorEl={userMenu}
                    open={Boolean(userMenu)}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}                  
                    onClose={() => setUserMenu(null)}
                    style={{padding: "2rem"}}
                  >
                    <Link to="/shopping-list" className="text-body text-decoration-none">
                      <MenuItem onClick={() => setUserMenu(null)}>
                        <ListItemIcon><ShoppingCartOutlinedIcon style={{color: "black"}} /></ListItemIcon>
                        <ListItemText primary={"Shopping List"} />
                      </MenuItem>
                    </Link>

                    <Link to="/help" className="text-body text-decoration-none">
                      <MenuItem onClick={() => setUserMenu(null)}>
                        <ListItemIcon><HelpOutlineRoundedIcon style={{color: "black"}} /></ListItemIcon>
                        <ListItemText primary={"Help & Tips"} />
                      </MenuItem>
                    </Link>

                    <MenuItem onClick={handleSignout}>
                      <ListItemIcon><ExitToAppRoundedIcon style={{color: "black"}} /></ListItemIcon>
                      <ListItemText primary={"Logout"} />
                    </MenuItem>

                  </Menu>              
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
          
          <Form onSubmit={e => e.preventDefault()} style={{flexFlow: "nowrap", justifyContent: "flex-end", flexGrow: "1"}} className="mr-3" inline> 
            <FormControl type="text" placeholder="Search" value={search} onChange={e => handleSearch(e.target.value)} />
            <span className="search-x" style={{"display": search ? "block" : "none", "paddingLeft": "-3rem"}}>
              <ClearRoundedIcon style={{"color": "#6C747C"}} onClick={() => handleSearch('')} />
            </span>
          </Form>
          
          <Drawer open={drawer} onClose={closeDrawer}>
            <div className="mr-4" style={{height: "100%"}}>
              <List className="mobile-drawer-list">

                {/* top group */}
                <div>

                  {/* HOME */}
                  <Link to={"/"} className="text-body text-decoration-none">
                    <ListItem onClick={() => {
                      closeDrawer()
                    }}>
                      <ListItemIcon><HomeRoundedIcon style={{color: "black"}} /></ListItemIcon>
                      <ListItemText primary={"Home"} />
                    </ListItem>
                  </Link>
                  
                  <ListItem onClick={() => {setDrawerFilter(!drawerFilter)}}>
                    <ListItemIcon><FilterListRoundedIcon style={{color: "black"}} /></ListItemIcon>
                    <ListItemText primary={"Filter Recipes"} />
                  </ListItem>

                  <Collapse in={drawerFilter} timeout="auto">
                    <List className="pl-4" style={{"display": drawerFilter ? "block" : "none", "width": "80vw"}}>

                      {
                        user &&
                          
                          <ListItem className="pb-3" style={{"justifyContent": "space-around"}}>
                            <>
                              <Button variant={filter.userRecipes ? "contained" : "text"} onClick={() => {
                                setAdvUser(true)
                                handleUserRecipes(true)
                              }}>My Recipes</Button>
                              <Button variant={filter.userRecipes ? "text" : "contained"} onClick={() => {
                                setAdvUser(false)
                                handleUserRecipes(false)
                              }}>All Recipes</Button>
                            </>
                          </ListItem>
                      }

                      <ListItem style={{"paddingBottom": 0}}>
                        <MUIFC className="mb-2" variant="outlined" style={{flex: "1 0 0"}}> 
                          <InputLabel id="cat-label">filter by category</InputLabel>
                          <Select
                            labelId="cat-label"
                            id="cat-label"
                            value={filter.category}
                            onChange={e => {
                              setAdvCat(e.target.value)
                              handleCategory(e.target.value)
                            }}
                            label="filter by category"
                          >
                          <MenuItem value={""}>
                            <em>none</em>
                          </MenuItem>
                          {
                            categories.map(cat => (
                              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))
                          }
                          </Select>
                        </MUIFC>
                      </ListItem>

                      <ListItem style={{"paddingBottom": 0}}>
                        <MUIFC className="mb-2" variant="outlined" style={{flex: "1 0 0"}}> 
                          <InputLabel id="tag-label">filter by tag</InputLabel>
                          <Select
                            labelId="tag-label"
                            id="tag-label"
                            value={filter.tag}
                            onChange={e => {
                              setAdvTag(e.target.value)
                              setFilter({...filter, tag: e.target.value})
                              history.push('/')
                            }}
                            label="filter by tag"
                          >
                          <MenuItem value={""}>
                            <em>none</em>
                          </MenuItem>
                          {
                            tags.map(tag => (
                              <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                            ))
                          }
                          </Select>
                        </MUIFC>
                      </ListItem>

                      <ListItem style={{"paddingBottom": 0}}>
                        <TextField
                          className="mb-2"
                          value={filter.search.ingredients}
                          onChange={e => {
                            setAdvIng(e.target.value)
                            setFilter()
                            setFilter({...filter, search: {...filter.search, ingredients: e.target.value.toLowerCase()}})
                            history.push('/')
                          }}
                          label="search by ingredient"
                          variant="outlined" 
                          style={{flex: "1 0 0"}}
                        />
                      </ListItem>

                    </List>
                  </Collapse>
                
                  {
                    user &&
                    <>
                      <Link to="/shopping-list" className="text-body text-decoration-none">
                        <ListItem onClick={closeDrawer}>
                          <ListItemIcon><ShoppingCartOutlinedIcon style={{color: "black"}} /></ListItemIcon>
                          <ListItemText primary={"Shopping List"} />
                        </ListItem>
                      </Link>

                      <Link to={"/add"} className="text-body text-decoration-none">
                        <ListItem onClick={closeDrawer}>
                          <ListItemIcon><AddRoundedIcon style={{color: "black"}} /></ListItemIcon>
                          <ListItemText primary={"Add Recipe"} />
                        </ListItem>
                      </Link>
                    </>
                  }

                </div>

                {/* bottom group */}
                <div>
                  <Link to={"/help"} className="text-body text-decoration-none">
                    <ListItem onClick={closeDrawer}>
                      <ListItemIcon><HelpOutlineRoundedIcon style={{color: "black"}} /></ListItemIcon>
                      <ListItemText primary={"Help & Tips"} />
                    </ListItem>
                  </Link>

                  {
                    user 
                    
                    ? <Link to={"/"} className="text-body text-decoration-none">
                        <ListItem onClick={() => {
                          handleSignout()
                          closeDrawer()
                        }}>
                          <ListItemIcon><ExitToAppRoundedIcon style={{color: "black"}} /></ListItemIcon>
                          <ListItemText primary={"Signout"} />
                        </ListItem>
                      </Link>
                    
                    : <Link to={"/login"} className="text-body text-decoration-none">
                        <ListItem onClick={closeDrawer}>
                          <ListItemIcon><ExitToAppRoundedIcon style={{color: "black"}} /></ListItemIcon>
                          <ListItemText primary={"Login"} />
                        </ListItem>
                      </Link>
                  }

                </div>
              </List>
            </div>
          </Drawer>
        </div>
      </Paper>
    </>
  )
}
