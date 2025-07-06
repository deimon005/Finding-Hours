# ⏱️ PP de Control de Tiempos y Productividad

Aplicación móvil para que los empleados registren sus horas de entrada y salida de manera segura, rápida y validada mediante geolocalización.  
Orientada a mejorar la gestión de tiempos, reducir errores humanos y facilitar el seguimiento por parte del equipo de Recursos Humanos.

---

## 📱 Descripción del Proyecto

Esta aplicación permite a los trabajadores marcar su jornada laboral desde su dispositivo móvil.  
Cada registro incluye la **hora exacta** y la **ubicación GPS**, lo que garantiza la autenticidad del marcaje.

El sistema está conectado a una base de datos en la nube (Supabase), donde se almacenan los registros de cada usuario para su posterior consulta y análisis.

---

## 🚀 Tecnologías Utilizadas

| Tecnología         | Rol en el Proyecto                        |
|--------------------|--------------------------------------------|
| React Native (Expo) | Frontend móvil multiplataforma            |
| Supabase           | Backend como servicio (BaaS): Auth + DB   |
| Expo Location      | Acceso a la geolocalización del dispositivo |
| JavaScript         | Lenguaje principal                        |

---

## 🔐 Funcionalidades Principales

- ✅ Login de usuarios con Supabase Auth.
- 🕒 Registro de entrada y salida con timestamp.
- 📍 Validación de ubicación mediante GPS.
- 🗃️ Historial de registros accesible para cada empleado.
- 🧑‍💼 Panel de administración para RRHH (en futuras versiones).
- 📊 Exportación o visualización de reportes (a desarrollar).

---
Como ingresar a la aplicacion
Paso 1:
acceder al link de descarga para dispositivos android
https://expo.dev/artifacts/eas/drfM8ord3xSjYPN4zywWz1.apk
la descarga iniciara instantaneamente y se debe instalar(puede que sea detectada como aplicacion peligrosa, esto solo ocurre porque es una aplicacion externa a google play)
Paso 2:
Se creara una aplicacion movil llamada Finding Hours la cual debe ser abierta.
Paso 3: 
Crear usuario, para esto se debe dar click a la opcion de "no tienes cuenta? registrate aqui".
paso 4:
luego de creado el usuario se debe realizar la autentificacion de correo electronico, sin esto no se podra acceder.
paso 5:
se debe buscar en la bandeja de entrada del correo utilizado para el registro un correo de verificacion bajo el nombre de supabase auth.
paso 6:
se debe iniciar sesion con el correo registrado y escoger el rol que se utilizo a la hora del registro.
1) si se inicia como trabajador se obtendra la localizacion exacta en tiempo realy se podra registrar entrada y posteriormente salida.
2) si se inicia como administrador se podra ver una lista con todos los trabajadores registrados para la empresa.
3) si se hace click en uno de los trabajadores se entrara a una ventana la cual permite ver un historial de todos sus turnos y negarlos si se ve un comportamiento extraño sease este una ubicacion externa a donde deberia estar.
PD: en el informe habran correos con diferentes roles por si encuentra tedioso la creacion de una cuenta, no las pondremos aca por seguridad de nuestros datos.
