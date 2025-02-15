<h1 align="center">Question Paper Generator </h1>

## Overview
This project is a **Question Paper Generator** that dynamically generates question papers based on **branch, regulation, year, semester, month, and subject**. It selects **short and long answer questions** based on Bloom's Taxonomy (BT) levels and ensures that the questions exist in the database (Excel file). If data is missing, it provides an appropriate message indicating which data is unavailable.

## Features

    ### for Authentication

    -   🔧 Backend Setup
    -   🗄️ Database Setup
    -   🔐 Signup Endpoint
    -   📧 Sending Verify Account Email
    -   🔍 Verify Email Endpoint
    -   📄 Building a Welcome Email Template
    -   🚪 Logout Endpoint
    -   🔑 Login Endpoint
    -   🔄 Forgot Password Endpoint
    -   🔁 Reset Password Endpoint
    -   ✔️ Check Auth Endpoint
    -   🌐 Frontend Setup
    -   📋 Signup Page UI
    -   🔓 Login Page UI
    -   ✅ Email Verification Page UI
    -   📤 Implementing Signup
    -   📧 Implementing Email Verification
    -   🔒 Protecting Our Routes
    -   🔑 Implementing Login
    -   🏠 Dashboard Page
    -   🔄 Implementing Forgot Password


    ### for Question Paper Generator

    -   📝 Generate question papers with a mix of short and long questions
    -   🔍 Filter questions by branch, regulation, year, semester, month, and unit
    -   ⚠️ Validate missing data and display errors if required questions are not found
    -   🗄️ Uses MongoDB for question storage
    -   📡 Provides an API for generating question papers dynamically
    -   🖥️ Includes a frontend for user interaction


#### To run the Question Paper Generator on your local machine, follow these steps:



### 1. Clone the repository to your local machine using the following command:



```
git clone   https://github.com/Murali3824/QUESTION-PAPER-GENERATOR.git

cd QUESTION-PAPER-GENERATOR
```



### 2. BACKEND Setup 

#### .env file

```bash
MONGODB_URL = your_mongo_uri
PORT = 4000
JWT_SECRET = your_secret_key
NODE_ENV = development
SMTP_USER = your_smtp_user
SMTP_PASS = your_smtp_pass
SENDER_EMAIL = your_smtp_email

FRONTEND_URL= your_frontend_url (http://localhost:5173)
```


#### Install the required dependencies:


```
npm install
```


#### Start the development server:


```
npm run dev
```





### 3. FRONTEND Setup

#### .env file


```
VITE_BACKEND_URL = your_backend_url (http://localhost:4000)
```


#### Install the required dependencies:


```
npm install
```


#### Start the development server:


```
npm run dev
```