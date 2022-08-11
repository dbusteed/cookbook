const sectionData = {
  "Dairy": {
    keywords: [
      "butter","cheddar","cheese","cream","egg","half and half","half-and-half",
      "margarine","milk","parmesan","yogurt",
    ]
  },
  "Produce": {
    keywords: [
      "acai","anise","apple","apricot","artichoke","arugula","asparagus",
      "avocado","banana","beet","beetroot","bell pepper","berries","berry",
      "bilberry","blackberry","blueberry","bok choy","boysenberry","breadfruit","broccoli",
      "cabbage","cantaloupe","carrot","cauliflower","celeriac","celery","cherry",
      "chili pepper","chives","cilantro","citron","clementine","cloudberry","coconut",
      "corms","corn","courgette","cranberry","cucumber","currant","daikon",
      "date","delicata","dragonfruit","durian","eddoe","eggplant","elderberry",
      "endive","fennel","fiddleheads","fig","frisee","fruit","garlic",
      "ginger","goji berry","gooseberry","grape","grapefruit","green onion","greens",
      "guava","habanero","hala","honeyberry","honeydew","horseradish","huckleberry",
      "jabuticaba","jackfruit","jalape","jambul","jicama","jostaberry","jujube",
      "kaki","kale","kiwi","kohlrabi","konjac","kumquat","leek",
      "legumes","lemon","lettuce","lime","loganberry","longan","loquat",
      "lulo","lychee","mandarine","mango","mangosteen","marionberry","melon",
      "mulberry","mushroom","nectarine","nettles","okra","onion","onions",
      "orange","papaya","parsley","parsnip","passionfruit","peach","pear",
      "pepper","persimmon","pineapple","pineberry","pitaya","plantain","plum",
      "plumcot","pomegranate","pomelo","potato","prune","radicchio","radish",
      "raisin","rambutan","raspberry","rhubarb","rutabaga","salmonberry","salsify",
      "sapote","satsuma","scallion","shallot","skirret","soursop","spinach",
      "sprout","squash","star fruit","starfruit","strawberry","sweet potato","sweetcorn",
      "tamarillo","tamarind","tangelo","tangerine","taro","tat soi","tayberry",
      "tomato","topinambur","tubers","turnip","wasabi","water chestnut","watercress",
      "watermelon","yam","yuzu","zucchini","butternut squash"
    ]
  },
  "Cooking Needs": {
    keywords: [
      "baking powder","baking soda","broth","chocolate","chocolate chips","cocoa","extract",
      "flour","jello","mix","molasses","oil","pudding","salt",
      "seasoning","shortening","stock","sugar","sweetener","vanilla","vinegar",
      "yeast",
    ]
  },
  "Spices": {
    keywords: [
      "all spice","basil","bay leaves","caraway","cardamom","cayenne","chamomile",
      "chili flakes","chili powder","cinnamon","cloves","coriander","cumin","dill",
      "fennel","garam","garam masala","italian seasoning","lavender","lemongrass","marjoram",
      "mint","nutmeg","oregano","paprika","rosemary","sage","thyme",
      "turmeric",
    ]
  },
  "Meat": {
    keywords: [
      "bacon","beef","chicken","crab","fish","ham","lamb",
      "pork","poultry","salmon","sausage","shrimp","steak","tuna",
      "turkey",
    ]
  },
  "Snacks": {
    keywords: [
      "chips","oreo","salsa",
    ]
  },
  "International": {
    keywords: [
      "curry","dashi","gochujang","gyoza","hummus","kimchi","mirin",
      "okara","rice paper","rice vinegar","seaweed","tahini","tofu","wakame",
      "wonton",
    ]
  },
  "Dry Goods": {
    keywords: [
      "almond","beans","bran","bread","bulgur","cereal","chia",
      "couscous","flax","macaroni","noodle","nuts","oatmeal","oats",
      "orzo","pasta","pretzel","quinoa","rice","seed","tortilla",
      "walnuts","wheat",
    ]
  },
  "Canned Goods": {
    keywords: [
      "can","green chilies","olives","pickle",
    ]
  },
  "Frozen": {
    keywords: [
      "cool whip","edamame","frozen","ice cream",
    ]
  },
  "Condiments": {
    keywords: [
      "almond butter","honey","ketchup","mayo","mustard","peanut butter","sauce",
      "soy sauce","syrup",
    ]
  },
}

Object.keys(sectionData).map(k => {
  sectionData[k]['regex'] = new RegExp(sectionData[k]['keywords'].join('|'), 'i')
})

const regexLookup = Object.entries(sectionData).map(([k,v]) => [k, v.regex])

export const assignSection = (ing) => {

  let catMatches = []

  for(let i=0; i<regexLookup.length; i++) {
    if(regexLookup[i][1].test(ing)) {
      catMatches.push(regexLookup[i][0])
    }
  }

  if (catMatches.length === 0) {
    return "Other"
  } else if (catMatches.length === 1) {
    return catMatches[0]
  } else {
    let maxLength = 0
    let maxLabel = "Other"
    catMatches.forEach(cat => {
      let matchLength = sectionData[cat].regex.exec(ing)[0].length
      if (matchLength > maxLength) {
        maxLength = matchLength
        maxLabel = cat
      }
    })
    return maxLabel
  }
}