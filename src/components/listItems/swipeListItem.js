import React, { useEffect } from "react"
import './index.css'

const SwipeListItem = ({
  childRef,
  text,
  type,
  placeholder,
  children,
  removeItem,
  initEditing,
  editing,
  stopEditing,
  ...props
}) => {

  useEffect(() => {
    if (childRef && childRef.current && editing === true) {
      childRef.current.focus()
      childRef.current.select()
    }
  }, [editing, childRef])

  const handleKeyDown = (event, type) => {
    const { key } = event
    const keys = ["Escape", "Tab"]
    const enterKey = "Enter"
    const allKeys = [...keys, enterKey]
    if (
      (type === "textarea" && keys.indexOf(key) > -1) ||
      (type !== "textarea" && allKeys.indexOf(key) > -1)
    ) {
      stopEditing()
    }
  }

  const strikeThru = (e) => {
    if(e.currentTarget.style.textDecoration) {
      e.currentTarget.style.textDecoration = ''
      e.currentTarget.style.color = 'black'
    } else {
      e.currentTarget.style.textDecoration = 'line-through'
      e.currentTarget.style.color = "rgb(135, 135, 135)"
    }
  }

  return (
    <>
      {
        editing 
        
        ? (
          <div
            onBlur={() => stopEditing()}
            onKeyDown={e => handleKeyDown(e, type)}
            className="swipe-item-main"
          >
            {children}
          </div>
        ) 
        
        : (
          <div className="swipe-item-main">
            <span onClick={strikeThru}>
              {text || placeholder || "..."}
            </span>
          </div>
        )
      }
    </>
  )
}

export default SwipeListItem