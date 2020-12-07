import React, {useState, useRef, useEffect} from 'react';
import {useInterval} from './Container/useInterval'
import{CANVAS_SIZE, SNAKE_START, APPLE_START, SCALE,SPEED,DIRECTIONS} from './Container/constants'
import './App.css';


const App = () => {

  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState([0,-1]);
  const [speed, setSpeed] = useState(600);
  const [gameOver, setGameOver] = useState(null);
  
  const startGame = () => {
    setSnake(SNAKE_START)
    setApple(APPLE_START)
    setDir([0,-1])
    setSpeed(SPEED)
    setGameOver(null)
  }

  const endGame = () =>{
    setSpeed(null)
    setGameOver(true)
  }

  const moveSnake = ({ keyCode }) =>
    keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);
  //const moveSnake = ({ keyCode }) => setDir(DIRECTIONS[keyCode])

  const createApple = () => 
    apple.map((_a, i)=> Math.floor(Math.random() * (CANVAS_SIZE[i]) / SCALE))

  const checkCollision = (piece, snk = snake) => {
    if (
      piece[0]  * SCALE >= CANVAS_SIZE[0] || 
      piece[0] < 0 || 
      piece[1]  * SCALE >= CANVAS_SIZE[1] || 
      piece[1] < 0
    )
    return true

    for (const segment of snk){
      if(piece[0] === segment[0] && piece[1] === segment[1]) return true
    }
      
    return false
  }

  const checkAppleCollision = newSnake =>{
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]){
      let newApple = createApple()
        while (checkCollision(newApple, newSnake)){
          newApple = createApple()
        }
        setApple(newApple)
        return true
    }
    return false
  }

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake))
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]]
    snakeCopy.unshift(newSnakeHead)
    if (checkCollision(newSnakeHead)) endGame()
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop()

    setSnake(snakeCopy)
  }

  useEffect(()=>{
    const context = canvasRef.current.getContext("2d")
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0)
    context.clearRect(0,0, CANVAS_SIZE[0], CANVAS_SIZE[1])
    context.fillStyle = "blue"
    snake.forEach(([x,y]) => context.fillRect(x,y,1,1))
    context.fillStyle = "orange"
    context.fillRect(apple[0], apple[1],1,1)
  }, [snake, apple, gameOver] )

 
  useEffect(() => {
    if (window){
      window.addEventListener('keydown', (e)=>moveSnake(e));
    }
  });

  useInterval(()=> gameLoop(), speed)

   
  
  return (
    <div className="App">

      <div role="button" tabIndex="0" className="div">
        <canvas
          ref={canvasRef}
          width={`${CANVAS_SIZE[0]}px`}
          height={`${CANVAS_SIZE[1]}px`}
          className="board"
        />
      </div>
      <div className="rightColumn">
        <button className="startButton" onClick={startGame}>{gameOver ? "Start Game" : "Restart Game"}</button>
        {gameOver && <div className="text">GAME OVER!</div>}  
      </div>
    </div>
  )
}

export default App;
