## Grocery List Tracker

http://67.207.85.99:3000/

- The goal of the application was to allow users to create a simple grocery list that would be synced to their account
- Implementing oauth with the passport library was challenging
- I implemented GitHub Oauth for authentication because it seemed to be the most accessible
- I used the water.css CSS framework
  - made some modifications to margins, size and borders
- MiddleWare:
  - BodyParser: Parses request payloads 
  - CookieParser: Parses the cookie header
  - ExpressSession: Creates a session on the server using cookies
  - Passport: Used to implement OAuth sign in (Github)
  - Custom Authorization Middleware: Checks to see if the user has a session before allowing them to view the session specific page content. If there is not a valid session, the user is redirected to the login page 

## Technical Achievements
- **Tech Achievement 1**: I used passport.js OAuth authentication via the GitHub strategy
- **Tech Achievement 2**: I hosted the application on Digital Ocean. There were some additonal steps to set up the droplet, like installing pm2 to keep the node server running.
- **Tech Achievement 3**: I achieved 100% in all 4 lighthouse tests (Points were deducted from Best Practices for not using HTTPS because of digital ocean)
