## Setting up Quiztown

### Default DB Settings

> Database Name: quiztown

> Database User: quiztown-user

> Database Password: thisisnotapassword

Alternatively, you can use environment variables `DB_NAME`, `DB_USER` and `DB_PASSWORD` to modify database settings

### System Requirements

1. Python (>= 3.8.10)
1. Pip (>= 21.2.4)
1. MariaDB (>= 10.3.9)
1. virtualenv (>= 20.8.1) (if setting up project in virtual environment)

### Getting Started

 1. Install Python Dependencies

    ```
    $ pip install -r requirements.txt
    ```

 2. Create and seed the database
    ```
    $ python quiztown/manage.py migrate
    ```

 3. Run the webserver
    ```
    $ python quiztown/manage.py runserver
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

### VSCode configuration for linting

```
   {
      "python.linting.enabled": true,
      "python.linting.flake8Enabled": true,
      "python.formatting.provider": "black",
      "python.linting.flake8Args": [
         "--config",
         "backend/.flake8"
      ],
      "python.formatting.blackArgs": [
         "--config",
         "backend/pyproject.toml"
      ],
      "[python]": {
         "editor.codeActionsOnSave": {
               "source.organizeImports": true
         }
      },
   }
```
