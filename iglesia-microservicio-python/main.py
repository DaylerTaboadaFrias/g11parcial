from fastapi import FastAPI, Body, Query, Depends, HTTPException, status
import mysql.connector
from fastapi import FastAPI
import mysql.connector
import pandas as pd
import matplotlib.pyplot as plt
from io import BytesIO
from pydantic import BaseModel
import base64

from fastapi.middleware.cors import CORSMiddleware

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import psycopg2
from passlib.context import CryptContext
# Configura la conexión a la base de datos
db_connection = mysql.connector.connect(
    host="18.118.30.90",
    user="grupo11",
    password="PaPo*9821",
    port="3306",
    database="db_iglesia"
)

app =FastAPI()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Conexión a la base de datos PostgreSQL
def get_db():
    try:
        connection = psycopg2.connect(
            user="dayler",
            password="12345678",
            host="postgresql-155872-0.cloudclusters.net",
            port="12836",
            database="iglesia"
        )
        return connection
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.title = "Mi aplicacion con fastAPI"
class DatosActividad(BaseModel):
    actividad_id: int
    fecha_inicio: str = None
    fecha_fin: str = None
movies = [
    {
        'id': 1,
        'title': 'Avatar',
        'overview': "En un exuberante planeta llamado Pandora viven los Na'vi, seres que ...",
        'year': '2009',
        'rating': 7.8,
        'category': 'Acción'    
    } 
]

class DatosLogin(BaseModel):
    email: str = None
    password: str = None

@app.get('/')
def message():
    return "Hello world"

@app.get('/usuarios', tags=['usuarios'])
def get_users(): #devuelve el listado de las peliculas
    # Realiza una consulta SELECT a la base de datos
    cursor = db_connection.cursor()
    cursor.execute("SELECT * FROM usuarios")
    result = cursor.fetchall()
    cursor.close()
    return result

@app.post('/usuario', tags=['registrar usuario'])
def post_user(id: str = Body(default="text"),
                 username: str = Body(default="text"),
                 name:str = Body(default="text")): #devuelve el listado de las peliculas
     # Realiza una consulta INSERT en la base de datos
    cursor = db_connection.cursor()
    insert_query = "INSERT INTO user (id, username, name) VALUES (%s, %s, %s)"
    insert_data = (id, username, name)
    cursor.execute(insert_query, insert_data)
    db_connection.commit()
    cursor.close()
    return {"mensaje": "Dato creado correctamente"}

class DatosFecha(BaseModel):
    fecha_inicio: str
    fecha_fin: str

def obtener_datos_desde_mysql(fecha_inicio: str, fecha_fin: str):
    # Configura la conexión a la base de datos
    conexion = mysql.connector.connect(
        host="18.118.30.90",
    user="grupo11",
    password="PaPo*9821",
    port="3306",
    database="db_iglesia"
    )

    # Consulta SQL para obtener datos de la tabla de actividades entre las fechas especificadas
    consulta_sql = f"SELECT id, montototal, nombre, fecha FROM actividades WHERE fecha BETWEEN '{fecha_inicio}' AND '{fecha_fin}' ORDER BY montototal DESC LIMIT 10"

    # Utiliza Pandas para leer los datos desde la base de datos
    actividades_df = pd.read_sql_query(consulta_sql, conexion)

    # Cierra la conexión a la base de datos
    conexion.close()

    return actividades_df

def generar_grafico(datos_df):
    plt.figure(figsize=(10, 6))
    plt.bar(datos_df['nombre'], datos_df['montototal'], color='blue')
    plt.xlabel('Nombre')
    plt.ylabel('Monto Total')
    plt.title(f'Top 10 de Monto Total de Actividades por Nombre ')
    img_bytes = BytesIO()
    plt.savefig(img_bytes, format='png')
    img_bytes.seek(0)
    img_base64 = base64.b64encode(img_bytes.read()).decode('utf-8')
    return img_base64

# Endpoint POST para obtener gráfica de barras
@app.post("/grafica")
async def obtener_grafica(datos_fecha: DatosFecha):
    # Obtiene los 10 principales datos desde MySQL filtrados por fechas
    datos_df = obtener_datos_desde_mysql(datos_fecha.fecha_inicio, datos_fecha.fecha_fin)

    # Genera el gráfico de barras
    img_base64 = generar_grafico(datos_df)

    # Devuelve la imagen en formato JSON
    return {"imagen_base64": img_base64}

def obtener_datos_desde_mysql_g2(fecha_inicio: str, fecha_fin: str):
    conexion = mysql.connector.connect(
        host="18.118.30.90",
    user="grupo11",
    password="PaPo*9821",
    port="3306",
    database="db_iglesia"
    )

    consulta_sql = f"""
        SELECT a.nombre as actividad, AVG(ai.monto) as promedio_ingresos
        FROM actividades a
        JOIN actividad_ingreso ai ON a.id = ai.actividad_id
        WHERE a.fecha BETWEEN '{fecha_inicio}' AND '{fecha_fin}'
        GROUP BY a.nombre
        ORDER BY promedio_ingresos DESC
    """

    actividades_df = pd.read_sql_query(consulta_sql, conexion)
    conexion.close()

    return actividades_df

def generar_grafico_promedio_ingresos(datos_df, fecha_inicio, fecha_fin):
    plt.figure(figsize=(10, 6))
    plt.bar(datos_df['actividad'], datos_df['promedio_ingresos'], color='green')
    plt.xlabel('Actividad')
    plt.ylabel('Promedio de Ingresos')
    plt.title(f'Promedio de Ingresos por Actividad ({fecha_inicio} - {fecha_fin})')
    img_bytes = BytesIO()
    plt.savefig(img_bytes, format='png')
    img_bytes.seek(0)
    img_base64 = base64.b64encode(img_bytes.read()).decode('utf-8')
    return img_base64

@app.post("/grafica_promedio_ingresos")
async def endpoint_obtener_grafica_promedio_ingresos(datos_fecha: DatosFecha):
    datos_df = obtener_datos_desde_mysql_g2(datos_fecha.fecha_inicio, datos_fecha.fecha_fin)
    
    img_base64 = generar_grafico_promedio_ingresos(datos_df, datos_fecha.fecha_inicio, datos_fecha.fecha_fin)

    return {"imagen_base64": img_base64}

def obtener_datos_asistencias(actividad_id: int):
    conexion = mysql.connector.connect(
        host="18.118.30.90",
    user="grupo11",
    password="PaPo*9821",
    port="3306",
    database="db_iglesia"
    )

    consulta_sql = f"""
        SELECT p.nombre as persona
        FROM personas p
        LEFT JOIN asistencias asis ON p.id = asis.persona_id AND asis.actividad_id = {actividad_id}
        WHERE asis.actividad_id IS NOT NULL
    """

    asistencias_df = pd.read_sql_query(consulta_sql, conexion)
    conexion.close()

    return asistencias_df

def obtener_datos_cantidad_personas():
    conexion = mysql.connector.connect(
        host="18.118.30.90",
    user="grupo11",
    password="PaPo*9821",
    port="3306",
    database="db_iglesia"
    )

    consulta_sql = f"""
        SELECT *
        FROM personas
    """

    personas = pd.read_sql_query(consulta_sql, conexion)
    conexion.close()

    return personas

def generar_grafico_porcentaje_asistencias(asistencias_df, actividad_id,personas):
    total_asistencias = len(asistencias_df)
    total_no_asistencias = len(personas) - total_asistencias

    labels = ['Asistencias', 'No Asistencias']
    sizes = [total_asistencias, total_no_asistencias]
    colors = ['lightgreen', 'lightcoral']

    plt.figure(figsize=(8, 8))
    plt.pie(sizes, labels=labels, autopct='%1.1f%%', colors=colors, startangle=90)
    plt.title(f'Porcentaje de Asistencias vs. No Asistencias (Actividad ID: {actividad_id})')
    
    img_bytes = BytesIO()
    plt.savefig(img_bytes, format='png')
    img_bytes.seek(0)
    img_base64 = base64.b64encode(img_bytes.read()).decode('utf-8')

    return img_base64

@app.post("/grafica_porcentaje_asistencias")
async def endpoint_obtener_grafica_porcentaje_asistencias(datos_actividad: DatosActividad):
    asistencias_df = obtener_datos_asistencias(datos_actividad.actividad_id)
    personas = obtener_datos_cantidad_personas()
    
    img_base64 = generar_grafico_porcentaje_asistencias(asistencias_df, datos_actividad.actividad_id,personas)

    return {"imagen_base64": img_base64}

def obtener_datos_ingresos(actividad_id: int):
 
    conexion = mysql.connector.connect(
        host="18.118.30.90",
    user="grupo11",
    password="PaPo*9821",
    port="3306",
    database="db_iglesia"
    )

    consulta_sql = f"""
        SELECT ai.monto, i.*
        FROM actividad_ingreso ai
        JOIN ingresos i ON ai.ingreso_id = i.id
        WHERE ai.actividad_id = {actividad_id};
    """

    ingresos_df = pd.read_sql_query(consulta_sql, conexion)
    conexion.close()

    return ingresos_df

def generar_grafico_ingresos(ingresos_df, actividad_id):
    plt.figure(figsize=(10, 6))
    plt.bar(ingresos_df['nombre'], ingresos_df['monto'])
    plt.xlabel('Nombre de Ingreso')
    plt.ylabel('Monto')
    plt.title(f'Ingresos para la Actividad ID: {actividad_id}')
    plt.xticks(rotation=45, ha='right')
    
    img_bytes = BytesIO()
    plt.savefig(img_bytes, format='png')
    img_bytes.seek(0)
    img_base64 = base64.b64encode(img_bytes.read()).decode('utf-8')

    return img_base64

@app.post("/grafico_ingresos_actividad")
async def endpoint_obtener_grafico_ingresos(datos_actividad: DatosActividad):
    ingresos_df = obtener_datos_ingresos(datos_actividad.actividad_id)
    img_base64 = generar_grafico_ingresos(ingresos_df, datos_actividad.actividad_id)
    return {"imagen_base64": img_base64}


class DatosActividad(BaseModel):
    fecha_inicio: str = None
    fecha_fin: str = None

def obtener_datos_top10_asistencias_actividades(datos_actividad: DatosActividad):
    conexion = mysql.connector.connect(
        host="18.118.30.90",
    user="grupo11",
    password="PaPo*9821",
    port="3306",
    database="db_iglesia"
    )

    # Agregar condiciones de fecha si están presentes
    condiciones_fecha = ""
    if datos_actividad.fecha_inicio and datos_actividad.fecha_fin:
        condiciones_fecha = f"AND a.fecha BETWEEN '{datos_actividad.fecha_inicio}' AND '{datos_actividad.fecha_fin}'"

    consulta_sql = f"""
        SELECT a.nombre as actividad, COUNT(asi.persona_id) as cantidad_asistencias
        FROM actividades a
        LEFT JOIN asistencias asi ON a.id = asi.actividad_id
        WHERE 1 {condiciones_fecha}
        GROUP BY a.id, a.nombre
        ORDER BY cantidad_asistencias DESC
        LIMIT 10;
    """

    top10_asistencias_df = pd.read_sql_query(consulta_sql, conexion)
    conexion.close()

    return top10_asistencias_df

def generar_grafico_top10_asistencias_actividades(top10_asistencias_df):
    plt.figure(figsize=(10, 6))
    plt.bar(top10_asistencias_df['actividad'], top10_asistencias_df['cantidad_asistencias'])
    plt.xlabel('Actividad')
    plt.ylabel('Cantidad de Asistencias')
    plt.title('Top 10 Actividades con Mayores Asistencias')
    plt.xticks(rotation=45, ha='right')
    
    img_bytes = BytesIO()
    plt.savefig(img_bytes, format='png')
    img_bytes.seek(0)
    img_base64 = base64.b64encode(img_bytes.read()).decode('utf-8')

    return img_base64

@app.post("/grafico_top10_asistencias_actividades")
async def endpoint_obtener_grafico_top10_asistencias_actividades(datos_actividad: DatosActividad):
    top10_asistencias_df = obtener_datos_top10_asistencias_actividades(datos_actividad)
    img_base64 = generar_grafico_top10_asistencias_actividades(top10_asistencias_df)

    return {"imagen_base64": img_base64}

def get_user(cursor, email: str):
    cursor.execute("SELECT id, name, email, password FROM users WHERE email = %s", (email,))
    return cursor.fetchone()

def create_user(cursor, name: str, email: str, password: str):
    cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", (name, email, password))
    return {"status": "Success","message": "usuario ya creado","data": {"id":1,"name": name, "email": email}} 

# Rutas de API
@app.post("/register")
def register_user(name: str, email: str, password: str, db=Depends(get_db)):
    cursor = db.cursor()
    try:
        user = get_user(cursor, email=email)
        if user:
            return {"status": "Error","message": "Error","data": false}
        return create_user(cursor, name=name, email=email, password=password)
    except Exception as e:
            return {"status": "Error","message": "Error","data": false}
    finally:
        cursor.close()
        db.commit()

@app.post("/login")
def login_user(datos_login: DatosLogin,db=Depends(get_db)):
    
    cursor = db.cursor()
    try:
        user = get_user(cursor, email=datos_login.email)
        if not user or datos_login.password != user[3]:  # Assuming the password column is at index 3
            return {"status": "Error","message": "Error","data": false}
        return {"status": "Success","message": "Logeado correctamente","data": user}
    except Exception as e:
        return {"message": "Error"}
    finally:
        cursor.close()