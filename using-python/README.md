# Getting started
- Clone the repository
```
git clone https://github.com/intelliconnect/access-aws-secret-manager.git
```
- Install dependencies
* python 3.8.x
    * `sudo apt-get install python3.8 python3-pip`
* virtualenv
    * `sudo pip3 install virtualenv`

### First time setup (using virtualenv)
```
# using virtualenv
virtualenv --python=python3.8 venv --no-site-packages
source venv/bin/activate
pip install -r requirements.txt

python secret_conn.py
