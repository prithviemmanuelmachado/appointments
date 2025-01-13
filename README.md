# Appointments

## Description

A healthcare management application that uses ***Django*** and ***React*** to keep track of appointments 

#### **Note** : the application is using ***PostgreSQL*** as it's database engine. 

## Table of Contents

- [Installation](#installation)
    - [Backend setup](#backend-setup)
    - [Frontend setup](#frontend-setup)
- [Roles](#roles)
- [User management](#user-management)
- [Appointment management](#appointment-management)
- [Dashboard](#dashboard)

## Installation

#### **Prerequisite**: Python 3, Pip, Pipenv, Node, npm

- Clone the repoitory  
    
        https://github.com/prithviemmanuelmachado/appointments.git 

### Backend setup

- Open up a command terminal and traverse to `api` folder and install the dependencies
    
        pipenv install

- Activate the virtual environment 

        pipenv shell

- In the `api` folder create a .env file with the following keys and values

        DB_NAME=<name_of_db_here>
        DB_USER=<db_user_here>
        DB_PASSWORD=<db_password_here>
        DB_HOST=<db_host_here>
        DB_PORT=<db_port_here>
        SITE_NAME=<name_of_the_application>
        DEBUG=<based_on_env_set_to_TRUE_or_FALSE>
        SECRET_KEY=<key_for_signing_and_hashing>
        FRONTEND_BASE_URL=<frontend_base_address ex: localhost:3000>
        RESET_PASSWORD_ENDPOINT=<fronted_url_for_reset_password ex: reset-password>
        EMAIL_BACKEND=<email_backend>
        EMAIL_HOST=<smtp_host>
        EMAIL_PORT=<smtp_port>
        EMAIL_USE_TLS=<True or False>
        EMAIL_HOST_USER=<smtp_user_id>
        EMAIL_HOST_PASSWORD=<smtp_password>
        DEFAULT_FROM_EMAIL=<email_to_be_sent_from>
        AWS_ACCESS_KEY=<AWS_access_key>
        AWS_SECRET_KEY=<AWS_secret_key>
        AWS_STORAGE_BUCKET_NAME=<s3_bukcet_name>
        AWS_REGION=<aws_region>

        
- Set up the database by migrating the DB schema

        python manage.py migrate

- Set up admin user by running the py script and providing username, email and password whenever prompted

        python create_superuser.py

- Run the server

        python manage.py runserver

### Frontend setup

- Open up a command terminal and traverse to `app` folder and install the dependencies
    
        npm i

- In the `app` folder create a .env file with the following keys and values

        REACT_APP_API_BASE_URL=<Base url to the api endpoint ex: http://127.0.0.1:8000/>
        REACT_APP_SITE_NAME=<name_of_the_application>
        REACT_APP_TAB_PICTURE=<loctaion_to_the_tab_image>
        REACT_APP_VERSION=<Version of the application>

- Start the devlopment server to serve the react app 

        npm start

## Roles

This application supports 2 roles

- Administrator (internally is_staff = True)
- Doctor (internally is_staff = False)

## User management
There are 2 ways to create an user in this app

> Request access

- A non user will request access to the application 

- The request can be reviewed by an admin on user management screen

- The request can be approved or denied

> Create access as admin

- An admin can create user directly from user management screen

## Appointment management

A doctor can create appointments for themself, but an admin is able to create appointments for any doctor in the system. Similarly a doctor can leave notes on their appointment, but an admin can leave notes on any appointment in the system

## Dashboard

A doctor can view their appointments for the day here. They also get 2 pie charts representing the statuses of their appointments for that day and over their lifetime.