import React from 'react'
import './index.css'

export default function Help(props) {
  return (
    <div className="help-page">
      <div className="content-gutter"></div>
      <div className="help-page-main">
      <h1>Help, tips, and more!</h1>
        <h2>Tips and tricks</h2>
          <h3>Searching recipes</h3>
            <ul>
              <li>You can filter recipes by user, recipe name, category, ingredients, and tag</li>
              <li>When you are logged in, only your recipes are shown by default</li>
              <li>Click the Home button to clear all recipe filters</li>
            </ul>
          <h3>Adding / editing recipes</h3>
            <ul>
              <li>Prepend ingredient / direction line items with a <b>#</b> to create a sub-heading</li>
              <li>Leave a blank linke between ingredient / direction line items to add space</li>
            </ul>
          <h3>Creating a mobile shortcut</h3>
            <ul>
              <li><a href="https://www.wikihow.tech/Add-a-Link-Button-to-the-Home-Screen-of-an-iPhone">iPhone</a></li>
            </ul>

        <h2>Other issues</h2>
          <ul className="h2-list">
            <li>This cookbook has many issues, so please be patient!</li>
            <li>If you encounter an issue, please reach out to me (Davis) and I'll see what I can do!</li>
          </ul>  
      </div>
      <div className="content-gutter"></div>
    </div>
  )
}