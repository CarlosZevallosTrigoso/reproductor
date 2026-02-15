# AudioGuía Personal

Reproductor web progresivo (PWA) para audioguías personales con controles optimizados para móvil.

## Características

✅ **Diseño monocromático minimalista**
✅ **Optimizado para pantallas táctiles móviles**
✅ **Reproducción con pantalla bloqueada** (Media Session API)
✅ **Controles de salto precisos** (10s, 1m, 5m, 10m)
✅ **Control de velocidad** (0.5x - 2x)
✅ **Persistencia de estado** (retoma donde lo dejaste)
✅ **PWA instalable** (funciona como app nativa)
✅ **Cache offline** (reproducción sin internet)

## Instalación en GitHub Pages

### 1. Crear repositorio

```bash
# Crear nuevo repo en GitHub
# Nombre sugerido: audioguia

# Clonar este código
git clone [URL]
cd audiogui
```

### 2. Agregar tus archivos de audio

```bash
# Crear carpeta de audio
mkdir audio

# Copiar tus archivos MP3
cp /ruta/a/tus/archivos/*.mp3 audio/
```

### 3. Editar chapters.json

Edita `chapters.json` con tus capítulos:

```json
[
  {
    "title": "Título del Capítulo 1",
    "file": "./audio/mi-archivo-01.mp3",
    "duration": "15:30",
    "artwork": "./icon-512.png"
  },
  {
    "title": "Título del Capítulo 2",
    "file": "./audio/mi-archivo-02.mp3",
    "duration": "22:45",
    "artwork": "./icon-512.png"
  }
]
```

### 4. Generar iconos (opcional)

Si no tienes iconos personalizados, usa el generador incluido:

```bash
# Instalar canvas (solo si no lo tienes)
npm install canvas

# Generar iconos
node generate-icons.js
```

O crea tus propios iconos:
- `icon-192.png` (192x192 px)
- `icon-512.png` (512x512 px)

### 5. Deploy en GitHub Pages

```bash
# Inicializar git
git init
git add .
git commit -m "Initial commit"

# Conectar con tu repo
git remote add origin https://github.com/TU_USUARIO/audioguia.git
git branch -M main
git push -u origin main
```

En GitHub:
1. Ve a Settings → Pages
2. Source: Deploy from branch
3. Branch: `main` → `/root`
4. Save

Tu app estará en: `https://TU_USUARIO.github.io/audioguia/`

## Uso en móvil

### Instalación como PWA

1. Abre la URL en tu navegador móvil
2. Menú → "Agregar a pantalla de inicio"
3. La app aparecerá como app nativa

### Controles

- **Play/Pause**: Botón central grande
- **Saltos hacia atrás**: -10s, -1m, -5m, -10m
- **Saltos hacia adelante**: +10s, +1m, +5m, +10m
- **Velocidad**: 0.5x hasta 2x
- **Navegación**: Anterior/Siguiente capítulo
- **Lista**: Ver todos los capítulos

### Pantalla bloqueada

La app sigue reproduciendo con pantalla bloqueada. Los controles aparecen en:
- Lock screen
- Control Center (iOS)
- Notificación (Android)
- Auriculares bluetooth

## Estructura del proyecto

```
audiogui/
├── index.html          # HTML principal
├── manifest.json       # Configuración PWA
├── sw.js              # Service Worker
├── chapters.json      # Lista de capítulos
├── css/
│   └── style.css      # Estilos monocromáticos
├── js/
│   └── player.js      # Lógica del reproductor
├── audio/             # Tus archivos MP3
│   ├── capitulo-01.mp3
│   ├── capitulo-02.mp3
│   └── ...
└── icon-192.png       # Iconos PWA
    icon-512.png
```

## Personalización

### Cambiar colores

Edita las variables CSS en `css/style.css`:

```css
:root {
    --bg-primary: #000000;    /* Fondo principal */
    --bg-secondary: #1a1a1a;  /* Fondo secundario */
    --text-primary: #ffffff;   /* Texto principal */
    --text-secondary: #999999; /* Texto secundario */
    --accent: #ffffff;         /* Color de énfasis */
    --border: #333333;         /* Bordes */
}
```

### Ajustar saltos

Edita los atributos `data-jump` en `index.html`:

```html
<button class="jump-btn" data-jump="-30">
  <!-- Salto de 30 segundos atrás -->
</button>
```

### Cambiar velocidades

Edita los botones de velocidad en `index.html`:

```html
<button class="speed-btn" data-speed="0.8">0.8x</button>
```

## Consideraciones

### Tamaño de archivos

- GitHub Pages tiene límite de ~1GB por repo
- Archivos individuales max 100MB
- Tus MP3s (5-20MB) están perfectos ✅

### Optimización

Si tienes muchos capítulos:
- Comprime archivos MP3 a 128kbps
- Usa repo separado solo para audio
- O usa CDN externo (Cloudflare R2, etc.)

### Navegadores compatibles

- ✅ Chrome/Edge (Android)
- ✅ Safari (iOS)
- ✅ Firefox (Android)
- ⚠️  Funcionalidad limitada en navegadores antiguos

## Soporte

Para problemas o dudas, abre un issue en GitHub.

---

**Hecho con ❤️ para caminar y escuchar**
