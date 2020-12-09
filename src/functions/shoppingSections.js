const _grocerySections = [
  'Dairy',
  'Produce',
  'Cooking Needs',
  'Canned Goods',
  'Meat',
  'Snacks',
  'Freezer',
  'Other',
]

export const grocerySections = {
  'Dairy': 'Dairy',
  'Produce': 'Produce',
  'Cooking Needs': 'Cooking Needs',
  'Canned Goods': 'Canned Goods',
  'Meat': 'Meat',
  'Snacks': 'Snacks',
  'Freezer': 'Freezer',
  'Other': 'Other'
}

// /exp/.text(str)

export const assignSection = () => {
  return _grocerySections[Math.floor(Math.random() * _grocerySections.length)]
}