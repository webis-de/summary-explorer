## Use the following commands:
- Download the code and the database.
- Install requirements.txt     
`pip3 install -r requirements.txt`
- Unzip db/db.tar.gz
  <pre>tar -xzvf db/db.tar.gz</pre>
- Create database and import the database to your local PSQL (postgres): 
<pre><code>CREATE DATABASE <b>sumviz</b>;
psql -h hostname -d <b>sumviz</b> -U username -f db/dump.sql</code></pre>

- Creat `.env` file to save DB settings 
Update the database credentials in `SumViz/settings.py` Block 
<pre><code>DEBUG=0
SECRET_KEY=**********
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]
SQL_ENGINE=django.db.backends.postgresql_psycopg2
SQL_DATABASE=*****
SQL_USER=****
SQL_PASSWORD=****
SQL_HOST=****
SQL_PORT=5432
DATABASE=postgres</code></pre>
- Since the imported database already filled with data, there is no need to run the migrations again, we'll **fake** itRun the followings commands:    <pre><code>python manage.py makemigrations
python manage.py migrate **--fake**</code></pre>
- Run the server:   
<code>python manage.py runserver</code>
- Frontend URL: http://127.0.0.1:8000/
- Go to <a href="http://127.0.0.1:8000/api/article/1" target=_blank>`http://127.0.0.1:8000/api/article/1`</a>, you should see the API response, showing the first article
