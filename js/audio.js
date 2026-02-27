/**
 * نظام الصوتيات والموسيقى
 * يستخدم Web Audio API لإنشاء أصوات برمجياً
 */

const audioManager = {
    audioContext: null,
    soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
    musicEnabled: localStorage.getItem('musicEnabled') !== 'false',
    vibrationEnabled: localStorage.getItem('vibrationEnabled') !== 'false',
    backgroundOscillator: null,
    
    /**
     * تهيئة Audio Context
     */
    init() {
        if (!this.audioContext) {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioContext = new AudioContext();
            } catch (e) {
                console.warn('Web Audio API غير مدعوم');
            }
        }
    },
    
    /**
     * تشغيل صوت نجاح (صحيح)
     */
    playSuccess() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // إنشاء oscillator للصوت
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        // نغمة صاعدة (ناجحة)
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.start(now);
        osc.stop(now + 0.1);
    },
    
    /**
     * تشغيل صوت خطأ
     */
    playError() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        // نغمة هابطة (خطأ)
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        osc.start(now);
        osc.stop(now + 0.2);
    },
    
    /**
     * تشغيل صوت الفوز
     */
    playWin() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // تشغيل سلسلة من النغمات
        const notes = [523, 659, 784]; // C, E, G (Do, Mi, Sol)
        
        notes.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            const startTime = now + (index * 0.1);
            
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
            
            osc.start(startTime);
            osc.stop(startTime + 0.2);
        });
    },
    
    /**
     * تشغيل صوت الخسارة
     */
    playLose() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // نغمة منخفضة حزينة
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        osc.start(now);
        osc.stop(now + 0.5);
    },
    
    /**
     * تشغيل صوت الزر
     */
    playClick() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        osc.start(now);
        osc.stop(now + 0.05);
    },
    
    /**
     * تشغيل صوت التلميح
     */
    playHint() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // سلسلة نغمات للتلميح
        const notes = [440, 550];
        
        notes.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            const startTime = now + (index * 0.08);
            
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
            
            osc.start(startTime);
            osc.stop(startTime + 0.1);
        });
    },
    
    /**
     * تشغيل موسيقى خلفية
     */
    playBackgroundMusic() {
        if (!this.musicEnabled || !this.audioContext) return;
        
        // موسيقى خلفية بسيطة وهادئة
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // نغمة منخفضة مستمرة
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(110, now); // A2
        gain.gain.setValueAtTime(0.05, now);
        
        osc.start(now);
        this.backgroundOscillator = osc;
    },
    
    /**
     * إيقاف الموسيقى الخلفية
     */
    stopBackgroundMusic() {
        if (this.backgroundOscillator) {
            const ctx = this.audioContext;
            const now = ctx.currentTime;
            
            const gain = this.backgroundOscillator.frequency.value;
            this.backgroundOscillator.stop(now + 0.5);
            this.backgroundOscillator = null;
        }
    },
    
    /**
     * تفعيل/تعطيل الأصوات
     */
    toggleSound(enabled) {
        this.soundEnabled = enabled;
        localStorage.setItem('soundEnabled', enabled);
    },
    
    /**
     * تفعيل/تعطيل الموسيقى
     */
    toggleMusic(enabled) {
        this.musicEnabled = enabled;
        localStorage.setItem('musicEnabled', enabled);
        
        if (!enabled && this.backgroundOscillator) {
            this.stopBackgroundMusic();
        }
    },
    
    /**
     * تفعيل/تعطيل الاهتزاز
     */
    toggleVibration(enabled) {
        this.vibrationEnabled = enabled;
        localStorage.setItem('vibrationEnabled', enabled);
    },
    
    /**
     * تشغيل اهتزاز (للأجهزة المدعومة)
     */
    vibrate(pattern = 50) {
        if (this.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }
};

// تهيئة نظام الصوتيات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    audioManager.init();
});
