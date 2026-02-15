// AudioGuía Player
class AudioGuiaPlayer {
    constructor() {
        // Elements
        this.audio = document.getElementById('audioPlayer');
        this.playBtn = document.getElementById('playBtn');
        this.playIcon = this.playBtn.querySelector('.play-icon');
        this.pauseIcon = this.playBtn.querySelector('.pause-icon');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressBar = document.getElementById('progressBar');
        this.progressHandle = document.getElementById('progressHandle');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        this.chapterNumberEl = document.getElementById('chapterNumber');
        this.chapterTitleEl = document.getElementById('chapterTitle');
        this.prevBtn = document.getElementById('prevChapter');
        this.nextBtn = document.getElementById('nextChapter');
        this.playlistToggle = document.getElementById('playlistToggle');
        this.playlistDrawer = document.getElementById('playlistDrawer');
        this.closePlaylistBtn = document.getElementById('closePlaylist');
        this.playlistContent = document.getElementById('playlistContent');
        this.waveformCanvas = document.getElementById('waveform');
        
        // State
        this.chapters = [];
        this.currentChapterIndex = 0;
        this.isPlaying = false;
        this.isDragging = false;
        
        // Initialize
        this.init();
    }
    
    async init() {
        await this.loadChapters();
        this.setupEventListeners();
        this.setupMediaSession();
        this.loadSavedState();
        this.renderPlaylist();
        this.setupWaveform();
        
        // Register Service Worker for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').catch(() => {});
        }
    }
    
    async loadChapters() {
        try {
            const response = await fetch('./chapters.json');
            this.chapters = await response.json();
            
            if (this.chapters.length > 0) {
                this.loadChapter(this.currentChapterIndex);
            }
        } catch (error) {
            console.error('Error loading chapters:', error);
            this.chapterTitleEl.textContent = 'Error cargando capítulos';
        }
    }
    
    loadChapter(index) {
        if (index < 0 || index >= this.chapters.length) return;
        
        const chapter = this.chapters[index];
        this.currentChapterIndex = index;
        
        // Update UI
        this.chapterNumberEl.textContent = `Cap. ${index + 1}`;
        this.chapterTitleEl.textContent = chapter.title;
        
        // Load audio
        this.audio.src = chapter.file;
        
        // Update Media Session
        this.updateMediaSession();
        
        // Update navigation buttons
        this.prevBtn.disabled = index === 0;
        this.nextBtn.disabled = index === this.chapters.length - 1;
        
        // Update playlist highlight
        this.updatePlaylistHighlight();
        
        // Auto-play if was playing
        if (this.isPlaying) {
            this.audio.play();
        }
        
        // Save state
        this.saveState();
    }
    
    setupEventListeners() {
        // Play/Pause
        this.playBtn.addEventListener('click', () => this.togglePlay());
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => {
            this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
        });
        
        this.audio.addEventListener('timeupdate', () => {
            if (!this.isDragging) {
                this.updateProgress();
            }
        });
        
        this.audio.addEventListener('ended', () => {
            this.nextChapter();
        });
        
        // Progress bar
        this.progressContainer.addEventListener('mousedown', (e) => this.startDrag(e));
        this.progressContainer.addEventListener('touchstart', (e) => this.startDrag(e));
        
        document.addEventListener('mousemove', (e) => this.onDrag(e));
        document.addEventListener('touchmove', (e) => this.onDrag(e));
        
        document.addEventListener('mouseup', () => this.stopDrag());
        document.addEventListener('touchend', () => this.stopDrag());
        
        // Jump buttons
        document.querySelectorAll('.jump-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const jump = parseFloat(btn.dataset.jump);
                this.jump(jump);
            });
        });
        
        // Speed buttons
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const speed = parseFloat(btn.dataset.speed);
                this.setSpeed(speed);
                
                // Update active state
                document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Chapter navigation
        this.prevBtn.addEventListener('click', () => this.prevChapter());
        this.nextBtn.addEventListener('click', () => this.nextChapter());
        
        // Playlist
        this.playlistToggle.addEventListener('click', () => this.openPlaylist());
        this.closePlaylistBtn.addEventListener('click', () => this.closePlaylist());
        
        // Prevent screen sleep
        this.preventSleep();
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play();
        this.isPlaying = true;
        this.playIcon.style.display = 'none';
        this.pauseIcon.style.display = 'block';
        this.updateMediaSession();
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playIcon.style.display = 'block';
        this.pauseIcon.style.display = 'none';
        this.saveState();
    }
    
    jump(seconds) {
        this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, this.audio.currentTime + seconds));
    }
    
    setSpeed(speed) {
        this.audio.playbackRate = speed;
        localStorage.setItem('playbackRate', speed);
    }
    
    prevChapter() {
        if (this.currentChapterIndex > 0) {
            this.loadChapter(this.currentChapterIndex - 1);
        }
    }
    
    nextChapter() {
        if (this.currentChapterIndex < this.chapters.length - 1) {
            this.loadChapter(this.currentChapterIndex + 1);
        }
    }
    
    updateProgress() {
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.style.width = percent + '%';
        this.progressHandle.style.left = percent + '%';
        this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        
        // Update waveform
        this.updateWaveform();
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.seek(e);
    }
    
    onDrag(e) {
        if (this.isDragging) {
            this.seek(e);
        }
    }
    
    stopDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            this.saveState();
        }
    }
    
    seek(e) {
        const rect = this.progressContainer.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        
        this.audio.currentTime = percent * this.audio.duration;
        this.updateProgress();
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Media Session API for lock screen controls
    setupMediaSession() {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => this.play());
            navigator.mediaSession.setActionHandler('pause', () => this.pause());
            navigator.mediaSession.setActionHandler('previoustrack', () => this.prevChapter());
            navigator.mediaSession.setActionHandler('nexttrack', () => this.nextChapter());
            navigator.mediaSession.setActionHandler('seekbackward', () => this.jump(-10));
            navigator.mediaSession.setActionHandler('seekforward', () => this.jump(10));
            
            // Seek to specific position (if supported)
            try {
                navigator.mediaSession.setActionHandler('seekto', (details) => {
                    if (details.seekTime) {
                        this.audio.currentTime = details.seekTime;
                    }
                });
            } catch (e) {}
        }
    }
    
    updateMediaSession() {
        if ('mediaSession' in navigator && this.chapters[this.currentChapterIndex]) {
            const chapter = this.chapters[this.currentChapterIndex];
            
            navigator.mediaSession.metadata = new MediaMetadata({
                title: chapter.title,
                artist: 'AudioGuía',
                album: `Capítulo ${this.currentChapterIndex + 1}`,
                artwork: chapter.artwork ? [
                    { src: chapter.artwork, sizes: '512x512', type: 'image/png' }
                ] : []
            });
        }
    }
    
    // Playlist
    renderPlaylist() {
        this.playlistContent.innerHTML = this.chapters.map((chapter, index) => `
            <div class="chapter-item ${index === this.currentChapterIndex ? 'playing' : ''}" 
                 data-index="${index}">
                <div class="chapter-item-number">CAPÍTULO ${index + 1}</div>
                <div class="chapter-item-title">${chapter.title}</div>
                <div class="chapter-item-duration">${chapter.duration || ''}</div>
            </div>
        `).join('');
        
        // Add click listeners
        document.querySelectorAll('.chapter-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.loadChapter(index);
                this.closePlaylist();
            });
        });
    }
    
    updatePlaylistHighlight() {
        document.querySelectorAll('.chapter-item').forEach((item, index) => {
            if (index === this.currentChapterIndex) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }
    
    openPlaylist() {
        this.playlistDrawer.classList.add('active');
    }
    
    closePlaylist() {
        this.playlistDrawer.classList.remove('active');
    }
    
    // Waveform visualization
    setupWaveform() {
        this.waveformCtx = this.waveformCanvas.getContext('2d');
        this.resizeWaveform();
        window.addEventListener('resize', () => this.resizeWaveform());
    }
    
    resizeWaveform() {
        const rect = this.waveformCanvas.parentElement.getBoundingClientRect();
        this.waveformCanvas.width = rect.width * window.devicePixelRatio;
        this.waveformCanvas.height = rect.height * window.devicePixelRatio;
        this.waveformCanvas.style.width = rect.width + 'px';
        this.waveformCanvas.style.height = rect.height + 'px';
        this.waveformCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.updateWaveform();
    }
    
    updateWaveform() {
        const ctx = this.waveformCtx;
        const canvas = this.waveformCanvas;
        const width = canvas.width / window.devicePixelRatio;
        const height = canvas.height / window.devicePixelRatio;
        
        // Clear
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);
        
        // Draw waveform bars
        const barCount = 60;
        const barWidth = width / barCount;
        const progress = this.audio.currentTime / this.audio.duration || 0;
        
        ctx.fillStyle = '#333333';
        for (let i = 0; i < barCount; i++) {
            const barHeight = (Math.sin(i * 0.5) * 0.3 + 0.7) * height * 0.6;
            const x = i * barWidth;
            const y = (height - barHeight) / 2;
            
            // Highlight played portion
            if (i / barCount <= progress) {
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.fillStyle = '#333333';
            }
            
            ctx.fillRect(x + barWidth * 0.2, y, barWidth * 0.6, barHeight);
        }
    }
    
    // Persistence
    saveState() {
        localStorage.setItem('currentChapter', this.currentChapterIndex);
        localStorage.setItem('currentTime', this.audio.currentTime);
        localStorage.setItem('isPlaying', this.isPlaying);
    }
    
    loadSavedState() {
        const savedChapter = parseInt(localStorage.getItem('currentChapter'));
        const savedTime = parseFloat(localStorage.getItem('currentTime'));
        const savedPlaybackRate = parseFloat(localStorage.getItem('playbackRate'));
        
        if (savedChapter >= 0 && savedChapter < this.chapters.length) {
            this.currentChapterIndex = savedChapter;
        }
        
        if (savedPlaybackRate) {
            this.audio.playbackRate = savedPlaybackRate;
            document.querySelectorAll('.speed-btn').forEach(btn => {
                if (parseFloat(btn.dataset.speed) === savedPlaybackRate) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
        
        this.audio.addEventListener('loadedmetadata', () => {
            if (savedTime && !isNaN(savedTime)) {
                this.audio.currentTime = savedTime;
            }
        }, { once: true });
    }
    
    // Prevent screen sleep during playback
    preventSleep() {
        let wakeLock = null;
        
        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    wakeLock = await navigator.wakeLock.request('screen');
                }
            } catch (err) {}
        };
        
        this.audio.addEventListener('play', () => requestWakeLock());
        
        this.audio.addEventListener('pause', () => {
            if (wakeLock) {
                wakeLock.release();
                wakeLock = null;
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AudioGuiaPlayer();
});
