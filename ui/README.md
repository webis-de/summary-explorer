## Setting up the Django app:
- Install dependencies.     
`pip3 install -r requirements.txt`
- Create a postgres database and import from the downloaded database file. 
<pre><code>CREATE DATABASE <b>sumviz</b>;
psql -h hostname -d <b>sumviz</b> -U username -f dbexport.sql</code></pre>

- Create a `.env` file to save DB settings. Also update the database credentials in `SumViz/settings.py`  
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
- Since the imported database already contains the processed data, there is no need to run the migrations again (**fake** them).    
<pre><code>python manage.py makemigrations
python manage.py migrate **--fake**</code></pre>
- Run the server:   
<code>python manage.py runserver</code>
- Frontend URL: http://127.0.0.1:8000/
- Visit <a href="http://127.0.0.1:8000/api/article/1" target=_blank>`http://127.0.0.1:8000/api/article/1`</a> to see the first article as API response.
