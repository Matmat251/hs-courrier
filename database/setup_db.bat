@echo off
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "DROP DATABASE IF EXISTS hssc_courier;"
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot < "C:\Proyectos\hsscEScner\database\01_schema.sql"
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot < "C:\Proyectos\hsscEScner\database\02_seed.sql"
echo.
echo Base de datos configurada correctamente.
