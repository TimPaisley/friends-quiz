import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

import { allQuestions, randomQuestion } from '../lib/questions'

export default function Home({ initialQuestion, questions }) {
  const [question, setQuestion] = useState(initialQuestion)
  const [answer, setAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState()

  const inputRef = useRef()

  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [])

  const checkAnswer = () => {
    const correct = cleanAnswer(question.answer) === cleanAnswer(answer)
    setIsCorrect(correct)
  }

  const cleanAnswer = (answer) => {
    const words = ['of', 'the', 'in', 'on', 'at', 'to', 'a', 'is', 'their', 'was', 'and']
    const wordRegex = new RegExp('\\b(' + words.join('|') + ')\\b', 'g')
    const charRegex = new RegExp('[^0-9a-zA-Z ]+', 'g')
    const spaceRegex = new RegExp('  +', 'g')

    return answer
      .replace(wordRegex, '')
      .replace(charRegex, '')
      .replace(spaceRegex, ' ')
      .toLowerCase()
      .trim()
  }

  const nextQuestion = () => {
    const random = Math.floor(Math.random() * questions.length)
    setIsCorrect(undefined)
    setAnswer('')
    setQuestion(questions[random])
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      isCorrect === undefined ? checkAnswer() : nextQuestion()
    }
  }

  const buttonClass = 'mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
  const inputClass =
    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Friends Quiz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <label htmlFor="question">{question.question}</label>
        <div className="mt-4">
          <input
            ref={inputRef}
            id="question"
            className={inputClass}
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div>
          {isCorrect === undefined ? (
            <button onClick={checkAnswer} className={buttonClass}>
              Check answer
            </button>
          ) : (
            <>
              <div className="mt-4">
                {isCorrect ? (
                  <div className="text-lg font-bold">Correct!</div>
                ) : (
                  <div>
                    Incorrect, the answer is:
                    <div className="text-lg font-bold">{question.answer}</div>
                  </div>
                )}
              </div>
              <button onClick={nextQuestion} className={buttonClass}>
                Next question
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const initialQuestion = randomQuestion()
  const questions = allQuestions()

  return {
    props: { initialQuestion, questions }
  }
}
