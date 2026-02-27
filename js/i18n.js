/**
 * نظام الترجمة والتدويل (i18n)
 * يدعم اللغتين العربية والإنجليزية
 */

const i18n = {
    currentLanguage: localStorage.getItem('language') || 'ar',
    
    translations: {
        ar: {
            // Headers & Titles
            title: 'لعبة المشنوق',
            
            // Stats
            points: 'النقاط',
            level: 'المستوى',
            streak: 'السلسلة',
            hints: 'التلميحات',
            
            // Game
            select_letter: 'اختر حرفاً',
            wrong_guesses: 'التخمينات الخاطئة',
            guessed_letters: 'الأحرف المخمنة',
            hint: 'التلميح',
            
            // Buttons
            new_game: 'لعبة جديدة',
            use_hint: 'استخدم تلميح',
            achievements: 'الإنجازات',
            settings: 'الإعدادات',
            continue: 'متابعة',
            reset_data: 'إعادة تعيين البيانات',
            
            // Settings
            sound_effects: 'المؤثرات الصوتية',
            background_music: 'الموسيقى الخلفية',
            vibration: 'الاهتزاز',
            
            // Messages
            you_won: '🎉 مبروك! لقد فزت!',
            you_lost: '😢 للأسف خسرت. الكلمة كانت: ',
            not_enough_points: '⚠️ ليس لديك نقاط كافية للحصول على تلميح',
            hint_used: '💡 تم استخدام تلميح!',
            no_more_hints: '⚠️ لا توجد تلميحات متبقية',
            
            // Achievements
            first_win: 'الفوز الأول',
            first_win_desc: 'فز بلعبة واحدة',
            five_wins: '5 انتصارات',
            five_wins_desc: 'فز بـ 5 ألعاب',
            ten_wins: '10 انتصارات',
            ten_wins_desc: 'فز بـ 10 ألعاب',
            perfect_game: 'لعبة مثالية',
            perfect_game_desc: 'فز بدون أخطاء',
            streak_master: 'سيد السلسلة',
            streak_master_desc: 'احصل على سلسلة من 5 انتصارات',
            hint_master: 'سيد التلميحات',
            hint_master_desc: 'استخدم 10 تلميحات',
            points_collector: 'جامع النقاط',
            points_collector_desc: 'اجمع 1000 نقطة',
            
            // Footer
            made_with: 'تم صنعه بـ ❤️ بواسطة'
        },
        en: {
            // Headers & Titles
            title: 'Hangman Game',
            
            // Stats
            points: 'Points',
            level: 'Level',
            streak: 'Streak',
            hints: 'Hints',
            
            // Game
            select_letter: 'Select a Letter',
            wrong_guesses: 'Wrong Guesses',
            guessed_letters: 'Guessed Letters',
            hint: 'Hint',
            
            // Buttons
            new_game: 'New Game',
            use_hint: 'Use Hint',
            achievements: 'Achievements',
            settings: 'Settings',
            continue: 'Continue',
            reset_data: 'Reset Data',
            
            // Settings
            sound_effects: 'Sound Effects',
            background_music: 'Background Music',
            vibration: 'Vibration',
            
            // Messages
            you_won: '🎉 Congratulations! You Won!',
            you_lost: '😢 Sorry, you lost. The word was: ',
            not_enough_points: '⚠️ You don\'t have enough points for a hint',
            hint_used: '💡 Hint used!',
            no_more_hints: '⚠️ No more hints available',
            
            // Achievements
            first_win: 'First Win',
            first_win_desc: 'Win one game',
            five_wins: '5 Wins',
            five_wins_desc: 'Win 5 games',
            ten_wins: '10 Wins',
            ten_wins_desc: 'Win 10 games',
            perfect_game: 'Perfect Game',
            perfect_game_desc: 'Win without mistakes',
            streak_master: 'Streak Master',
            streak_master_desc: 'Get a streak of 5 wins',
            hint_master: 'Hint Master',
            hint_master_desc: 'Use 10 hints',
            points_collector: 'Points Collector',
            points_collector_desc: 'Collect 1000 points',
            
            // Footer
            made_with: 'Made with ❤️ by'
        }
    },
    
    /**
     * الحصول على نص مترجم
     */
    t(key) {
        return this.translations[this.currentLanguage][key] || key;
    },
    
    /**
     * تعيين اللغة الحالية
     */
    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.updatePageLanguage();
    },
    
    /**
     * تحديث اللغة في الصفحة
     */
    updatePageLanguage() {
        // تحديث اتجاه الصفحة
        document.documentElement.lang = this.currentLanguage;
        document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
        
        // تحديث جميع العناصر التي تحتوي على data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });
        
        // تحديث اللغة في select
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.value = this.currentLanguage;
        }
    },
    
    /**
     * تهيئة نظام الترجمة
     */
    init() {
        this.updatePageLanguage();
        
        // الاستماع لتغيير اللغة
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
                // إعادة تحميل اللعبة عند تغيير اللغة
                if (window.game) {
                    game.initGame();
                }
            });
        }
    }
};

// تهيئة نظام الترجمة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});
