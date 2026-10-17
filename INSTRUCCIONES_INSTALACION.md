# Guía de Puesta en Marcha: English Pro - AR Finance Edition 🇦🇷💼

¡La aplicación ya está construida y lista para usarse! Sigue exactamente la misma estructura que tus proyectos anteriores.

---

## 📁 Ubicación de los Proyectos Creados

1. **Frontend PWA (Cliente para el Celular):**
   `C:\Users\Usuario\.gemini\antigravity\scratch\english-pro-frontend\`
   - [index.html](file:///C:/Users/Usuario/.gemini/antigravity/scratch/english-pro-frontend/index.html)
   - [app.js](file:///C:/Users/Usuario/.gemini/antigravity/scratch/english-pro-frontend/app.js)
   - [style.css](file:///C:/Users/Usuario/.gemini/antigravity/scratch/english-pro-frontend/style.css)
   - [sw.js](file:///C:/Users/Usuario/.gemini/antigravity/scratch/english-pro-frontend/sw.js)
   - [manifest.json](file:///C:/Users/Usuario/.gemini/antigravity/scratch/english-pro-frontend/manifest.json)

2. **Backend (Google Apps Script):**
   `C:\Users\Usuario\.gemini\antigravity\scratch\english-pro-backend\`
   - [Code.gs](file:///C:/Users/Usuario/.gemini/antigravity/scratch/english-pro-backend/Code.gs)

---

## 🚀 Paso 1: Configurar el Backend en Google Sheets (Cero Costo)

1. Entrá a tu Google Drive y creá una nueva hoja de cálculo llamada **"English Pro DB"**.
2. En el menú superior, andá a **Extensiones > Apps Script**.
3. Borrá el código que viene por defecto y pegá el contenido completo del archivo [Code.gs](file:///C:/Users/Usuario/.gemini/antigravity/scratch/english-pro-backend/Code.gs).
4. En el selector de funciones, elegí `initSpreadsheetStructure` y hacé clic en **Ejecutar** (aceptá los permisos habituales). Esto creará automáticamente las 4 hojas necesarias:
   - `Config` (semana actual, racha, nivel).
   - `Progress` (historial de calificaciones y notas del Gatekeeper).
   - `Curriculum` (temarios y vocabulario de cada semana).
   - `CustomArticles` (tus noticias y textos subidos).
5. Hacé clic en **Implementar > Nueva implementación**:
   - Tipo: **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquiera** (*Anyone*).
6. Copiá la URL generada (`https://script.google.com/macros/s/.../exec`).

---

## 🔑 Paso 2: Activar Gemini API Gratis (Google AI Studio)

1. Ingresá a [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) con tu cuenta de Google.
2. Hacé clic en **"Create API key"** (es 100% gratuita para uso individual).
3. Copiá la clave generada (empieza con `AIzaSy...`).

---

## 📱 Paso 3: Probar e Instalar en el Celular (PWA)

### Opción A (Para probar ahora mismo en tu PC o red local):
Podés abrir directamente el archivo [index.html](file:///C:/Users/Usuario/.gemini/antigravity/scratch/english-pro-frontend/index.html) en tu navegador Chrome/Edge o correr un servidor local liviano.

### Opción B (Para instalar en tu celular):
Igual que hiciste con tu frontend anterior, podés alojar la carpeta `english-pro-frontend` en **GitHub Pages**, **Vercel** o **Firebase Hosting** (todos con plan gratuito):
1. Abrí la URL desde el navegador de tu celular (Chrome en Android o Safari en iOS).
2. Tocá en **"Instalar aplicación"** o **"Agregar a la pantalla de inicio"**.
3. Abrí la app desde el ícono en tu pantalla de inicio.
4. Tocá el ícono de **⚙️ (Configuración)** arriba a la derecha y pegá:
   - Tu **URL de Google Apps Script**.
   - Tu **Gemini API Key**.
5. ¡Listo! Ya tenés tu app instalada y lista para entrenar.

---

## 💡 Cómo Funciona tu Rutina Diaria

* **Lunes (Masterclass Teórica):** 
  Abrís la app, leés la teoría de finanzas argentinas (ej. Semana 1: *Balance Sheet & Core Accounting*, Semana 2: *Argentine Macro & FX gap*, Semana 3: *Taxes & ARCA*), escuchás el audio de pronunciación de cada término técnico tocando el parlante 🔊 y revisás los errores frecuentes (letras mudas como la *b* en *debt*).
* **Martes (Shadowing):** 
  Escuchás frases de reuniones y las repetís de inmediato en voz alta con el micrófono para ganar cadencia y ritmo corporal.
* **Miércoles (Fonética & Quiz de pronunciación):** 
  La app te toma fonemas específicos y palabras difíciles.
* **Jueves (Escenarios Reales):** 
  Te plantea un caso de negocio local (ej. explicar la brecha cambiaria o justificar la caída de un margen a un directivo de NY). Grabás tu respuesta oral y el Coach te da feedback constructivo.
* **Viernes (Examen Gatekeeper):** 
  El evaluador te toma la defensa oral de la semana. **Si sacás 75% o más, se desbloquea la siguiente semana.** Si no, te marca los puntos a reforzar para reintentar.
* **Pestaña "Noticias":** 
  Pegás cualquier noticia de Ámbito, El Cronista, FT o resoluciones fiscales para que la IA arme un quiz hablado sobre ese artículo en 5 segundos.
* **Pestaña "Sparring":** 
  Llamadas simuladas de 10 minutos con un CFO en Nueva York, un Auditor de Big Four o un Inversor de Deuda Soberana para ejercitar habla libre de por vida.
