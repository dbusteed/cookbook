import React, { useState } from "react"
import IconButton from '@mui/material/IconButton'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
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