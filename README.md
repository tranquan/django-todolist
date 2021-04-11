
<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [TODO](#todo)
- [Getting Started](#getting-started)
  - [Setup](#setup)
      - [1. install pyenv, pyenv-virtualenv](#1-install-pyenv-pyenv-virtualenv)
      - [2. setup bash/terminal profile](#2-setup-bashterminal-profile)
      - [3. Create virtual environment](#3-create-virtual-environment)
      - [4. Install dependencies](#4-install-dependencies)
  - [Workflow](#workflow)
    - [Start development - TBD](#start-development-tbd)
    - [Running Test - TBD](#running-test-tbd)
- [Configurations](#configurations)
    - [.env vs ./envs/local & production](#env-vs-envslocal-production)
- [Commands](#commands)
  - [Type checks](#type-checks)
  - [Test coverage](#test-coverage)
- [Deployment](#deployment)
- [Services](#services)
  - [Email Server](#email-server)
- [References:](#references)
  - [Settings](#settings)
  - [Live reloading SASS](#live-reloading-sass)
  - [Setting Up Your Users](#setting-up-your-users)
  - [Django: Local vs Docker](#django-local-vs-docker)
    - [Local](#local)
    - [Docker:](#docker)
    - [Summary](#summary)

<!-- /code_chunk_output -->

# TODO
- [] Add web frontend
- [] Deploy to DO

# Getting Started

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
- create new env: `mkvirtualenv <project>`

readmore: https://virtualenvwrapper.readthedocs.io/en/latest/command_ref.html

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

## Workflow

### Backend Development
```sh
# run with debug (recommended)
# then you can attach debugger in Run & Debug tab
run docker-debug
# or without debug with vscode, still can debug with pdb
run docker
# run on local
run local
```

### Frontend DDevelopment - TBD


### Running Test - TBD

---
# Configurations
- Most of the configs is under `config/settings`; from base.py, then overwrite by local.py & production.py
- base.py read from `.env` file if having

### .env vs ./envs/local & production
- `.env` file is using when running on **local** with `python manage.py runserver`
  - requires `DJANGO_READ_DOT_ENV_FILE=true` need to be set in bash_profile (or any Terminal profile)
- `.envs` is using for **docker**, it is called in `local.yml` 
  - readmore: https://docs.docker.com/compose/environment-variables/

---
# Commands

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

## Settings
http://cookiecutter-django.readthedocs.io/en/latest/settings.html


## Live reloading SASS
http://cookiecutter-django.readthedocs.io/en/latest/live-reloading-and-sass-compilation.html


## Setting Up Your Users

- To create a **normal user account**, just go to Sign Up and fill out the form. Once you submit it, you'll see a "Verify Your E-mail Address" page. Go to your console to see a simulated email verification message. Copy the link into your browser. Now the user's email should be verified and ready to go.

- To create an **superuser account**, use this command::

  $ python manage.py createsuperuser

For convenience, you can keep your normal user logged in on Chrome and your superuser logged in on Firefox (or similar), so that you can see how the site behaves for both kinds of users.

## Django: Local vs Docker
### Local
pros:
- can debug with vscode, more visual and easier
- doesn't need to run docker, more heavier
cons:
- my dev env is not as close as my prod env
- have to run multi services: database, mailserver manually (but I guess I can write a script)

### Docker:
pros:
- my dev env is as close as my prod
- run all services with 1 click
cons:
- only support debug with `ipdb`: ipdb.set_trace()
- not sure how the other services run: is it in docker or in local

**notes**
- debug on docker with remote
  - https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack
  - https://stackoverflow.com/questions/57540433/cant-debug-django-app-in-vs-code-with-docker-database-could-not-translate-hos

### Summary
- I can use local for `dev` and docker for `staging`
- How to make local & docker use the same db?
  - Maybe not a good idea. I should stick either local or docker

> I will local first, to fully understand the code, django, how things work together, then I might know whether docker is needed for development