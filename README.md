<h1 align="center">MERN Authentication 🔒 </h1>


## Features

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


#### To run the MERN Authentication on your local machine, follow these steps:



### 1. Clone the repository to your local machine using the following command:



```
git clone   https://github.com/Murali3824/MERN-Authentication.git
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