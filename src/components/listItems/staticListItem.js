import React, { useState } from "react"
import { IconButton } from "@material-ui/core"
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import './index.css'

const StaticListItem = ({
  text,
  placeholder,
  removeItem,
  ...props
}) => {

  const [showButtons, setShowButtons] = useState(false)

  return (
    <li 
      className="shopping-list-item-li"
      {...props}
    >
      <div 
        className="shopping-list-item-main"
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <span>
          {text || placeholder || "..."}
        </span>

        <div className="shopping-list-item-buttons">
          {
            showButtons &&
            <>
              <IconButton onClick={removeItem}>
                <CloseRoundedIcon style={{color: "gray"}} fontSize={"small"} />
              </IconButton>
            </>
          }
        </div>
      </div>
    </li>
  )
}

export default StaticListItem