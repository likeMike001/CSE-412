# CSE 412 Project

Movie Recommder Application

### Tech Stack 

- ReactJS 
- NodeJS
- PostgreSQL
- Python (For ML Model) 

## Installation and Set Up 

> ⚠️ Please follow the steps in the order given below.

```bash
# Clone the repository
git clone https://github.com/likeMike001/CSE-412

cd CSE-412

cd movie-recommend

cd backend

npm install 

### Creating a .env file in the backend folder and enter the following things 
DB_USER=postgres
DB_HOST=localhost
DB_NAME=movies
DB_PASSWORD= # Your DB password
DB_PORT=     # Your DB port
PORT=        # Backend server port (e.g., 5000)


After this is done, import the database dump helper.backup file
Open pg admin
First, create a new database if you haven't already:
Right-click on "Databases"
Select "Create" then "Database..."
Enter the database name
Click "Save"


### Restore Process

Right-click on your target database
Select "Restore..."
In the restore window:
Select the format of your backup file - custom
Provide the complete file path to your backup - if the file does not immediately show up in file explorer then select all types of file and it will show 
Click the "Restore" button

alternatively can use cli 
psql -U postgres -d database_name < path_to_backup_file.sql


Once above steps are complete run
npm start 
```
### For Frontend 
```
npm install

npm start 

```
- The application should be up and running now 

#### Presenation Link 
- https://www.youtube.com/watch?v=HmiNJXiQjm0

#### Images of the Application
<img src = "https://github.com/likeMike001/CSE-412/blob/main/movie-recommend/frontend/src/assets/image1.png" width="400" >
<img src = "https://github.com/likeMike001/CSE-412/blob/main/movie-recommend/frontend/src/assets/image2.png" width="400" >
<img src = "https://github.com/likeMike001/CSE-412/blob/main/movie-recommend/frontend/src/assets/image3.png" width="400" >
<img src = "https://github.com/likeMike001/CSE-412/blob/main/movie-recommend/frontend/src/assets/image4.png" width="400" >
<img src = "https://github.com/likeMike001/CSE-412/blob/main/movie-recommend/frontend/src/assets/image5.png" width="400" >
<img src = "https://github.com/likeMike001/CSE-412/blob/main/movie-recommend/frontend/src/assets/image6.png" width="400" >


