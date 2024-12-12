# Appointments

## Description

A healthcare management application that uses ***Django*** and ***React*** to keep track appointments 

#### **Note** : the application is using ***PostgreSQL*** as it's database engine. 

## Table of Contents

- [Installation](#installation)
    - [Backend setup](#backend-setup)
- [Roles](#roles)
- [User management](#user-management)

## Installation

#### **Prerequisite**: Python 3, Pip, Pipenv

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
        DEBUG=<based_on_env_set_to_TRUE_or_FALSE>
        SECRET_KEY=<key_for_signing_and_hashing>
        FRONTEND_BASE_URL=<frontend_base_address ex: http://localhost:3000>
        RESET_PASSWORD_ENDPOINT=<fronted_url_for_reset_password ex: /reset-password/>
        EMAIL_BACKEND=<email_backend>
        EMAIL_HOST=<smtp_host>
        EMAIL_PORT=<smtp_port>
        EMAIL_USE_TLS=<True or False>
        EMAIL_HOST_USER=<smtp_user_id>
        EMAIL_HOST_PASSWORD=<smtp_password>
        DEFAULT_FROM_EMAIL=<email_to_be_sent_from>
        
- Set up the database by migrating the DB schema

        python manage.py migrate

- Set up admin user by running the py script and providing username, email and password whenever prompted

        python create_superuser.py

- Run the server

        python manage.py runserver


## Roles

This application supports 2 roles

- Administrator (internally is_staff = True)
- Doctor (internally is_staff = False)

## User management
There are 2 ways to create an user in this app

> Request access

- A non user will request access to the application 

- The request can be reviewed by an admin

- The request can be approved or denied

> Create access as admin

- An admin can create user directly