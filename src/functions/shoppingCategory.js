//
//  IN PROGRESS!
//

const categories = [
  'Dairy',
  'Produce',
  'Cooking Needs',
  'Freezer',
  'Misc',
]

const categorize = () => {
  return categories[Math.floor(Math.random() * categories.length)]
}

export default categorize