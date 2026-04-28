# PinPop Trivia
Source code for a city trivia game focusing on a select few cities and trivia of certain media (movies, tv series, and books) that take place there or were filmed there.
<img width="1365" height="769" alt="image" src="https://github.com/user-attachments/assets/2414e5fc-725a-4cd2-9b06-d51f7555ad59" />

## Setup
1. Clone repository
```
git clone git@github.com:julianacastromarrero/SoftwareEngineeringProject_PinPopTrivia.git
cd SoftwareEngineeringProject_PinPopTrivia.git
```

2. Install dependencies
```npm install```
```npm install express-session```

3. Setup database
Must be version '8.0.45'
```mysql -u root -p < MySQLScript.sql```

4. Modify .env 
```
DATABASE_HOST=localhost
DATABASE_USER=your_mysql_username
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=recipe_db
```

6. Run the app
```node app.js```

7. Open browser: ```http://localhost:3000```


## Navigation
```
.env                                                                                                                                                                      
.gitignore                                                                                                                                                                
app.js                                                                                                                                                                    
database.js                                                                                                                                                               
MySQLScript.sql                                                                                                                                                           
package-lock.json                                                                                                                                                         
package.json                                                                                                                                                              
README.md 
public
├───css
│   │   Limelight.zip
│   │   Special_Elite.zip
│   │   style.css
│   └───images
│           catError.webp
│           map.jpg
│           Reel.png
│           trinity.jpg
└───js 
    └───quizjs.js
views
├───pages
│   │   adminDashboard.ejs
│   │   cityPage.ejs
│   │   freeplay.ejs
│   │   home.ejs
│   │   leaderboard.ejs
│   │   login.ejs
│   │   profile.ejs
│   │   quiz.ejs
│   │   register.ejs
│   │   suggest.ejs
│   └───admin
│           questionManagement.ejs
│           userManagement.ejs   
└───partials
    └───header.ejs
```
## Report and training materials
https://docs.google.com/document/d/1CDm5iZLaVxwRltGzDQfHzYI6sTrlDTzgvcLXogkLGW0/edit?tab=t.0

