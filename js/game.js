/**
 * منطق لعبة المشنوق الأساسي
 */

const game = {
    // حالة اللعبة
    state: {
        word: '',
        wordHint: '',
        guessedLetters: [],
        wrongGuesses: 0,
        maxWrong: 6,
        gameOver: false,
        won: false,
        hintsAvailable: 3
    },
    
    // الكلمات المتاحة
    words: {
        ar: [],
        en: []
    },
    
    /**
     * تحميل الكلمات من ملفات JSON
     */
    async loadWords() {
        try {
            // تحميل الكلمات العربية
            const arResponse = await fetch('data/words-ar.json');
            const arData = await arResponse.json();
            this.words.ar = arData.words;
            
            // تحميل الكلمات الإنجليزية
            const enResponse = await fetch('data/words-en.json');
            const enData = await enResponse.json();
            this.words.en = enData.words;
        } catch (error) {
            console.error('خطأ في تحميل الكلمات:', error);
            // استخدام كلمات افتراضية في حالة الفشل
            this.words.ar = [
                { word: 'برمجة', hint: 'فن كتابة الأكواد' },
                { word: 'حاسوب', hint: 'جهاز إلكتروني' }
            ];
            this.words.en = [
                { word: 'programming', hint: 'Writing code' },
                { word: 'computer', hint: 'Electronic device' }
            ];
        }
    },
    
    /**
     * اختيار كلمة عشوائية
     */
    selectRandomWord() {
        const language = i18n.currentLanguage;
        const wordList = this.words[language];
        
        if (wordList.length === 0) {
            console.error('لا توجد كلمات متاحة');
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * wordList.length);
        return wordList[randomIndex];
    },
    
    /**
     * تهيئة لعبة جديدة
     */
    initGame() {
        const selectedWord = this.selectRandomWord();
        
        if (!selectedWord) {
            console.error('فشل في اختيار كلمة');
            return;
        }
        
        this.state = {
            word: selectedWord.word.toLowerCase(),
            wordHint: selectedWord.hint,
            guessedLetters: [],
            wrongGuesses: 0,
            maxWrong: 6,
            gameOver: false,
            won: false,
            hintsAvailable: 3
        };
        
        // تحديث الواجهة
        ui.render();
    },
    
    /**
     * التحقق من تخمين صحيح
     */
    isCorrectGuess(letter) {
        return this.state.word.includes(letter.toLowerCase());
    },
    
    /**
     * معالجة تخمين
     */
    makeGuess(letter) {
        if (this.state.gameOver) return false;
        
        letter = letter.toLowerCase();
        
        // التحقق من أن الحرف لم يتم تخمينه من قبل
        if (this.state.guessedLetters.includes(letter)) {
            return false;
        }
        
        this.state.guessedLetters.push(letter);
        
        // التحقق من صحة التخمين
        if (!this.isCorrectGuess(letter)) {
            this.state.wrongGuesses++;
            audioManager.playError();
            audioManager.vibrate(100);
        } else {
            audioManager.playSuccess();
            audioManager.vibrate([50, 50, 50]);
        }
        
        // التحقق من حالة اللعبة
        this.checkGameStatus();
        
        return true;
    },
    
    /**
     * التحقق من حالة اللعبة (فوز/خسارة)
     */
    checkGameStatus() {
        // التحقق من الفوز
        const wordLetters = this.state.word.split('');
        const allGuessed = wordLetters.every(letter => 
            this.state.guessedLetters.includes(letter)
        );
        
        if (allGuessed) {
            this.state.gameOver = true;
            this.state.won = true;
            
            // تسجيل الفوز
            const points = achievementSystem.recordWin(this.state.wrongGuesses);
            
            // تشغيل صوت الفوز
            audioManager.playWin();
            audioManager.vibrate([100, 50, 100]);
            
            // عرض رسالة الفوز
            ui.showMessage(
                `${i18n.t('you_won')} +${points} ${i18n.t('points')}`,
                true
            );
            
            return;
        }
        
        // التحقق من الخسارة
        if (this.state.wrongGuesses >= this.state.maxWrong) {
            this.state.gameOver = true;
            this.state.won = false;
            
            // تسجيل الخسارة
            achievementSystem.recordLoss();
            
            // تشغيل صوت الخسارة
            audioManager.playLose();
            audioManager.vibrate([200, 100, 200]);
            
            // عرض رسالة الخسارة
            ui.showMessage(
                `${i18n.t('you_lost')}${this.state.word}`,
                false
            );
        }
    },
    
    /**
     * استخدام تلميح
     */
    useHint() {
        if (this.state.gameOver) return false;
        
        if (this.state.hintsAvailable <= 0) {
            ui.showAlert(i18n.t('no_more_hints'));
            return false;
        }
        
        // تكلفة التلميح (50 نقطة)
        const hintCost = 50;
        
        if (achievementSystem.stats.totalPoints < hintCost) {
            ui.showAlert(i18n.t('not_enough_points'));
            return false;
        }
        
        // خصم النقاط
        achievementSystem.stats.totalPoints -= hintCost;
        achievementSystem.save();
        
        // استخدام التلميح
        this.state.hintsAvailable--;
        achievementSystem.recordHintUsed();
        
        // تشغيل صوت التلميح
        audioManager.playHint();
        audioManager.vibrate([50, 30, 50]);
        
        ui.showAlert(i18n.t('hint_used'));
        ui.render();
        
        return true;
    },
    
    /**
     * الحصول على الكلمة المقنعة
     */
    getMaskedWord() {
        return this.state.word
            .split('')
            .map(letter => 
                this.state.guessedLetters.includes(letter) ? letter : '_'
            )
            .join(' ');
    },
    
    /**
     * الحصول على الأحرف المخمنة الخاطئة
     */
    getWrongLetters() {
        return this.state.guessedLetters
            .filter(letter => !this.isCorrectGuess(letter))
            .join(', ');
    },
    
    /**
     * الحصول على الأحرف المخمنة الصحيحة
     */
    getCorrectLetters() {
        return this.state.guessedLetters
            .filter(letter => this.isCorrectGuess(letter))
            .join(', ');
    }
};

// تحميل الكلمات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    await game.loadWords();
    game.initGame();
});
