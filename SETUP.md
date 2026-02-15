# Guía de Inicio Rápido

## 🚀 Deploy en 5 minutos

### Paso 1: Subir a GitHub

```bash
# 1. Crea un nuevo repositorio en GitHub
# Nombre: audioguia (o el que prefieras)
# Público o Privado (tu eliges)

# 2. Clona estos archivos en tu computadora
cd ~/Documentos
git clone https://github.com/TU_USUARIO/audioguia.git
cd audioguia

# 3. Copia todos los archivos de este proyecto
cp -r /ruta/donde/descargaste/* .

# 4. Commit inicial
git add .
git commit -m "🎵 AudioGuía inicial"
git push
```

### Paso 2: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. **Settings** (⚙️) → **Pages**
3. **Source**: Deploy from a branch
4. **Branch**: `main` → `/root` → **Save**
5. Espera 1-2 minutos

Tu app estará en: `https://TU_USUARIO.github.io/audioguia/`

### Paso 3: Agregar tus audios

```bash
# Copia tus archivos MP3
cp ~/Descargas/mi-audioguia/*.mp3 audio/

# Edita chapters.json con tus capítulos
nano chapters.json
# o
code chapters.json
```

Formato del chapters.json:

```json
[
  {
    "title": "Capítulo 1: Introducción",
    "file": "./audio/cap-01.mp3",
    "duration": "15:30"
  },
  {
    "title": "Capítulo 2: Desarrollo",
    "file": "./audio/cap-02.mp3",
    "duration": "22:45"
  }
]
```

**Nota**: El campo `duration` es opcional, solo se muestra en la lista.

```bash
# Sube los cambios
git add .
git commit -m "➕ Agregados capítulos de audio"
git push
```

### Paso 4: Usar en tu celular

#### Opción A: Como página web
1. Abre en Chrome/Safari: `https://TU_USUARIO.github.io/audioguia/`
2. Listo, ya puedes usar

#### Opción B: Instalar como app (recomendado)

**Android (Chrome):**
1. Abre la URL
2. Menú (⋮) → "Agregar a pantalla de inicio"
3. Aparecerá icono como app nativa

**iOS (Safari):**
1. Abre la URL
2. Botón compartir 🔗
3. "Agregar a pantalla de inicio"
4. Aparecerá icono como app nativa

---

## 📱 Uso diario

### Controles principales

```
         [Capítulos] ← botón flotante abajo derecha

    ┌─────────────────────────────┐
    │   AUDIOGUÍA                 │
    │   Cap. 1                    │
    │   Nombre del capítulo       │
    └─────────────────────────────┘
    
    ┌─────────────────────────────┐
    │   [Waveform visual]         │
    └─────────────────────────────┘
    
         00:45 / 15:30
    
    ━━━━━━━━━●─────────────────
    
    [-10m] [-5m] [-1m] [-10s]
    
           [  ▶️  ]
    
    [+10s] [+1m] [+5m] [+10m]
    
    VELOCIDAD
    [0.5x] [0.75x] [1x] [1.25x] [1.5x] [2x]
    
    [← ANTERIOR]    [SIGUIENTE →]
```

### Con pantalla bloqueada

La app sigue reproduciendo. Controles disponibles en:

- 🔒 **Lock screen**: Play/Pause, Anterior/Siguiente
- 🎧 **Auriculares bluetooth**: Todos los controles
- 📱 **Control Center/Notificación**: Play/Pause, Saltos

### Trucos

1. **Retomar donde dejaste**: La app guarda automáticamente tu posición
2. **Cambiar velocidad**: Útil para repasar rápido o escuchar con detalle
3. **Saltos precisos**: Combina saltos (ej: -5m + -1m + -10s = retroceder 6:10)
4. **Playlist**: Toca "CAPÍTULOS" para ver todos y saltar a cualquiera

---

## 🔧 Personalización

### Cambiar colores

Edita `css/style.css`, líneas 13-20:

```css
:root {
    --bg-primary: #000000;    /* Negro → cualquier color oscuro */
    --text-primary: #ffffff;  /* Blanco → color de texto */
    --accent: #ffffff;        /* Blanco → color de botones */
}
```

Por ejemplo, tema azul:
```css
:root {
    --bg-primary: #001219;
    --bg-secondary: #005f73;
    --text-primary: #e0fbfc;
    --accent: #0a9396;
}
```

### Agregar/quitar saltos

Edita `index.html`, busca `jump-controls` (hay dos secciones: backward y forward).

Agregar salto de 30 segundos:
```html
<button class="jump-btn" data-jump="-30">
    <svg>...</svg>
    <span>30s</span>
</button>
```

### Cambiar velocidades

Edita `index.html`, busca `speed-buttons`:

```html
<button class="speed-btn" data-speed="0.8">0.8x</button>
```

---

## ❓ Problemas comunes

### "No carga los capítulos"
- Verifica que `chapters.json` tenga formato correcto
- Revisa que las rutas de archivos sean correctas: `./audio/nombre.mp3`

### "No reproduce audio"
- Verifica que los archivos MP3 estén en la carpeta `audio/`
- GitHub Pages tarda 1-2 min en actualizar después de un push

### "No funciona en iPhone"
- Safari requiere interacción del usuario antes de reproducir
- Toca Play manualmente la primera vez

### "Los archivos son muy grandes"
- Límite GitHub: ~1GB total por repo
- Comprime MP3 a 128kbps o menos si necesitas
- O usa repo separado solo para audio

---

## 📊 Límites técnicos

| Límite | Valor | Tu caso |
|--------|-------|---------|
| Tamaño repo GitHub | ~1GB | ✅ OK |
| Archivo individual | 100MB | ✅ 5-20MB |
| Ancho de banda | ~100GB/mes | ✅ Uso personal OK |

---

## 💡 Tips avanzados

### Comprimir archivos MP3

```bash
# Usando ffmpeg (macOS: brew install ffmpeg)
for file in *.mp3; do
    ffmpeg -i "$file" -b:a 128k "compressed_$file"
done
```

### Repo separado para audio

Si tienes muchos capítulos (>50):

1. Crea repo `audioguia-audio`
2. Sube solo los MP3 ahí
3. En `chapters.json` usa URLs completas:
   ```json
   "file": "https://TU_USUARIO.github.io/audioguia-audio/cap-01.mp3"
   ```

### Usar CDN externo

Para evitar límites de GitHub:
- Cloudflare R2 (gratis hasta 10GB)
- Internet Archive (gratis, ilimitado)
- Google Drive + acceso público

---

## 🆘 Soporte

Si algo no funciona:
1. Abre DevTools en el navegador (F12)
2. Ve a Console y busca errores
3. Revisa Network para ver qué archivos no cargan

---

**¡Disfruta tu audioguía! 🎧🚶**
