import React, { useReducer, useEffect } from 'react'

interface WordPair {
  scrambled: string
  correct: string
}

interface GameState {
  wordPair: WordPair
  userGuess: string
  isCorrect: boolean | null
  attempts: number
}

type GameAction =
  | { type: 'SET_GUESS'; payload: string }
  | { type: 'CHECK_ANSWER' }
  | { type: 'RESET' }

const wordList: WordPair[] = [
  { scrambled: 'ELAPXPME', correct: 'example' },
  { scrambled: 'RACSMBL', correct: 'scramble' },
  { scrambled: 'RAETCRAH', correct: 'character' },
]

const getRandomWordPair = (): WordPair => {
  const randomIndex = Math.floor(Math.random() * wordList.length)
  return wordList[randomIndex]
}

const initialState: GameState = {
  wordPair: getRandomWordPair(),
  userGuess: '',
  isCorrect: null,
  attempts: 0,
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_GUESS':
      return { ...state, userGuess: action.payload }
    case 'CHECK_ANSWER':
      const isCorrect =
        state.userGuess.toLowerCase() === state.wordPair.correct.toLowerCase()
      return { ...state, isCorrect, attempts: state.attempts + 1 }
    case 'RESET':
      return { ...initialState, wordPair: getRandomWordPair() }
    default:
      throw new Error('Unhandled action type')
  }
}

const WordScrambleGame: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  useEffect(() => {
    // Reset game state when the component mounts
    dispatch({ type: 'RESET' })
  }, [])

  const handleSubmitGuess = () => {
    dispatch({ type: 'CHECK_ANSWER' })
  }

  const handleResetGame = () => {
    dispatch({ type: 'RESET' })
  }

  return (
    <div>
      <h2>{state.wordPair.scrambled}</h2>
      <input
        type="text"
        value={state.userGuess}
        onChange={(e) =>
          dispatch({ type: 'SET_GUESS', payload: e.target.value })
        }
        placeholder="Your guess"
      />
      <button onClick={handleSubmitGuess}>Submit</button>
      {state.isCorrect !== null && (
        <div>
          {state.isCorrect ? 'Correct!' : 'Incorrect, try again!'}
          <p>Attempts: {state.attempts}</p>

          {state.isCorrect && (
            <button onClick={handleResetGame}>Next Word</button>
          )}
        </div>
      )}
    </div>
  )
}

export default WordScrambleGame
