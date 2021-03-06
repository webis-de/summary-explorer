## Setting up the Django app:
- Install dependencies.     
`pip3 install -r requirements.txt`
- Create a postgres database and import from the downloaded database [file](https://files.webis.de/summary-explorer/database/dbexport.sql). 
<pre>psql --username=postgres</pre>
<pre><code>CREATE DATABASE <b>sumviz</b>;
psql -h hostname -d <b>sumviz</b> -U username -f dbexport.sql</code></pre>

- Create a `.env` file to save DB settings. 
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
- Run the server:   
<code>python manage.py runserver</code>
- Frontend URL: http://127.0.0.1:8000/
