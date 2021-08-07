import Head from 'next/head'
import { useState } from 'react'

import { allQuestions, randomQuestion } from '../lib/questions'

export default function Home({ initialQuestion, questions }) {
  const [question, setQuestion] = useState(initialQuestion)
  const [answer, setAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState()

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Friends Quiz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <label htmlFor="question">{question.question}</label>
        <div>
          <input
            id="question"
            className="m-4 border border-gray-500"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>

        {isCorrect === undefined ? (
          <button onClick={checkAnswer} className="border border-gray-500 p-2 m-4">
            Check answer
          </button>
        ) : (
          <>
            {isCorrect ? (
              <div>Correct!</div>
            ) : (
              <div>Incorrect, the answer is: {question.answer}</div>
            )}
            <button onClick={nextQuestion} className="border border-gray-500 p-2 m-4">
              Next question
            </button>
          </>
        )}
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
