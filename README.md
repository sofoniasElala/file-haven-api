# ***File Haven*** API
## Description
File Haven API is a simple RESTful API for managing ***File Haven*** files, folders, and users. It allows a user to perform basic CRUD operations on their files, and folders, and it supports user authentication.  
[![Static Badge](https://img.shields.io/badge/Live%20API-blue)](https://api.sofonias-elala-file-haven.xyz)

## Features

- User authentication with secure sessions
- CRUD operations as mentioned above
- sort by name and last modified
- download files

## Link to ***File Haven*** Java Rest API repo
 * [![Static Badge](https://img.shields.io/badge/File%20Haven%20Java%20API-darkgreen)](https://github.com/sofoniasElala/file-haven-java-api)
## Link to ***File Haven*** front-end repo
 * [![Static Badge](https://img.shields.io/badge/File%20Haven-green)](https://github.com/sofoniasElala/file-haven)
### PostgreSQL Database Schema
![schema](https://github.com/sofoniasElala/file-haven-api/blob/main/file-haven.png)

### Endpoints

- **GET /**: Retrieve a list of all parent-less files and folders. _(Requires Authentication)_
- **GET /auth/status**: Check if user is authenticated.
- **POST /log-in**: Log in user and create session. 
- **POST /logout**: Log out user.
- **POST /sign-up**: Sign up for an account.
- **POST /user/delete**: Delete user account and all related data. _(Requires Authentication)_
___
- **GET /folders/{folderId}**: Retrieve a contents of folder by ID. _(Requires Authentication)_
- **POST /folders**: Create folder.
- **POST /folders/{folderId}**:Create folder inside of folder (folderId). _(Requires Authentication)_
- **PUT /folders/{folderId}**: update folder's name by ID. _(Requires Authentication)_
- **DELETE /folders/{folderId}**: Delete folder. _(Requires Authentication)_
___
- **POST /files**: upload file. _(Requires Authentication)_
- **GET /files/{filename}/download**: download file. _(Requires Authentication)_
- **GET /files/{fileId}**: Retrieve file by ID. _(Requires Authentication)_
- **PUT /files/{fileId}**: Update a file's name by ID. _(Requires Authentication)_
- **DELETE /files/{fileId}**: Delete a file by  ID. _(Requires Authentication)_
___

## Technologies Used:
  * TypeScript 
  * NodeJS - Express
  * PostgreSQL on Supabase - database
  * Supabase storage - file storage 
  * Passport local + prisma session - authentication/authorization
  * Multer - file upload handler
  * Render for hosting