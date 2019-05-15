
const fifteenPuzzle = () => {
  
  const winCubesState = {
    cube1: 11,
    cube2: 21,
    cube3: 31,
    cube4: 41,
    cube5: 12,
    cube6: 22,
    cube7: 32,
    cube8: 42,
    cube9: 13,
    cube10: 23,
    cube11: 33,
    cube12: 43,
    cube13: 14,
    cube14: 24,
    cube15: 34,
    empty: 44
  };

  let currentCubesState = {};
  let movesCounter = 0;
  let timeCounterStart = 0;
  let timeCounterNow = 0;
  let timerId;

  function getAllowedMoves( emptyCellPos ) {
    let allowedMoves = [];

    const emptyCellPosY = emptyCellPos % 10;
    const emptyCellPosX = Math.floor(emptyCellPos / 10);

    if( emptyCellPosX-1 !== 0) {
      allowedMoves.push((( emptyCellPosX - 1 ) * 10) + emptyCellPosY);
    }

    if( emptyCellPosY-1 !== 0) {
      allowedMoves.push(( emptyCellPosX * 10 ) + emptyCellPosY - 1);
    }

    if( emptyCellPosX+1 !== 5) {
      allowedMoves.push((( emptyCellPosX + 1 ) * 10) + emptyCellPosY);
    }

    if( emptyCellPosY+1 !== 5) {
      allowedMoves.push(( emptyCellPosX * 10 ) + emptyCellPosY + 1);
    }

    return allowedMoves;

  }

  function moveCube( cubeNode, newPos ) {

    const newPosY = newPos % 10;
    const newPosX = Math.floor(newPos / 10);
    const cubeWidth = cubeNode.offsetWidth;
    const cubeHeight = cubeNode.offsetHeight;
    const cubeName = cubeNode.dataset.cubename;

    currentCubesState[cubeName] = newPos;

    cubeNode.dataset.cubeposition = newPos;
    cubeNode.style.top = ((newPosY - 1) * cubeHeight) + "px";
    cubeNode.style.left = ((newPosX - 1) * cubeWidth) + "px";

  }

  function setCubesPosition( cubesNodeList, cubesState ) {

    for ( let cubeNode of cubesNodeList ) {
      let nextPos = cubesState[cubeNode.dataset.cubename];
      moveCube(cubeNode, nextPos);
    }

  }


  //using official formula to check if win is possible
  function isWinPossible( cubesState ) {

    let n = 0;
    const k = cubesState.empty % 10;
    let cubesArr = [];
    let cubeNumber = 1;

    for ( let cube in cubesState ) {

      if( cube === 'empty' )
        cubesArr.push([0, cubesState[cube]]);

      cubesArr.push([cubeNumber, cubesState[cube]]);

      cubeNumber++;
    }

    cubesArr.sort((a, b) => {
      return a[1] - b [1];
    });


    for ( let i = 0; i < cubesArr.length; ++i ) {

      if( cubesArr[i][0] ){

        for( let j = 0; j < i; ++j ) {

          if( cubesArr[j][0] > cubesArr[i][0] ) {
            ++n;
          }

        }
      }
    }

    return ((n+k) % 2) === 0;

  }

  function shuffleCubesState( cubesState ) {

    let cubesArr = [];
    let cubeNum = 0;
    let newCubesState = {};

    for ( let cube in cubesState ) {
      cubesArr.push(cubesState[cube]);
    }

    cubesArr.sort((a, b) => {
      return a*Math.random()*10 - b*Math.random()*10;
    });

    for ( let cube in cubesState ) {
      newCubesState[cube] = cubesArr[cubeNum];
      ++cubeNum;
    }

    return isWinPossible(newCubesState)? newCubesState : shuffleCubesState(cubesState);

  }

  function isVictory() {
    for( let cube in currentCubesState) {
      if( winCubesState[cube] !== currentCubesState[cube] ) {
        return false;
      }
    }
    return true;
  }

  function showWinLayer() {
    const winLayer = document.querySelector('.puzzle-win-layer');

    winLayer.classList.add('puzzle-win-layer--active');
  }

  function hideWinLayer() {
    const winLayer = document.querySelector('.puzzle-win-layer');

    winLayer.classList.remove('puzzle-win-layer--active');
  }

  function hideStartLayer() {
    const winLayer = document.querySelector('.puzzle-start-layer');

    winLayer.classList.remove('puzzle-start-layer--active');
  }

  function incrementMovesCounter() {

    const counterNode = document.querySelector("[data-countername='moves']");

    counterNode.textContent = ++movesCounter;

  }

  function resetMovesCounter() {
    const counterNode = document.querySelector("[data-countername='moves']");

    movesCounter = 0;
    counterNode.textContent = movesCounter;
  }

  function updateTimeCounter() {

    timeCounterNow = new Date();

  }

  function updateFormattedTime( timeStart, timeNow ) {

    const counterNode = document.querySelector("[data-countername='time']");

    let timeStr = '00:00:00';

    if( timeStart !== 0 && timeNow !== 0) {

      let interval = timeNow - timeStart;

      let seconds = Math.floor((interval / 1000) % 60);
      let minutes = Math.floor( (interval / (1000 * 60) % 60));
      let hours = Math.floor( (interval / (1000 * 60 *60) % 24));

      seconds = (seconds < 10)? '0' + seconds : seconds;
      minutes = (minutes < 10)? '0' + minutes : minutes;
      hours = (hours < 10)? '0' + hours : hours;


      timeStr = `${hours}:${minutes}:${seconds}`;
    }

    counterNode.textContent = timeStr;

  }

  function startTimeCounter() {

    timeCounterStart = new Date();

    timerId = setInterval(function() {
      updateTimeCounter();
      updateFormattedTime(timeCounterStart, timeCounterNow);
    }, 1000);

  }

  function stopTimeCounter() {

    clearInterval(timerId);

  }

  function resetTimeCounter() {

    clearInterval(timerId);

    timeCounterStart = 0;
    timeCounterNow = 0;

    updateFormattedTime( timeCounterStart );

  }

  function handleCubeClick(event) {
    const cube = event.target;
    const cubePos = Number(cube.dataset.cubeposition);
    const emptyCube = document.querySelector(".cube--empty");

    const allowedMoves = getAllowedMoves( currentCubesState.empty );

    if( allowedMoves.indexOf(cubePos) !== -1 ) {
      moveCube( cube, currentCubesState.empty );
      moveCube( emptyCube ,cubePos );

      incrementMovesCounter();

      if( isVictory() ) {
        stopTimeCounter();
        showWinLayer();
      };
    }

  }

  function initPuzzle() {

    const cubesNodeList = document.querySelectorAll(".cube");

    const startBtns = document.querySelectorAll("[data-action='start']");

    const restartBtns = document.querySelectorAll("[data-action='restart']");
    
    // currentCubesState = shuffleCubesState( winCubesState );

    // setCubesPosition( cubesNodeList, currentCubesState );

    cubesNodeList.forEach((cubeNode) => {
      cubeNode.addEventListener("click", handleCubeClick );
    });

    startBtns.forEach((btn) => {
      btn.addEventListener("click", startPuzzle );
    });

    restartBtns.forEach((btn) => {
      btn.addEventListener("click", restartPuzzle );
    });

  }

  
  function startPuzzle() {

    const cubesNodeList = document.querySelectorAll(".cube");
    
    currentCubesState = shuffleCubesState( winCubesState );
    
    setCubesPosition( cubesNodeList, currentCubesState );
    
    hideStartLayer();
    
    startTimeCounter();
  }
  
  function restartPuzzle() {

    
    resetMovesCounter();

    resetTimeCounter();
    
    hideWinLayer();

    startPuzzle();

  }

  initPuzzle();

}

document.addEventListener("DOMContentLoaded", function() { 

  fifteenPuzzle();

});
