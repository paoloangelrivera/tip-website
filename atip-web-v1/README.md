# AT.ip — Web bilingüe ES / EN

Sitio bilingüe con portafolio AT.ip, selector de idioma y un asistente RAG para consultas sobre Consultoría e Industrial & Logistics.

## Archivos principales

- `index.html`, `styles.css`, `app.js`: sitio y contenido ES/EN.
- `chat-widget.js`, `chat-widget.css`: interfaz del chat.
- `api/chat.js`: endpoint de Vercel que consulta MongoDB Atlas y genera respuestas con Groq.
- `package.json`: driver oficial de MongoDB para el endpoint.

## Variables de entorno

Configura estas variables en Vercel (Project Settings → Environment Variables), sin guardarlas en el repositorio:

- `MONGODB_URI`: cadena de conexión de Atlas. Usa un usuario de base de datos con permiso de lectura sobre `atip`.
- `MONGODB_DATABASE`: `atip`.
- `MONGODB_VECTOR_INDEX`: `knowledge_base_vector`.
- `GROQ_API_KEY`: clave privada de Groq.
- `GROQ_MODEL`: modelo de chat activo en tu cuenta de Groq; por ejemplo `llama-3.3-70b-versatile`.

El sitio llama a `/api/chat` en el mismo dominio. No pongas claves en `app.js`, `chat-widget.js` ni en el HTML. La conversación no se guarda en esta versión; la pregunta se envía a Atlas para recuperar fragmentos y el contexto resultante se envía a Groq.

Para desarrollo local, instala dependencias con `npm install`, configura esas variables en el entorno local y ejecuta con Vercel CLI (`npx vercel dev`).

## MongoDB Atlas

La función espera la colección `atip.knowledge_base` y el índice `knowledge_base_vector`, configurado con Automated Embedding sobre `content` y Voyage AI `voyage-4-lite`. MongoDB documenta Automated Embedding como Preview y recomienda no usarlo en producción mientras siga en Preview.

## Publicación

Despliega la carpeta en Vercel para habilitar el endpoint `/api/chat`; configura primero las variables de entorno en el proyecto de Vercel. No se ha desplegado esta versión.
