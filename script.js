document.addEventListener("DOMContentLoaded", () => {
    const depositBtn = document.getElementById("depositBtn");
    const spinBtn = document.getElementById("spinBtn");
    const playAgainBtn = document.getElementById("playAgainBtn");
    const balanceElement = document.getElementById("balance");
    const reel1 = document.getElementById("reel1");
    const reel2 = document.getElementById("reel2");
    const reel3 = document.getElementById("reel3");
    const resultMessage = document.getElementById("resultMessage");
    const lineButtons = document.querySelectorAll(".line-btn");
    const chosenLineDisplay = document.getElementById("chosen-line");

    let balance = 0;
    let chosenLines = 0;

    const SYMBOLS_COUNTS = {"🌟": 6, "👽": 8, "👻": 6, "🤡": 8 };
    const SYMBOL_VALUES = { "🌟": 50, "👽": 10, "👻": 8, "🤡": 5 };

    const deposit = () => {
        const depositAmount = parseFloat(document.getElementById("deposit").value);
        if (!isNaN(depositAmount) && depositAmount > 0) {
            balance += depositAmount;
            balanceElement.textContent = balance;
            depositBtn.style.display = "none"; // Hide deposit button after deposit
        } else {
            alert("Invalid deposit amount, try again.");
        }
    };

    const chooseLines = (event) => {
        chosenLines = parseInt(event.target.getAttribute("data-lines"));
        chosenLineDisplay.textContent = `Chosen Lines: ${chosenLines}`;
        lineButtons.forEach(btn => btn.style.display = "none"); // Hide all buttons after selection
    };

    const spin = () => {
        const bet = parseFloat(document.getElementById("bet").value);

        if (chosenLines === 0) {
            alert("Please choose the number of lines before placing a bet.");
            return;
        }

        if (isNaN(bet) || bet <= 0 || bet > balance / chosenLines) {
            alert("Invalid bet, try again.");
            return;
        }

        balance -= bet * chosenLines;
        balanceElement.textContent = balance;

        const reels = [];
        const symbols = [];

        for (const [symbol, count] of Object.entries(SYMBOLS_COUNTS)) {
            for (let i = 0; i < count; i++) {
                symbols.push(symbol);
            }
        }

        for (let i = 0; i < 3; i++) {
            reels[i] = [];
            const reelSymbols = [...symbols];
            for (let j = 0; j < 3; j++) {
                const randomIndex = Math.floor(Math.random() * reelSymbols.length);
                reels[i].push(reelSymbols[randomIndex]);
                reelSymbols.splice(randomIndex, 1);
            }
        }

        reel1.textContent = reels[0][0] + " | " + reels[0][1] + " | " + reels[0][2];
        reel2.textContent = reels[1][0] + " | " + reels[1][1] + " | " + reels[1][2];
        reel3.textContent = reels[2][0] + " | " + reels[2][1] + " | " + reels[2][2];

        const winnings = getWinnings(reels, bet, chosenLines);
        balance += winnings;
        balanceElement.textContent = balance;

        resultMessage.textContent = winnings > 0 ? `You won $${winnings - (bet * chosenLines) }!` : `You lost $${bet * chosenLines}!`;

        if (winnings > 0) {
            resultMessage.style.backgroundColor = "rgb(255, 222, 138)"; 
            resultMessage.style.padding = "15px"; 
            resultMessage.style.borderRadius = "5px"; 
        }

        if (winnings <= 0) {
            resultMessage.style.backgroundColor = "rgb(117, 117, 116)"; 
            resultMessage.style.color = "white";
            resultMessage.style.padding = "15px"; 
            resultMessage.style.borderRadius = "5px"; 
        }


        if (balance <= 0) {
            resultMessage.textContent = "You ran out of money!"; 
            resultMessage.style.backgroundColor = "rgb(248, 169, 169)"; 
            resultMessage.style.padding = "10px"; 
            resultMessage.style.borderRadius = "5px";     
            spinBtn.disabled = true;
        }

        spinBtn.style.display = "none";
        playAgainBtn.style.display = "block";
    };

    const getWinnings = (reels, bet, lines) => {
        let winnings = 0;
        for (let i = 0; i < lines; i++) {
            const symbols = reels[i];
            if (symbols.every(symbol => symbol === symbols[0])) {
                winnings += bet * SYMBOL_VALUES[symbols[0]];
            }
        }
        return winnings;
    };

    const playAgain = () => {
        resultMessage.textContent = "";
        spinBtn.style.display = "block";
       if (balance <= 0 || balance < bet) {
        depositBtn.style.display = "block";
       }
        playAgainBtn.style.display = "none";
        spinBtn.disabled = false;
        chosenLines = 0;
        chosenLineDisplay.textContent = "Chosen Lines: None";
        lineButtons.forEach(btn => btn.style.display = "inline-block"); // Show buttons again
    };

    depositBtn.addEventListener("click", deposit);
    lineButtons.forEach(button => button.addEventListener("click", chooseLines));
    spinBtn.addEventListener("click", spin);
    playAgainBtn.addEventListener("click", playAgain);
});
