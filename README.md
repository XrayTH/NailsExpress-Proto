## El UISM, Prototipado, evaluacion y demas entregables se encuentran en `/Entregables`.

# Configuración del Entorno de Trabajo

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
    pip install -r requirements.txt
    ```

5. Coloca el archivo `.env` en la carpeta raíz.

    Puede usar el que esta en `Entregables/.env.zip` lo extrae en la carpeta raiz usando la contraseña que se le suministró.

6. Ejecuta la aplicación con:

    ```powershell
    python app.py
    ```

