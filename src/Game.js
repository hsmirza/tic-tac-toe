import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button, Box, Modal, TextField, Typography } from '@mui/material'

import Board from './Board'
import ScoreBoard from './ScoreBoard'
import { initialState, style } from './constants'
import { calculateWinner, getLocation } from './helper'

const Game = ()  => {
  const [state, setState] = useState(initialState)
  const [viewScoreBoard, setScoreBoard] = useState(false)
  const [playerOneModalState, setPlayerOneModalState] = useState(false)
  const [playerTwoModalState, setPlayerTwoModalState] = useState(false)
  const [playerOne, setPlayerOne] = useState('')
  const [playerTwo, setPlayerTwo] = useState('')

  const { history } = state
  const current = history[state.currentStepNumber]
  const { winner, winnerRow } = calculateWinner(current.squares)
  let gameResult = {}

  useEffect(() => {
    setPlayerOneModalState(true)
  }, [])

  const handleFirstPlayerName = (event) => setPlayerOne(event.target.value)

  const handleSecondPlayerName = (event) => setPlayerTwo(event.target.value)

  const handleClick = (i) => {
    const history = state.history.slice(0, state.currentStepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()

    if (calculateWinner(squares).winner || squares[i]) {
      return
    }
    squares[i] = state.xIsNext ? 'X' : 'O'
    setState({
      history: history.concat([
        {
          squares,
          currentLocation: getLocation(i),
          stepNumber: history.length,
        },
      ]),
      xIsNext: !state.xIsNext,
      currentStepNumber: history.length,
    })
  }

  const reset = () => setState(initialState)

  const nextPlayerDetails = () => {
    setPlayerOneModalState(false)
    setPlayerTwoModalState(true)

    let playerName = {name: playerOne.toLowerCase()}
    axios.post(`http://localhost:3000/players/create`, playerName )
  }

  const secondPlayerDetails = () => {
    setPlayerTwoModalState(false)

    let playerName = {name: playerTwo.toLowerCase()}
    axios.post(`http://localhost:3000/players/create`, playerName )
  }

  let status
  if (winner) {
    gameResult = {
      win: winner === 'X' ? playerOne.toLowerCase() : playerTwo.toLowerCase(),
      lose: winner === 'X' ? playerTwo.toLowerCase() : playerOne.toLowerCase(),
      draw: false
    }
    axios.post(`http://localhost:3000/matches/create`, gameResult )

    status = `Winner: ${winner === 'X' ? playerOne : playerTwo}`
  } else if (history.length === 10) {
    status = 'Draw. No one won!'

    gameResult = {
      player1: playerTwo.toLowerCase(),
      player2: playerOne.toLowerCase(),
      draw: true
    }
    axios.post(`http://localhost:3000/matches/create`, gameResult )
  } else {
    status = `Current Player: ${state.xIsNext ? playerOne : playerTwo}`
  }

  return (
    <div className='game'>
      <div className='header'>
        <h2>TIC TAC TOE</h2>

        <p onClick={() => setScoreBoard(!viewScoreBoard)}>
          {viewScoreBoard === false ? 'View Score Board' : 'Back To Game'}
        </p>
      </div>

      {viewScoreBoard === false ? (
        <>
        <div>{status}</div>

        <div className='game-board'>
          <Board
            squares={current.squares}
            winnerSquares={winnerRow}
            onClick={(i) => handleClick(i)}
          />
        </div>

        <div className='game-info'>
          <button className='button button--new-game' onClick={reset}>
              New Game
          </button>
        </div>

        <Modal open={playerOneModalState}>
          <Box sx={style}>
            <Typography>
              Enter First Player Name!
            </Typography>

            <div className='data-entry'>
              <TextField
                sx={{ mt: 2 }}
                required
                id='player-one-required'
                placeholder='Enter First Player Name'
                onChange={handleFirstPlayerName}
              />

              <Button
                variant='contained'
                sx={{ mt: 3 }}
                disabled={playerOne.length === 0}
                onClick={nextPlayerDetails}
              >
                Next
              </Button>
            </div>
          </Box>
        </Modal>

        <Modal open={playerTwoModalState}>
          <Box sx={style}>
            <Typography>
              Enter Second Player Name!
            </Typography>

            <div className='data-entry'>
              <TextField
                sx={{ mt: 2 }}
                required
                id='player-two-required'
                placeholder='Enter Second Player Name'
                onChange={handleSecondPlayerName}
              />

              <Button
                variant='contained'
                sx={{ mt: 3 }}
                disabled={playerTwo.length === 0}
                onClick={secondPlayerDetails}
              >
                Start Game
              </Button>
            </div>
          </Box>
        </Modal>
      </>
      ) : (
        <ScoreBoard />
      )}

    </div>
  )
}

export default Game
