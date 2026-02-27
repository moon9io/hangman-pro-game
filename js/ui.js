/**
 * واجهة المستخدم والعرض
 */

const ui = {
    /**
     * تحديث الواجهة الكاملة
     */
    render() {
        this.updateStats();
        this.updateHangman();
        this.updateWord();
        this.updateLetters();
        this.updateGameStats();
        this.updateHint();
    },
    
    /**
     * تحديث الإحصائيات العلوية
     */
    updateStats() {
        const stats = achievementSystem.getStats();
        
        document.getElementById('pointsDisplay').textContent = stats.totalPoints;
        document.getElementById('levelDisplay').textContent = Math.floor(stats.totalPoints / 500) + 1;
        document.getElementById('streakDisplay').textContent = stats.currentStreak;
        document.getElementById('hintsDisplay').textContent = game.state.hintsAvailable;
    },
    
    /**
     * تحديث رسمة المشنوق
     */
    updateHangman() {
        const parts = ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
        
        parts.forEach((part, index) => {
            const element = document.getElementById(part);
            if (index < game.state.wrongGuesses) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    },
    
    /**
     * تحديث عرض الكلمة
     */
    updateWord() {
        const container = document.getElementById('wordContainer');
        container.innerHTML = '';
        
        const maskedWord = game.getMaskedWord();
        const letters = maskedWord.split(' ');
        
        letters.forEach(letter => {
            const letterBox = document.createElement('div');
            letterBox.className = 'letter-box';
            
            if (letter !== '_') {
                letterBox.classList.add('revealed');
            }
            
            letterBox.textContent = letter;
            container.appendChild(letterBox);
        });
        
        // تحديث التلميح
        document.getElementById('hintText').textContent = game.state.wordHint;
    },
    
    /**
     * تحديث أزرار الأحرف
     */
    updateLetters() {
        const container = document.getElementById('lettersContainer');
        container.innerHTML = '';
        
        const language = i18n.currentLanguage;
        const letters = language === 'ar' 
            ? 'ابجدهوزحطيكلمنسعفصقرشتثخذضظغ'
            : 'abcdefghijklmnopqrstuvwxyz';
        
        const lettersArray = letters.split('');
        
        lettersArray.forEach(letter => {
            const button = document.createElement('button');
            button.className = 'letter-btn';
            button.textContent = letter.toUpperCase();
            button.disabled = game.state.guessedLetters.includes(letter);
            
            // إضافة فئة CSS للأحرف المخمنة
            if (game.state.guessedLetters.includes(letter)) {
                if (game.isCorrectGuess(letter)) {
                    button.classList.add('correct');
                } else {
                    button.classList.add('incorrect');
                }
            }
            
            button.addEventListener('click', () => {
                if (!button.disabled && !game.state.gameOver) {
                    audioManager.playClick();
                    game.makeGuess(letter);
                    ui.render();
                }
            });
            
            container.appendChild(button);
        });
    },
    
    /**
     * تحديث إحصائيات اللعبة
     */
    updateGameStats() {
        document.getElementById('wrongCount').textContent = 
            `${game.state.wrongGuesses}/${game.state.maxWrong}`;
        
        const guessedLetters = game.state.guessedLetters.join(', ') || '-';
        document.getElementById('guessedLetters').textContent = guessedLetters;
    },
    
    /**
     * تحديث عرض التلميح
     */
    updateHint() {
        const hintBtn = document.getElementById('hintBtn');
        if (game.state.gameOver) {
            hintBtn.disabled = true;
        } else {
            hintBtn.disabled = game.state.hintsAvailable <= 0;
        }
    },
    
    /**
     * عرض رسالة (فوز/خسارة)
     */
    showMessage(message, isWin) {
        const messageBox = document.getElementById('messageBox');
        const messageText = document.getElementById('messageText');
        
        messageText.textContent = message;
        messageBox.style.display = 'flex';
        
        // تغيير اللون بناءً على النتيجة
        if (isWin) {
            messageBox.style.backgroundColor = 'rgba(16, 185, 129, 0.5)';
        } else {
            messageBox.style.backgroundColor = 'rgba(239, 68, 68, 0.5)';
        }
    },
    
    /**
     * إخفاء رسالة
     */
    hideMessage() {
        document.getElementById('messageBox').style.display = 'none';
    },
    
    /**
     * عرض تنبيه
     */
    showAlert(message) {
        // استخدام رسالة مؤقتة
        const messageBox = document.getElementById('messageBox');
        const messageText = document.getElementById('messageText');
        
        messageText.textContent = message;
        messageBox.style.display = 'flex';
        messageBox.style.backgroundColor = 'rgba(245, 158, 11, 0.5)';
        
        setTimeout(() => {
            this.hideMessage();
        }, 2000);
    },
    
    /**
     * عرض نافذة الإنجازات
     */
    showAchievements() {
        const modal = document.getElementById('achievementsModal');
        const list = document.getElementById('achievementsList');
        
        list.innerHTML = '';
        
        const unlockedIds = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
        
        achievementSystem.achievements.forEach(achievement => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            
            const card = document.createElement('div');
            card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            
            const icon = document.createElement('div');
            icon.className = 'achievement-icon';
            icon.textContent = achievement.icon;
            
            const name = document.createElement('div');
            name.className = 'achievement-name';
            name.textContent = i18n.t(achievement.id);
            
            const description = document.createElement('div');
            description.className = 'achievement-description';
            description.textContent = i18n.t(`${achievement.id}_desc`);
            
            card.appendChild(icon);
            card.appendChild(name);
            card.appendChild(description);
            
            list.appendChild(card);
        });
        
        modal.style.display = 'flex';
    },
    
    /**
     * إخفاء نافذة الإنجازات
     */
    hideAchievements() {
        document.getElementById('achievementsModal').style.display = 'none';
    },
    
    /**
     * عرض نافذة الإعدادات
     */
    showSettings() {
        const modal = document.getElementById('settingsModal');
        
        // تحديث حالة الخيارات
        document.getElementById('soundToggle').checked = audioManager.soundEnabled;
        document.getElementById('musicToggle').checked = audioManager.musicEnabled;
        document.getElementById('vibrationToggle').checked = audioManager.vibrationEnabled;
        
        modal.style.display = 'flex';
    },
    
    /**
     * إخفاء نافذة الإعدادات
     */
    hideSettings() {
        document.getElementById('settingsModal').style.display = 'none';
    },
    
    /**
     * تبديل المظهر (فاتح/داكن)
     */
    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // تحديث أيقونة الزر
        const icon = document.querySelector('#themeToggle .icon');
        icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
};

// ربط الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // زر لعبة جديدة
    document.getElementById('newGameBtn').addEventListener('click', () => {
        audioManager.playClick();
        ui.hideMessage();
        game.initGame();
    });
    
    // زر التلميح
    document.getElementById('hintBtn').addEventListener('click', () => {
        audioManager.playClick();
        game.useHint();
    });
    
    // زر الإنجازات
    document.getElementById('achievementsBtn').addEventListener('click', () => {
        audioManager.playClick();
        ui.showAchievements();
    });
    
    // إغلاق نافذة الإنجازات
    document.getElementById('achievementsModal').querySelector('.modal-close').addEventListener('click', () => {
        ui.hideAchievements();
    });
    
    // زر الإعدادات
    document.getElementById('settingsBtn').addEventListener('click', () => {
        audioManager.playClick();
        ui.showSettings();
    });
    
    // إغلاق نافذة الإعدادات
    document.getElementById('settingsModal').querySelector('.modal-close').addEventListener('click', () => {
        ui.hideSettings();
    });
    
    // خيارات الإعدادات
    document.getElementById('soundToggle').addEventListener('change', (e) => {
        audioManager.toggleSound(e.target.checked);
    });
    
    document.getElementById('musicToggle').addEventListener('change', (e) => {
        audioManager.toggleMusic(e.target.checked);
    });
    
    document.getElementById('vibrationToggle').addEventListener('change', (e) => {
        audioManager.toggleVibration(e.target.checked);
    });
    
    // زر إعادة تعيين البيانات
    document.getElementById('resetDataBtn').addEventListener('click', () => {
        if (confirm(i18n.currentLanguage === 'ar' 
            ? 'هل أنت متأكد من رغبتك في حذف جميع البيانات؟'
            : 'Are you sure you want to delete all data?')) {
            achievementSystem.reset();
            ui.render();
            ui.hideSettings();
            alert(i18n.currentLanguage === 'ar' 
                ? 'تم حذف جميع البيانات'
                : 'All data has been deleted');
        }
    });
    
    // زر تبديل المظهر
    document.getElementById('themeToggle').addEventListener('click', () => {
        audioManager.playClick();
        ui.toggleTheme();
    });
    
    // زر المتابعة في رسالة اللعبة
    document.getElementById('messageBtn').addEventListener('click', () => {
        audioManager.playClick();
        ui.hideMessage();
        game.initGame();
    });
    
    // إغلاق النوافذ عند النقر خارجها
    document.getElementById('achievementsModal').addEventListener('click', (e) => {
        if (e.target.id === 'achievementsModal') {
            ui.hideAchievements();
        }
    });
    
    document.getElementById('settingsModal').addEventListener('click', (e) => {
        if (e.target.id === 'settingsModal') {
            ui.hideSettings();
        }
    });
    
    document.getElementById('messageBox').addEventListener('click', (e) => {
        if (e.target.id === 'messageBox') {
            ui.hideMessage();
        }
    });
    
    // تحميل المظهر المحفوظ
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.querySelector('#themeToggle .icon');
    icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    
    // دعم لوحة المفاتيح
    document.addEventListener('keydown', (e) => {
        if (game.state.gameOver) return;
        
        const letter = e.key.toLowerCase();
        const language = i18n.currentLanguage;
        const validLetters = language === 'ar' 
            ? 'ابجدهوزحطيكلمنسعفصقرشتثخذضظغ'
            : 'abcdefghijklmnopqrstuvwxyz';
        
        if (validLetters.includes(letter) && !game.state.guessedLetters.includes(letter)) {
            game.makeGuess(letter);
            ui.render();
        }
    });
});
