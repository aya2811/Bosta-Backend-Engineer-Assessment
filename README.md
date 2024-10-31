<a name="readme-top"></a>

<br />


<h3 align="center">Bosta Technical Task</h3>

 
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#Documentation">Documentation</a></li>
      </ul>
    </li>
  </ol>
</details>



## About The Project

* It is a simple Library Management System API that manages books and borrowers



<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* Backend: NodeJs
* DB: PostgreSQL
* RESTful: ExpressJs



<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/aya2811/Bosta-Backend-Engineer-Assessment.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create `.env` file with the following variables and their values
   ```js
    DATABASE_NAME 
    DATABASE_USERNAME 
    DATABASE_PASSWORD 
    DATABASE_HOST 
    PORT 
    ACCESS_TOKEN_SECRET 
    REFRESH_TOKEN_SECRET 
   ```
4. Run the following command the server will be running on `PORT`
   ```sh
   nodemon index.js
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Backend

#### Structure

```
Bosta-Backend-Engineer-Assessment
|
├── app 
|   ├── config 
|   |     ├── database.config.js
|   |     ├── database.js
|   |     ├── isAuth.js
|   |
|   ├── controllers       
|   |       ├── book.controller.js
|   |       ├── loan.controller.js
|   |       ├── borrower.controller.js
|   |
|   ├── routes
|   |     ├── book.routes.js
|   |     ├── loan.routes.js
|   |     ├── borrower.routes.js
|   |    
|   ├── models
|   |     ├── book.model.js
|   |     ├── loan.model.js
|   |     ├── borrower.model.js
|       
├── index.js
```

#### Database Design

<img src="/images/Library Management System.png">


#### Documentation

##### SignUp Endpoint:

* `Request Schema`: POST api/user/signup
*  `Request Body`: 
    ```
    JSON {
    "name": "string",
    "email": "string",
    "password": "string",
    "role":"string"
    }
    ```

* `Response Schema`:
    ```
    JSON {
    "message": "string"
    }
    ```
##### SignIn Endpoint:

* `Request Shema`: POST api/user/signin
* `Request Body`:
    ```
    JSON {
    "email": "string",
    "password": "string",
    }
    ```
* `Response Schema`:
    ```
    JSON {
    "message": "string",
    "access_token": "string",
    "refresh_token": "string",
    }
    ```
##### Refresh Token Endpoint:
* `Request Shema`: POST api/user/refresh-token
* `Request Body`:
    ```
    JSON {
    "refresh_token": "string",
    }
    ```
    * `Response Schema`:
    ```
    JSON {
    "message": "string",
    "access_token": "string",
    "refresh_token": "string",
    }
    ```

##### Read All Users Endpoint:
* `Request Shema`: GET /api/user
* `Authorization`: Bearer [Token]
* `Response Schema`:
    ```
    JSON
    {
        "users": [
            {
                "id": integer,
                "name": "string",
                "email": "string",
                "registered_date": "date",
                "role": "string"
            },... 
        ]
    }
    ```
##### Update User Endpoint:
* `Request Shema`: PUT api/user/{user_id}
* `Authorization`: Bearer [Token]
* `Request Body`:
    ```
    JSON {
    "name": "string",
    "email": "string",
    "password": "string"
    }
    ```
* `Response Schema`:
    ```
    JSON {
    "message": "string"
    }
    ```
##### Delete User Endpoint:
* `Request Shema`: DELETE api/user/{user_id}
* `Authorization`: Bearer [Token]
* `Response Schema`:
    ```
    JSON {
    "message": "string",
    }
    ```

##### Create Book Endpoint:
* `Request Shema`: POST api/book
* `Authorization`: Bearer [Token]
* `Request Body`:
    ```
    JSON {
    "title":"string",
    "author": "string",
    "ISBN": "string",
    "available_quantity": integer,
    "shelf_location": "string"
    }
    ```
* `Response Schema`:
    ```
    JSON {
        "message": "string"
    }
    ```

##### Read All Users Endpoint:
* `Request Shema`: GET /api/book
* `Authorization`: Bearer [Token]
* `Response Schema`:
    ```
    JSON
    {
        "books": [
            {
                "id": int,
                "title":"string",
                "author": "string",
                "ISBN": "string",
                "available_quantity": integer
                "shelf_location": "string"
            },... 
        ]
    }
    ```
##### Update Book Endpoint:
* `Request Shema`: PUT api/book/{book_id}
* `Authorization`: Bearer [Token]
* `Request Body`:
    ```
    JSON {
        "title":"string",
        "author": "string",
        "ISBN": "string",
        "available_quantity": integer
        "shelf_location": "string"
    }
    ```
* `Response Schema`:
    ```
    JSON {
        "message": "string"
    }
    ```
##### Delete Book Endpoint:
* `Request Shema`: DELETE api/book/{book_id}
* `Authorization`: Bearer [Token]
* `Response Schema`:
    ```
    JSON {
    "message": "string",
    }
    ```
##### Search Book Endpoint:
* `Request Shema`: GET api/book/search
* `Authorization`: Bearer [Token]
* `Request Body`:
    ```
    JSON {
        "title":"string",
        "author": "string",
        "ISBN": "string",
    }
    ```
* `Response Schema`:
    ```
    JSON {
        "book": {
            "id": int,
            "title":"string",
            "author": "string",
            "ISBN": "string",
            "available_quantity": integer
            "shelf_location": "string"
        }
    }
    ```
##### Borrow Book Endpoint:
* `Request Shema`: POST api/loan/{borrower_id}
* `Authorization`: Bearer [Token]
* `Request Body`:
    ```
    JSON {
        "book_id":"string"
    }
    ```
* `Response Schema`:
    ```
    JSON {
        "message": "string",
        "loan": {
            "loan_date": "date",
            "loan_status": "string",
            "id": integer,
            "BookId": integer,
            "UserId": integer,
            "due_date": "date",
            "return_date": "date"
        }
    }
    ```
##### Return Book Endpoint:
* `Request Shema`: POST api/loan/{borrower_id}
* `Authorization`: Bearer [Token]
* `Request Body`:
    ```
    JSON {
        "book_id":"string"
    }
    ```
* `Response Schema`:
    ```
    JSON {
        "message": "string"
    }
    ```
##### List Books User Currently Have Endpoint:
* `Request Shema`: GET api/loan/{borrower_id}
* `Authorization`: Bearer [Token]
* `Response Schema`:
    ```
    JSON
    {
        "books": [
            {
                "title":"string",
                "author": "string",
                "ISBN": "string"
            },... 
        ]
    }
    ```

##### List Checked Out Books and By Whom Endpoint:
* `Request Shema`: GET api/loan/all
* `Authorization`: Bearer [Token]
* `Response Schema`:
    ```
    JSON
    {
    "Loans": [
        {
            "loan_date": "Date",
            "due_date": "Date",
            "loan_status": "string",
            "Book": {
                "title": "string",
                "author": "string",
                "ISBN": "string"
            },
            "User": {
                "name": "string",
                "email": "string"
            }
        }, ...
    ]
    }
    ```
##### List Overdue Books Endpoint:
* `Request Shema`: GET api/loan/overdue
* `Authorization`: Bearer [Token]
* `Response Schema`:
     ```
    JSON
    {
    "Loans": [
        {
            "loan_date": "Date",
            "due_date": "Date",
            "loan_status": "string",
            "Book": {
                "title": "string",
                "author": "string",
                "ISBN": "string"
            },
            "User": {
                "name": "string",
                "email": "string"
            }
        }, ...
    ]
    }
    ```
##### Export Loans At Specific Period Endpoint:
* `Request Shema`: GET api/loan/exportAt
* `Authorization`: Bearer [Token]
* `Request Body`:
    ```
    JSON {
        "from":"date",
        to: "date
    }
    ```
* `Response Schema`:    
    ```
    JSON {
        "message": "string"
    }
    ```

##### Export Overdue At Last Month Endpoint:
* `Request Shema`: GET api/loan/exportOverdueLastMonth
* `Authorization`: Bearer [Token]
* `Response Schema`:    
    ```
    JSON {
        "message": "string"
    }
    ```
##### Export Borrows At Last Month Endpoint:
* `Request Shema`: GET api/loan/exportBorrowsLastMonth
* `Authorization`: Bearer [Token]
* `Response Schema`:    
    ```
    JSON {
        "message": "string"
    }
    ```

#### Bonus Features:
1. The system can show analytical reports of the borrowing process in a specific period and
export the borrowing process data in CSV or Xlsx sheet formats e.x.
2. Exports all overdue borrows of the last month.
3. Exports all borrowing processes of the last month.
4. Implement basic authentication for the API.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


[DB_schema]: /images/Library%20Management%20System.png

