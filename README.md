# IDEUM JS

Ideum is a place for everyone to let out all ideas that one keeps locked in mind! Share your bravest ideas and if nothing comes to your mind - find inspiration through searching anything and get related images. Also, don't forget to check out list of popular artists on 'Artists' page, you can even get detailed info of each in artist's personal page.

## Installation

1. Fork or download this repository
2. Install all required dependecies:
```js
    npm install
```
3. Create and fill ".env" by given ".env.example" file
4. Run the app:
```js
    node server.js
```

## Features

- Dual language support (English/Russian) -> To switch languages use switcher at the top right corner of the page
- Registration and Authorization 
- Admin panel -> To log in as an admin fill required fields in ".env" or if you're using deployed version use next credentials:
```
    email: mustik@gmail.com
    password: mustik123
```
>CAUTION! These admin credentials for testing purpose only, the don't include any real privileges over odrinary user

- Most popular artists list including personal pages
- Uploading a post with dual language title and content and with user uploaded image
- User delete and edit (with admin role only) 
- Search engine for getting an *inspiration*

## Deploy

```
    https://mustik-ideum-ass-4.onrender.com
```