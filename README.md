# Sylvia's Cookbook

## About

<!-- 
    NOTE TO SELF:

    https://stackoverflow.com/questions/48826489/react-production-router-404-after-deep-refresh-firebase
-->
=======
A simple online cookbook that I made for my wife.

It's built with React and Firebase, although the [original version](https://github.com/dbusteed/cookbook-old) was made with Django.

## Set Up

Setting up a live version of the cookbook is pretty easy, so feel free to give it a try and customize it.

1. Download the code
    ```
    git clone https://github.com/dbusteed/cookbook
    ```
2. Install node modules
    ```
    npm start
    ```
3. Create / configure the Firebase project (need a Google account)
    * Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
    * Create a project > give it a name
    * Authentication > Sign-in method > enable Email/Password
    * Cloud Firestore > Rules > replace the rule with the following
        ```
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /{document=**} {
            allow read;
            allow write: if request.auth != null;
            }
          }
        }
        ```
    * Cloud Firestore > Data > create the following collection / doc
        ```
        collection: "meta"
          document: "meta"
            "categories" (STRING): "Breakfast<SEP>Lunch/Dinner<SEP>Other"
            "tags": (STRING): "Tag1<SEP>Tag2<SEP>Tag3"
        ```
    * Storage > Files > make a folder called "images"
    * Storage > Files > take note of the bucket URL (gs://PROJECTNAME.appspot.com)
        * Open up the cookbook code if you have't already
        * Open `src/components/recipeCard/index.js`
        * Change the image URL to match your bucket URL
            ```
            https://.../v0/b/sylvias-cookbook.appspot.com/o/...

            change to 

            https://.../v0/b/PROJECTNAME.appspot.com/o/...
            ``` 
    * Storage > Rules > replace the rule with the same rule used in Firestore
    * Go to Project Settings (next to project overview)
        * Add app > Web app > give it a name
        * Copy the information inside the `firebaseConfig`
        * Open up `src/template_firebase.js`, and replace the empty config variables with the ones copied from the Firebase console
        * Rename `src/template_firebase.js` to `src/firebase.js`
        * Rename `src/template_secret.js` to `src/secret.js`
    * Firebase set up finished!
4. Run the project locally
    ```
    npm start
    ```
    * Give everything a try, and make sure things are working
    * Now is a good time to create an account
    * NOTE: The "sign up code" on the sign up page is found in `src/secret.js`. So look in that file for the placeholder value / switch it to something else
    * Once you made an account, try creating recipe
        * NOTE: you'll need to refresh after adding a recipe
    * If both those steps worked, then you're ready to go live!
5. Build the project
    ```
    npm run build
    ```
6. Set up Firebase hosting
    * go back to the Firebase console
    * Hosting > Get started
    * Install Firebase CLI and login
        ```
        npm install -g firebase-tools
        firebase login
        ```
    * Initialize Firebase project
        ```
        firebase init
        ```
    * Select the "Hosting" option, and continue
    * Use existing project, select your project
    * Write "build" for the public directory
    * Enter "no" for the other options
7. Deploy the site
    ```
    firebase deploy
    ```
    * This command will show the public URL when finished, but you can also view deployment details from the Firebase console
8. And that's it!
