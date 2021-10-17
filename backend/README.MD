## Setting up Quiztown

### Default DB Settings

> Database Name: quiztown
>
> Database User: quiztown-user
>
> Database Password: thisisnotapassword

Alternatively, you can use environment variables `DB_NAME`, `DB_USER` and `DB_PASSWORD` to modify database settings

### System Requirements

1. Python (>= 3.8.10)
1. Pip (>= 21.2.4)
1. MariaDB (>= 10.3.9)
1. virtualenv (>= 20.8.1) (if setting up project in virtual environment)
1. Redis (>= 5.0.14)

### Setup Redis

 1. Run Redis in docker
    ```
    $ docker run -p 6379:6379 -d redis:5
    ```
### Getting Started

 1. Install Python Dependencies

    ```
    $ pip install -r requirements.txt
    ```

 2. Create and seed the database
    ```
    $ python manage.py migrate
    ```

 3. Run the webserver
    ```
    $ python manage.py runserver
    ```

 4. Start the job queue worker
    ```
    $ python manage.py rqworker default
    ```

### Setting up in Virtual Environment

 1. Setup Virtual Environment
    ```
    $ python -m venv venv
    ```

 2. Activate Virtual Environment
    ```
    $ source venv/bin/activate
    ```

 3. Update pip to latest version
    ```
    $ python -m pip install --upgrade pip
    ```

 4. Repeat the above steps to set up the project in the virtual environment
    Run the following code to deactivate the virtual environment
    ```
    $ deactivate
    ```

 Note: Run all future commands after activating virtual environment to ensure consistencies

### Setup linting

 1. Exit from the virtual environment and run the following
    ```
    $ pip install -r linting-requirements.txt
    ```

### VSCode configuration for linting

```
{
   "python.linting.enabled": true,
   "python.linting.flake8Enabled": true,
   "python.formatting.provider": "autopep8",
   "python.linting.flake8Args": [
      "--config",
      "backend/.flake8"
   ],
   "python.formatting.autopep8Args": [
      "--global-config",
      "backend/pyproject.toml"
   ],
   "[python]": {
      "editor.codeActionsOnSave": {
         "source.organizeImports": true
      }
   },
   "python.analysis.typeCheckingMode": "basic",
   "python.analysis.indexing": true,
}
```
