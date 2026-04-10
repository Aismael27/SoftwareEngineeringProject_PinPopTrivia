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
- /sql -- Contains the SQL code for the database
- /data -- Contains the actual 
- home.html -- Main page
- login.html -- Log in page 
- theme.css -- Main theme for all pages

## Database schema
<img width="758" height="767" alt="image" src="https://github.com/user-attachments/assets/b4769f73-1742-416f-8102-208af19d72da" />


## Tech stack
- MySQL
- HTML
- JSON
- CSS
- JavaScript
