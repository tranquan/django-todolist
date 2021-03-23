# Setup Development environment

TODO:
- [x] run local success: python manage.py runserver
- [x] run local debug success: go to debug, choose: Debug Local
- [x] run docker success
- [] run docker debug success: go to debug, choose: Debug Docker
  - https://testdriven.io/blog/django-debugging-vs-code/
  - https://dev.to/sidpalas/debugging-docker-containers-3cgj
- [] default python debugger

## Setup

#### 1. install pyenv, pyenv-virtualenv
```sh
brew update
brew install pyenv
brew install pyenv-virtualenv
```
- **pyenv** to maintain python version, incase you need to work on diffs project require diffs python's version
- **pyenv-virtualenv** is for virtualenv to be able to work when pyenv installed

#### 2. setup bash/terminal profile

Open your terminal profile, for example: if you're using zsh, you can open `.zshrc`
```sh
# pyenv
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
if command -v pyenv 1>/dev/null 2>&1; then
  eval "$(pyenv init -)"
fi

# pyenv-virtualenv
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"

# django
export DJANGO_READ_DOT_ENV_FILE=true
```

**2.1 Install pyenv-virtualenvwrapper**
```sh
brew install pyenv-virtualenvwrapper
```
For easier to switch env, 
- instead: `source ~/.pyenv/versions/3.8.5/envs/<project>`
- we can use: `workon <project>`

#### 3. Create virtual environment
```sh
# We're using python 3.8.5
pyenv install 3.8.5
pyenv global 3.8.5

# create virtual env
pyenv virtualenv todolist
```

#### 4. Install dependencies
```sh
# make sure todolist env is activated, if not:
source ~/.pyenv/versions/3.8.5/envs/todolist2/bin/activate

# install
pip install -r requirements/local.txt
```

## Run Backend

**Local**

**Docker**

## Run Frontend

---
# Commands:

## Type checks

Running type checks with mypy:
```sh
mypy todolist
```

## Test coverage
To run the tests, check your test coverage, and generate an HTML coverage report::

```sh
coverage run -m pytest
coverage html
open htmlcov/index.html
```

Running tests with py.test

```sh
$ pytest
```

---
# Deployment

http://cookiecutter-django.readthedocs.io/en/latest/deployment-with-docker.html

---
# Services

## Email Server

In development, it is often nice to be able to see emails that are being sent from your application. For that reason local SMTP server `MailHog` with a web interface is available as docker container.

https://github.com/mailhog/MailHog

Container mailhog will start automatically when you will run all docker containers.
Please check `cookiecutter-django Docker documentation`_ for more details how to start all containers.

With MailHog running, to view messages that are sent by your application, open your browser and go to `http://127.0.0.1:8025`

---
# References:

## Settings:
http://cookiecutter-django.readthedocs.io/en/latest/settings.html


## Live reloading SASS
http://cookiecutter-django.readthedocs.io/en/latest/live-reloading-and-sass-compilation.html


## Setting Up Your Users

- To create a **normal user account**, just go to Sign Up and fill out the form. Once you submit it, you'll see a "Verify Your E-mail Address" page. Go to your console to see a simulated email verification message. Copy the link into your browser. Now the user's email should be verified and ready to go.

- To create an **superuser account**, use this command::

  $ python manage.py createsuperuser

For convenience, you can keep your normal user logged in on Chrome and your superuser logged in on Firefox (or similar), so that you can see how the site behaves for both kinds of users.

