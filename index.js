function generateMapSymbolsToKey() {
    const mobileKeys = [
        [[1], [2, 'a', 'b', 'c'], [3, 'd', 'e', 'f']],
        [[4, 'g', 'h', 'i'], [5, 'j', 'k', 'l'], [6, 'm', 'n', 'o']],
        [[7, 'p', 'q', 'r', 's'], [8, 't', 'u', 'v'], [9, 'w', 'x', 'y', 'z']],
        [['*'], [0], ['#']],
    ];

    return mobileKeys.reduce((acc, item, y) => {
        item.forEach((button, x) => {
            button.forEach((key, index) => {
                acc[key] = {x, y, index}
            })
        });

        return acc;
    }, {});
}

function calculateClicks(current, next) {
    const MAX_X = 3; // максимальное количество нажатий по оси х
    const MAX_Y = 4; // максимальное количество нажатий по оси у
    const PUSH_OK_AND_ACTIVATE = 2; //активация клавиши и выбор определенного символа требует минимум двух нажатий на клавишу

    const {x, y} = current;
    const {x: nextX, y: nextY, index: nextIndex} = next;

    //считаем разницу по х и у
    const dx = Math.abs(x - nextX);
    const dy = Math.abs(y - nextY);

    //считаем разницу по х и у с учетом обратных переходов (слева направо, справа налево и пр)
    const dx_WithBack = Math.abs(MAX_X - dx);
    const dy_WithBack = Math.abs(MAX_Y - dy);

    // берем минимальную разницу по х и у
    const optimalX = Math.min(dx_WithBack, dx);
    const optimalY = Math.min(dy_WithBack, dy);

    return optimalX + optimalY + nextIndex + PUSH_OK_AND_ACTIVATE;
}

function mobileRemote(text) {
    const START_SYMBOL = 1;
    const CAPS_SYMBOL = '*';

    const separatedText = text.split('');
    const generatedMap = generateMapSymbolsToKey();

    let currentSymbol = START_SYMBOL;
    let isCapsLock = false;
    let countClicks = 0;

    separatedText.forEach((symbol) => {
        const lowSymbol = symbol.toLowerCase();
        const isUpperCase = lowSymbol !== symbol;
        const isLetter = lowSymbol !== symbol.toUpperCase();

        if(isLetter && isUpperCase !== isCapsLock) {
            countClicks += calculateClicks(generatedMap[currentSymbol], generatedMap[CAPS_SYMBOL]);
            currentSymbol = CAPS_SYMBOL;
            isCapsLock = !isCapsLock;
        }

        countClicks += calculateClicks(generatedMap[currentSymbol], generatedMap[lowSymbol]);
        currentSymbol = lowSymbol;
    });

    return countClicks;
}