## Configuración del Entorno de Trabajo

Después de clonar el repositorio, configura tu entorno de trabajo:

1. Ejecuta en la consola (asegúrate de tener Python instalado):

    ```powershell
    python -m venv ejemplo
    ```

2. Activa el entorno ejecutando:

    ```powershell
    .\ejemplo\Scripts\Activate.ps1
    ```

    Tu consola debería mostrar algo como esto:

    ```
    (ejemplo) PS C:\...\NailsExpress>
    ```

3. Si es necesario, actualiza tu versión de Python:

    ```powershell
    python -m pip install --upgrade pip
    ```

4. Instala las dependencias requeridas:

    ```powershell
    pip install flask
    pip install pymongo
    pip install googlemaps
    pip install python-dotenv
    ```

5. Coloca el archivo `.env` en la carpeta raíz.

6. Ejecuta la aplicación con:

    ```powershell
    py app.py
    ```

## Comandos Comunes en Git

- Clonar un repositorio:

    ```powershell
    git clone <repositorio>
    ```

- Agregar un archivo (guardar cambios):

    ```powershell
    git add <archivo>
    ```

- Realizar un commit (crear respaldo):

    ```powershell
    git commit -m "<comentario>"
    ```

- Mover el puntero de la rama maestra:

    ```powershell
    git branch -f master HEAD
    ```

- Subir los cambios al repositorio principal:

    ```powershell
    git push -f origin master
    ```

- Actualizar el repositorio local desde el repositorio principal:

    ```powershell
    git fetch origin
    ```
