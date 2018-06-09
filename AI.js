var origBoard = [];
const huPlayer = '0';
const aiPlayer = 'x';

// all winning combinations
// each number represents the cell for the tic tac toe board
const winCombos =
[
    [0,1,2], 
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
];

// cells variable stores reference to each tic tac toe square in html
const cells = document.querySelectorAll('.cell');

// function call that starts the game
startGame();

function startGame()
{
    // modifies css, and sets end game to hidden if you start the game
    document.querySelector(".endgame").style.display = "none";
    // instantiates the origBoard variable with numbers 0 - 8 inclusive
    origBoard = Array.from(Array(9).keys());
    
    for(var i = 0; i < cells.length; i++) // cells is reference to every cell in html
    {
        // goes through every cell

        // resets cell to nothing - clears it
        cells[i].innerText = '';
        // removes background color if someone wins previous game
        cells[i].style.removeProperty('background-color');
        // if click cell, call the turnClick function
        cells[i].addEventListener('click', turnClick, false);
    }
}

// everytime you click, this function is called
function turnClick(square)
{
    // if you clicked an empty square, it will fill in
    if(typeof origBoard[square.target.id] === 'number')
    {
        square.target.innerText = huPlayer;
        origBoard[square.target.id] = huPlayer;
    }
    // if not, don't do anything
    else
    {
        return;
    }

    // checks win condition for the human player
    var winHu = checkWin(origBoard, huPlayer);
    if(winHu[0] === true)
    {
        // if you win, then you are declared as winner
        declareWinner(winHu[1], huPlayer);
        return; // this return statement ends the game
    }
    else
    {
        if(checkTie()) // checks if there's a tie, and if so, end the game
        {
            return;
        }
        findBestMove(); // computer minimax function finds best move
        var winAI = checkWin(origBoard, aiPlayer); // checks if AI won
        if(winAI[0] === true) // if AI won, declar AI as winner
        {
            declareWinner(winAI[1], aiPlayer);
            return;
        }
        
    }
    
}

// this function checks if any of the player 
function checkWin(board, player)
{
    for (let i = 0; i < winCombos.length; i++) // goes through all win comditions
    {
        // see if the current board has a win condition
        if(board[winCombos[i][0]] === player && board[winCombos[i][1]] === player && board[winCombos[i][2]] === player) 
        {
            return [true, winCombos[i]]; // Returns true, but ALSO HOW they won. Gives the winning combination
        }
    }
    return false; // return false
}

// this function checks if there's a tie
function checkTie()
{
    // if all squares are filled, then give a tie. Note that the checkwin function is called before this one!!!
    if(emptySquares(origBoard).length === 0) 
    {
        for (let i = 0; i < cells.length; i++) 
        {
            cells[i].removeEventListener('click', turnClick, false); // disables clicking of squares
            cells[i].style.backgroundColor = 'green'; // turns all cell backgrounds to green
            
        }
        document.querySelector(".endgame").style.display = "block"; // displays the endgame from the css
        document.querySelector(".endgame .text").innerText = "Tie!"; // sets text fo the end game box in css
        return true;
    }
    return false; // return false if no tie
}
// this function declares who the winner is
function declareWinner(arrange, player)
{
    var text;
    var color;
    // if the human player won, squares will turn blue, and the text for the endgame box is You win!
    if(player === '0') 
    {
        color = 'blue';
        text = 'You Win!';
    }
    else
    {
        color = 'red'; // red if you lose
        text = 'You Lose!'; // texts will say you lose in end game box
    }

    // modifies html and sets squares to the color selected
    for(let i = 0; i < arrange.length; i++)
    {
        document.getElementById(arrange[i]).style.backgroundColor = color; 
    }

    // removes all click function from squares in tictac toe
    for (let index = 0; index < cells.length; index++) 
    {
        cells[index].removeEventListener('click', turnClick, false);
    }

    // modifies css to display the endgame box
    // sets endgame box text to either you win or you lose
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = text;
}

// this function checks if there are any empty boxes from board state passed
function emptySquares(board)
{
    var emptySpots = [];
    // goes through all of the squares
    for (let index = 0; index < board.length; index++)
    {
        // if the square has a number, then it is empty
        // if the square is occupied, there would be a character instead
        if(typeof board[index] === 'number')
        {
            // adds index of empty spot
            emptySpots.push(index);
        }
    }
    // the statement below was to test if this function works
    // console.log(emptySpots);
    return emptySpots;
    
}

// keeping this function, as this function was used for testing if the computer can make moves
function randomMove()
{
    // empty indexes of origBoard
    var empty = emptySquares(origBoard);
    // console.log("EMPTY LENGTH IS: " + empty.length);
    // random move choice
    var item = empty[Math.floor(Math.random() * empty.length)];
    // console.log(item);
    if(item !== null)
    {
        // change board state of the game
        origBoard[item] = aiPlayer;
        document.getElementById(item).innerText = aiPlayer;
    } 
}

// this function evaluates all possible positions of the board given as parameter
// this function is makes the AI impossible to beat
function minimax(board, player)
{
    // returns indexes that are empty of the board sent as parameter
    // NOTE that this is NOT always the current state of the game
    var possibleMoves = emptySquares(board); 
    
    // checks if player won, then returns positive value because human player is the maximizer
    if(checkWin(board, huPlayer))
    {
        return [10,null];
    }
    // checks if AI won
    else if(checkWin(board, aiPlayer))
    {
        return [-10,null];
    }
    // checks if tie
    else if(possibleMoves.length === 0)
    {
        return [0,null];
    }

    if(player === huPlayer) // maximizer
    {
        var bestValue = -10000; // worst case for maximizer
        var bestMove; // index of best move
        var value; // value of the move

        // go through all possible moves from the board state
        for(var i = 0; i < possibleMoves.length; i++)
        {
            board[possibleMoves[i]] = huPlayer; // change board state
            value = minimax(board, aiPlayer)[0]; // recursively evaluate board
            // if that value is better than bestValue
            // replace bestValue with that value
            // and saves the move
            if(value > bestValue) // greater than sign because it's maximizer's turn
            {
                bestValue = value;
                bestMove = possibleMoves[i];
            }
            // go back to original game state
            board[possibleMoves[i]] = possibleMoves[i];
        }
        // returns best value and the move
        return [bestValue, bestMove];
    }
    else // minimizer
    {
        var bestValue = 10000; // worst case for minimizer
        var bestMove; // index of best move
        var value; // value of move

        // go through all possible moves from the board state
        for(var i = 0; i < possibleMoves.length; i++)
        {
            board[possibleMoves[i]] = aiPlayer; // change board state
            value = minimax(board, huPlayer)[0]; // recursively evaluate board
            // if that value is better than bestValue
            // replace bestValue with that value
            // and saves the move
            if(value < bestValue) // is a less than sign because it's minimizer's turn
            {
                bestValue = value;
                bestMove = possibleMoves[i];
            }
            // undo move to preserve original game state
            board[possibleMoves[i]] = possibleMoves[i];
        }
        // returns best value and the move
        return [bestValue, bestMove];
    }
}

// this function finds best move from minimax function
function findBestMove()
{
    var index = minimax(origBoard, aiPlayer)[1];
    // change board state of game
    origBoard[index] = aiPlayer;
    // change the html text for that box
    document.getElementById(index).innerText = aiPlayer;
}



