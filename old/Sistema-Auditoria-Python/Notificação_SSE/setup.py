from cx_Freeze import setup, Executable

# Defina o script principal que você quer compilar
executables = [Executable("clientSide.py")]

setup(
    name="clientSideApp",
    version="1.0",
    description="Descrição do seu programa",
    executables=executables
)
