/**
 * نظام الإنجازات والنقاط
 */

const achievementSystem = {
    // البيانات المحفوظة
    stats: {
        totalWins: 0,
        totalLosses: 0,
        totalPoints: 0,
        currentStreak: 0,
        maxStreak: 0,
        hintsUsed: 0,
        gamesPlayed: 0,
        perfectGames: 0
    },
    
    // الإنجازات المتاحة
    achievements: [
        {
            id: 'first_win',
            icon: '🏆',
            condition: () => this.stats.totalWins >= 1
        },
        {
            id: 'five_wins',
            icon: '⭐',
            condition: () => this.stats.totalWins >= 5
        },
        {
            id: 'ten_wins',
            icon: '👑',
            condition: () => this.stats.totalWins >= 10
        },
        {
            id: 'perfect_game',
            icon: '💯',
            condition: () => this.stats.perfectGames >= 1
        },
        {
            id: 'streak_master',
            icon: '🔥',
            condition: () => this.stats.maxStreak >= 5
        },
        {
            id: 'hint_master',
            icon: '💡',
            condition: () => this.stats.hintsUsed >= 10
        },
        {
            id: 'points_collector',
            icon: '💰',
            condition: () => this.stats.totalPoints >= 1000
        }
    ],
    
    /**
     * تحميل البيانات المحفوظة
     */
    load() {
        const saved = localStorage.getItem('gameStats');
        if (saved) {
            this.stats = JSON.parse(saved);
        }
    },
    
    /**
     * حفظ البيانات
     */
    save() {
        localStorage.setItem('gameStats', JSON.stringify(this.stats));
    },
    
    /**
     * إضافة نقاط
     */
    addPoints(points) {
        this.stats.totalPoints += points;
        this.save();
        return this.stats.totalPoints;
    },
    
    /**
     * تسجيل فوز
     */
    recordWin(wrongGuesses = 0) {
        this.stats.totalWins++;
        this.stats.gamesPlayed++;
        this.stats.currentStreak++;
        
        // تحديث أقصى سلسلة
        if (this.stats.currentStreak > this.stats.maxStreak) {
            this.stats.maxStreak = this.stats.currentStreak;
        }
        
        // حساب النقاط بناءً على عدد الأخطاء
        const basePoints = 100;
        const bonusPoints = Math.max(0, (6 - wrongGuesses) * 10);
        const totalPoints = basePoints + bonusPoints;
        
        this.addPoints(totalPoints);
        
        // تسجيل لعبة مثالية
        if (wrongGuesses === 0) {
            this.stats.perfectGames++;
        }
        
        this.save();
        return totalPoints;
    },
    
    /**
     * تسجيل خسارة
     */
    recordLoss() {
        this.stats.totalLosses++;
        this.stats.gamesPlayed++;
        this.stats.currentStreak = 0;
        this.save();
    },
    
    /**
     * تسجيل استخدام تلميح
     */
    recordHintUsed() {
        this.stats.hintsUsed++;
        this.save();
    },
    
    /**
     * الحصول على الإنجازات المفتوحة
     */
    getUnlockedAchievements() {
        return this.achievements.filter(achievement => achievement.condition());
    },
    
    /**
     * التحقق من إنجاز جديد
     */
    checkNewAchievements() {
        const unlocked = this.getUnlockedAchievements();
        const saved = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
        
        const newAchievements = unlocked.filter(a => !saved.includes(a.id));
        
        if (newAchievements.length > 0) {
            localStorage.setItem('unlockedAchievements', JSON.stringify(unlocked.map(a => a.id)));
            return newAchievements;
        }
        
        return [];
    },
    
    /**
     * إعادة تعيين البيانات
     */
    reset() {
        this.stats = {
            totalWins: 0,
            totalLosses: 0,
            totalPoints: 0,
            currentStreak: 0,
            maxStreak: 0,
            hintsUsed: 0,
            gamesPlayed: 0,
            perfectGames: 0
        };
        localStorage.removeItem('gameStats');
        localStorage.removeItem('unlockedAchievements');
        this.save();
    },
    
    /**
     * الحصول على إحصائيات اللعبة
     */
    getStats() {
        return {
            ...this.stats,
            winRate: this.stats.gamesPlayed > 0 
                ? Math.round((this.stats.totalWins / this.stats.gamesPlayed) * 100)
                : 0
        };
    }
};

// تحميل البيانات عند بدء التطبيق
document.addEventListener('DOMContentLoaded', () => {
    achievementSystem.load();
});
