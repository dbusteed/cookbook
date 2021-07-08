import React, { useContext, useRef, useState, useEffect } from 'react'
import { UserContext, User2Context } from '../../context'
import './index.css'
import DynamicListItem from '../listItems/dynamicListItem'
import StaticListItem from '../listItems/staticListItem'
import SwipeListItem from '../listItems/swipeListItem'
import { IconButton, Button, Snackbar, ButtonGroup } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import FormatListBulletedOutlinedIcon from '@material-ui/icons/FormatListBulletedOutlined'
import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list'
import '@sandstreamdev/react-swipeable-list/dist/styles.css'
import firebase from '../../firebase'
import { CopyToClipboard } from 'react-copy-to-clipboard'


export default function ShoppingList() {

  const { user } = useContext(UserContext)
  const { user2 } = useContext(User2Context)

  const inputRef = useRef()
  const inputRef2 = useRef()
  const [listItems, setListItems] = useState({})
  const [sections, setSections] = useState([])
  const [recipeLookup, setRecipeLookup] = useState({})
  const [renderSections, setRenderSections] = useState([])
  const [isSaved, setIsSaved] = useState(true)
  const [snackbar, setSnackbar] = useState(false)
  const [grouping, setGrouping] = useState("recipe")

  const db = firebase.firestore()

  const alphaSort = (a,b) => {
    if (a > b) {
      return 1
    } else {
      return -1
    }
  }

  useEffect(() => {
    if(user2) {

      setRecipeLookup(
        Object.values(user2.shoppingListItems)
          .reduce((obj, li) => {
            obj[li.rid] = li.rname
            return obj
          }, {'zzzzz': 'Other'})
      )

      setSections(
        Array.from(
          new Set(
            Object.values(user2.shoppingListItems)
              .map(item => item.rid)
          )
        )
      )
      
      setListItems(
        Object.keys(user2.shoppingListItems)
          .reduce((obj, k) => {
            obj[k] = {...user2.shoppingListItems[k], editing: false}
            return obj
          }, {})
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user2])

  useEffect(() => {
    if(user2) {
      if(grouping === 'recipe') {
        setSections(
          Array.from(
            new Set(
              Object.values(listItems)
                .map(item => item.rid)
            )
          ).sort(alphaSort)
        )
      } else {
        setSections(
          Array.from(
            new Set(
              Object.values(listItems)
                .map(item => item.cat)
            )
          ).sort(alphaSort)
        )
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grouping, listItems])

  const guid = () => {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  }

  const addListItem = () => {
    setIsSaved(false)
    setListItems(
      {
        ...listItems,
        [guid()]: {
          rid: 'zzzzz', rname: "Other", text: "", editing: true, cat: "Other"
        }
      }
    )
  }

  const removeListItem = (key) => {
    setIsSaved(false)
    
    setListItems(
      Object.keys(listItems).reduce((obj, k) => {
        if(k !== key) {
          obj[k] = listItems[k]
        }
        return obj
      }, {})
    )
  }

  const removeSection = (key) => {
    setIsSaved(false)

    setListItems(
      Object.keys(listItems).reduce((obj, k) => {
        if(listItems[k].rid !== key && listItems[k].cat !== key) {
          obj[k] = listItems[k]
        }
        return obj
      }, {})
    )
  }

  const saveList = () => {
    // user2.shoppingListRecipes = sections
    user2.shoppingListItems = listItems

    setIsSaved(true)

    db.collection('users').doc(user.uid).set(user2)
    .then(res => {
      // pass
    })
    .catch(err => {
      console.log(err)
    })
  }

  const deleteList = () => {
    setListItems([])
    user2.shoppingListItems = {}

    db.collection('users').doc(user.uid).set(user2)
    .then(res => {
      // pass
    })
    .catch(err => {
      console.log(err)
    })
  }

  const deleteTile =
    <div className="delete-tile">
      <div className="delete-tile-inner">
        <span>Delete</span>
      </div>
    </div>

  const editTile =
    <div className="edit-tile">
      <div className="edit-tile-inner">
        <span>Edit</span>
      </div>
    </div>

  const listItemsToText = () => {
    let list = ''
    Object.values(listItems).forEach(item => {
      list += item.text + "\n"
    })
    return list
  }

  const renderList = () => { 
    if(user2) {

      if(user2.shoppingListItems && Object.keys(user2.shoppingListItems).length > 0) {

        return (
          <>
          <div className="shopping-list">
            {
              sections
                .map((sec) => (
                  <div className="shopping-list-section" key={sec}>
                    <div className="shopping-list-left">
                      <ul style={{listStyle: "none", marginBottom: "0"}}>
                        {
                          grouping === 'recipe'
                          ? <StaticListItem
                              text={recipeLookup[sec]}
                              removeItem={() => removeSection(sec)}
                            />
                          : <StaticListItem
                              text={sec}
                              removeItem={() => removeSection(sec)}
                            />
                        }
                      </ul>
                    </div>
                    <div className="shopping-list-right">
                      <ul style={{listStyle: "none", marginBottom: "0"}}>
                        {
                          Object.entries(listItems)
                            .filter(([k, v]) => (v.rid === sec || v.cat === sec))
                            .map(([key, item], idx) => (
                              <DynamicListItem
                                key={key}
                                text={listItems[key].text}
                                childRef={inputRef}
                                placeholder="Enter shopping list item"
                                type="input"
                                removeItem={() => removeListItem(key)}
                                updateItem={() => {
                                  setIsSaved(false)
                                  setListItems({...listItems, [key]: {...item, text: inputRef.current.value}})
                                }}
                                initEditing={listItems[key].text ? false : true}
                              >
                                <input
                                  ref={inputRef}
                                  type="text"
                                  name={idx}
                                  style={{width: "50%"}}
                                  autoComplete="off"
                                />
                              </DynamicListItem>
                            ))
                        }
                      </ul>
                    </div>
                  </div>
              ))
            }
          </div>

          <div className="shopping-list-mobile">
            {
              sections
                .map(sec => (
                  <div className="shopping-list-mobile-section" key={sec}>
                    <div className="mobile-list-header">
                      <span>{recipeLookup[sec]}</span>
                    </div>
                    {
                      Object.entries(listItems)
                        .filter(([k, v]) => (v.rid === sec || v.cat === sec))
                        // .filter(([k, v]) => v.rid === rid)
                        .map(([key, item], idx) => (
                          <SwipeableList
                            key={idx}
                            threshold={0.20}
                          >
                            <SwipeableListItem
                              swipeLeft={{
                                content: deleteTile,
                                action: () => removeListItem(key)
                              }}
                              swipeRight={{
                                content: editTile,
                                action: () => {
                                  setListItems({...listItems, [key]: {...listItems[key], editing: true}})
                                }
                              }}
                            >
                              <SwipeListItem
                                className="swipe-item-main"
                                text={item.text}
                                childRef={inputRef2}
                                placeholder={"Enter shopping list item"}
                                editing={listItems[key].editing}
                                stopEditing={() => {
                                  setListItems({...listItems, [key]: {...listItems[key], editing: false}})
                                }}
                              >
                                <input
                                  ref={inputRef2}
                                  type="text"
                                  name={idx}
                                  value={listItems[key].text}
                                  style={{width: "80%"}}
                                  autoComplete="off"
                                  onChange={e => {
                                    setIsSaved(false)
                                    setListItems({...listItems, [key]: {...item, text: e.target.value}})}
                                  } 
                                />
                              </SwipeListItem>
                            </SwipeableListItem>
                          </SwipeableList>
                        ))
                    }
                  </div>
                ))
            }
          </div>
          </>
        )
      } else {
        return (
          <div>
            <p>Your shopping list is empty!</p>
          </div>
        )
      }
    } else {
      return (
        <div>
          <p>Sign-in to make a shopping list.</p>
        </div>
      )
    }
  }

  return (
    <div className="shopping-list-page">
      <div className="this-content-gutter"></div>
      <div className="shopping-list-main">

        <div className="shopping-list-header">
          <div className="shopping-list-header-left">
            <h1 style={{ textAlign: "center" }}>Shopping List</h1>
          </div>

          <div style={{ textAlign: "center" }} className="shopping-list-buttons">

            {/* <ButtonGroup size="small" className="mr-1">
              <Button
                variant="contained"
                color={grouping === "recipe" ? "primary" : ""}
                onClick={() => setGrouping("recipe")}
              >
                Recipes
              </Button>
              <Button
                variant="contained"
                color={grouping === "recipe" ? "" : "primary"}
                onClick={() => setGrouping("category")}
              >
                Categories
              </Button>
            </ButtonGroup> */}

            {/* {
              grouping === "recipe"
              ? <IconButton onClick={() => setGrouping("category")}>
                  <FormatListBulletedOutlinedIcon style={{color: "black"}} />
                </IconButton>
            
              : <IconButton onClick={() => setGrouping("recipe")}>
                  <FormatListBulletedOutlinedIcon style={{color: "black"}} />
                </IconButton>
            } */}

            <IconButton onClick={addListItem}>
              <AddCircleOutlineIcon style={{color: "black"}} />
            </IconButton>

            <CopyToClipboard text={listItemsToText()}>
              <IconButton onClick={() => {
                setSnackbar(true)
              }}>
                <FileCopyOutlinedIcon style={{color: "black"}} />
              </IconButton>
            </CopyToClipboard>

            <IconButton onClick={() => console.log(sections, listItems)}>
            {/* <IconButton onClick={deleteList}> */}
              <DeleteOutlinedIcon style={{color: "black"}} />
            </IconButton>
                  
          </div>
        </div>

        <hr />

        {renderList()}

        <div className="shopping-list-bottom">
        {
          !isSaved
          
          ? <Button className="mb-5 mt-4" color="primary" variant="contained" onClick={saveList}>
              save
            </Button>

          : <Button className="mb-5 mt-4" color="primary" variant="contained" disabled>
              save
            </Button>
        }
        </div>

        <Snackbar
          variant={"primary"}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={snackbar}
          onClose={() => setSnackbar(false)}
          autoHideDuration={3000}
        >
          <Alert elevation={6} variant="filled" severity="info">List copied to clipboard</Alert>
        </Snackbar>

      </div>
      <div className="this-content-gutter"></div>
    </div>
  )
}