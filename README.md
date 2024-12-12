# Appointments

## Description

A healthcare management application that uses ***Django*** and ***React*** to keep track appointments 

#### **Note** : the application is using ***PostgreSQL*** as it's database engine. 

## Table of Contents

- [Installation](#installation)
    - [Backend setup](#backend-setup)

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
        
- Set up the database by migrating the DB schema

        python manage.py migrate

- Run the server

        python manage.py runserver