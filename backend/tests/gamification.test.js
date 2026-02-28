const { calculateLevel } = require('../utils/xpCalculator');

const runTests = () => {
    console.log("🧪 Running Gamification Logic Tests...");
    
    const testCases = [
        { xp: 0, expectedLevel: 1 },
        { xp: 100, expectedLevel: 2 },
        { xp: 400, expectedLevel: 3 },
        { xp: 900, expectedLevel: 4 },
        { xp: 2500, expectedLevel: 6 }
    ];

    testCases.forEach(({ xp, expectedLevel }) => {
        const result = calculateLevel(xp);
        if (result === expectedLevel) {
            console.log(`✅ Pass: ${xp} XP correctly resulted in Level ${result}`);
        } else {
            console.error(`❌ Fail: ${xp} XP expected Level ${expectedLevel} but got ${result}`);
        }
    });
};

runTests();