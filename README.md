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

## 🧭 Arquitectura General

```mermaid
graph TD
  ReactNative[Aplicación Móvil (React Native)]
  Supabase[Supabase (Auth + Base de Datos)]
  GPS[Geolocalización (APIs del Dispositivo)]

  ReactNative -->|Autenticación, registros, historial| Supabase
  ReactNative -->|Obtención de coordenadas GPS| GPS
