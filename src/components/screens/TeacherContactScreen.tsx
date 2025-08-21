import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Comment {
  id: string;
  user: string;
  avatar: string;
  question: string;
  answer?: string;
  teacher?: string;
  timestamp: string;
}

export function TeacherContactScreen() {
  const { goBack } = useApp();
  const [newQuestion, setNewQuestion] = useState('');
  
  const comments: Comment[] = [
    {
      id: '1',
      user: 'Aynur Məmmədova',
      avatar: 'A',
      question: 'Bu nişanın mənası nədir? Hansı hallarda istifadə olunur?',
      answer: 'Bu nişan "Dayanmaq qadağandır" mənasını verir. Şəhər mərkəzində və əsas yollarda tez-tez görülür.',
      teacher: 'Müəllim Rəşad',
      timestamp: '2 saat əvvəl'
    },
    {
      id: '2',
      user: 'Elvin Qasımov',
      avatar: 'E',
      question: 'Dairəvi hərəkətdə hansı qaydalar var? Çox qarışıq gəlir.',
      answer: 'Dairəvi hərəkətdə əsas qayda: içəridə olan nəqliyyat vasitəsi üstünlük hüququna malikdir. Daxil olarkən gözləmək lazımdır.',
      teacher: 'Müəllim Səbinə',
      timestamp: '5 saat əvvəl'
    },
    {
      id: '3',
      user: 'Nigar Əliyeva',
      avatar: 'N',
      question: 'Gecə vaxtı işıqlandırma qaydaları necədir?',
      timestamp: '1 gün əvvəl'
    }
  ];

  const handleSubmit = () => {
    if (newQuestion.trim()) {
      alert(`Sualınız göndərildi: "${newQuestion}"`);
      setNewQuestion('');
    }
  };

  return (
    <div className="p-3 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center hover:bg-gray-100"
        >
          ←
        </button>
        <h1 className="text-lg font-bold text-gray-900">Sualını qeyd et</h1>
      </div>

      {/* New Question Form */}
      <Card className="mb-4">
        <div className="space-y-3">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Sualınızı yazın..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows={3}
          />
          <Button onClick={handleSubmit} disabled={!newQuestion.trim()}>
            Sual göndər
          </Button>
        </div>
      </Card>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <div className="space-y-3">
              {/* User Question */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                  {comment.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 text-sm">{comment.user}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <div className="text-sm text-gray-700">{comment.question}</div>
                </div>
              </div>

              {/* Teacher Answer */}
              {comment.answer && (
                <div className="ml-11 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-emerald-700 text-sm">{comment.teacher}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Müəllim</span>
                  </div>
                  <div className="text-sm text-gray-700">{comment.answer}</div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}