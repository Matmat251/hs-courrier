@echo off
set MVN="C:\Users\User\.m2\wrapper\dists\apache-maven-3.9.9-bin\33b4b2b4\apache-maven-3.9.9\bin\mvn.cmd"
echo Iniciando HSSC Courier Backend en puerto 8080...
echo.
cd /d "C:\Proyectos\hsscEScner\backend"
%MVN% spring-boot:run
