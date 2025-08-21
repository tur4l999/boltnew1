import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SAMPLE_QUESTIONS } from '../../lib/data';
import { mistakesStore } from '../../lib/mistakesStore';

export function PracticeInline() {
  const { t } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  
  const question = SAMPLE_QUESTIONS[currentIndex];
  const isCorrect = selectedAnswer && isLocked ? selectedAnswer === question.correctOptionId : null;

  function confirmAnswer() {
    if (selectedAnswer) {
      setIsLocked(true);
      if (selectedAnswer !== question.correctOptionId) {
        mistakesStore.add(question.id);
      }
    }
  }

  function nextQuestion() {
    setCurrentIndex(Math.min(SAMPLE_QUESTIONS.length - 1, currentIndex + 1));
    setSelectedAnswer(null);
    setIsLocked(false);
  }

  function prevQuestion() {
    setCurrentIndex(Math.max(0, currentIndex - 1));
    setSelectedAnswer(null);
    setIsLocked(false);
  }

  return (
    <Card>
      <div className="text-xs text-gray-500 mb-2">
        {currentIndex + 1}/{SAMPLE_QUESTIONS.length}
      </div>
      <div className="font-bold mb-3 text-gray-900">{question.text}</div>
      {question.imageUrl && (
        <img
          src={question.imageUrl}
          alt="Question visual"
          className="w-full h-40 object-cover rounded-lg mb-3"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}
      <div className="space-y-2">
        {question.options.map((option) => (
          <label
            key={option.id}
            className={`flex items-center gap-3 p-3 rounded-xl border min-h-[44px] ${
              isLocked ? 'cursor-default' : 'cursor-pointer'
            } ${
              selectedAnswer === option.id
                ? 'border-emerald-600 bg-gray-50'
                : 'border-gray-300 bg-white'
            }`}
          >
            <input
              type="radio"
              name="answer"
              checked={selectedAnswer === option.id}
              disabled={isLocked}
              onChange={() => setSelectedAnswer(option.id)}
              className="w-4 h-4 text-emerald-600"
            />
            <span className="text-sm text-gray-700">{option.text}</span>
          </label>
        ))}
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        <Button
          onClick={prevQuestion}
          disabled={currentIndex === 0}
          variant="ghost"
          size="sm"
        >
          {t.prev}
        </Button>
        
        {!isLocked ? (
          <Button onClick={confirmAnswer} disabled={!selectedAnswer} size="sm">
            {t.confirmAnswer}
          </Button>
        ) : (
          <>
            <div className={`flex items-center gap-2 font-bold text-sm ${
              isCorrect ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {isCorrect ? '✅ Doğru' : '❌ Səhv'}
            </div>
            <details className="ml-auto">
              <summary className="cursor-pointer select-none text-sm text-gray-700">
                {t.explanation}
              </summary>
              <div className="text-sm mt-2 text-gray-700 p-2 bg-gray-50 rounded-lg">
                {question.explanation}
              </div>
            </details>
            <Button
              onClick={nextQuestion}
              disabled={currentIndex === SAMPLE_QUESTIONS.length - 1}
              size="sm"
            >
              {t.next}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}