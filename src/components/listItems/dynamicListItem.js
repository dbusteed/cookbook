import React, { useState, useEffect } from "react"
import IconButton from '@mui/material/IconButton'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import './index.css'

const DynamicListItem = ({
  childRef,
  text,
  type,
  placeholder,
  children,
  removeItem,
  updateItem,
  initEditing,
  ...props
}) => {

  const [isEditing, setEditing] = useState(initEditing)
  const [showButtons, setShowButtons] = useState(false)

  useEffect(() => {
    if (childRef && childRef.current && isEditing === true) {
      childRef.current.value = text
      childRef.current.focus()
      childRef.current.select()
    }
  }, [isEditing, childRef])

  const handleKeyDown = (event, type) => {
    const { key } = event
    const keys = ["Escape", "Tab"]
    const enterKey = "Enter"
    const allKeys = [...keys, enterKey]
    if (
      (type === "textarea" && keys.indexOf(key) > -1) ||
      (type !== "textarea" && allKeys.indexOf(key) > -1)
    ) {
      setEditing(false)
      updateItem()
    }
  }

  return (
    <li
      className="shopping-list-item-li"
      {...props}
    >
      {
        isEditing

          ? (
            <div
              onBlur={() => {
                setEditing(false)
                updateItem()
              }}
              onKeyDown={e => handleKeyDown(e, type)}
            >
              {children}
            </div>
          )

          : (
            <div
              className="shopping-list-item-main"
              onMouseEnter={() => setShowButtons(true)}
              onMouseLeave={() => setShowButtons(false)}
            >
              <span onClick={() => setEditing(true)}>
                {text || placeholder || "..."}
              </span>

              <div className="shopping-list-item-buttons">
                {
                  showButtons &&
                  <>
                    <IconButton onClick={removeItem}>
                      <CloseRoundedIcon style={{ color: "gray" }} fontSize={"small"} />
                    </IconButton>
                  </>
                }
              </div>
            </div>
          )
      }
    </li>
  )
}

export default DynamicListItem