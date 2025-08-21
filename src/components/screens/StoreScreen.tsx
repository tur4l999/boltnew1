import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Book {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
}

export function StoreScreen() {
  const { t, isDarkMode } = useApp();
  
  const books: Book[] = [
    {
      id: 'book1',
      title: 'Yol Hərəkəti Qaydaları',
      price: 12,
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Tam və ətraflı yol qaydaları kitabı'
    },
    {
      id: 'book2', 
      title: 'Yol Nişanları Atlası',
      price: 8,
      image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Bütün yol nişanlarının izahı'
    },
    {
      id: 'book3',
      title: 'Sürücülük Təcrübəsi',
      price: 15,
      image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400', 
      description: 'Praktiki sürücülük məsləhətləri'
    },
    {
      id: 'book4',
      title: 'İmtahan Hazırlığı',
      price: 10,
      image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'İmtahana hazırlıq üçün test kitabı'
    }
  ];

  function purchaseBook(book: Book) {
    alert(`"${book.title}" kitabı ${book.price} AZN-ə satın alındı! (Demo)`);
  }

  return (
    <div className={`p-3 pb-24 min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="mb-6 text-center">
        <h1 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>Mağaza</h1>
        <p className={`text-sm transition-colors duration-200 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Sürücülük kitabları və materialları
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {books.map((book) => (
          <Card key={book.id} className={`p-3 transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-32 object-cover rounded-lg mb-3"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400';
              }}
            />
            <div className="space-y-2">
              <h3 className={`font-bold text-sm leading-tight transition-colors duration-200 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {book.title}
              </h3>
              <p className={`text-xs leading-tight transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {book.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-emerald-600">
                  {book.price} AZN
                </span>
                <Button
                  onClick={() => purchaseBook(book)}
                  size="sm"
                  className="text-xs px-3 py-1"
                >
                  Səbətə at
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Payment Methods */}
      <Card className={`mt-6 transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`font-bold mb-3 text-center transition-colors duration-200 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>Ödəniş üsulları</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className={`p-3 border rounded-lg text-center transition-colors duration-200 ${
            isDarkMode 
              ? 'border-gray-600 hover:bg-gray-700' 
              : 'border-gray-200 hover:bg-gray-50'
          }`}>
            <div className="text-2xl mb-1">💳</div>
            <div className={`text-xs transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Kart</div>
          </div>
          <div className={`p-3 border rounded-lg text-center transition-colors duration-200 ${
            isDarkMode 
              ? 'border-gray-600 hover:bg-gray-700' 
              : 'border-gray-200 hover:bg-gray-50'
          }`}>
            <div className="text-2xl mb-1">📱</div>
            <div className={`text-xs transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Mobil</div>
          </div>
          <div className={`p-3 border rounded-lg text-center transition-colors duration-200 ${
            isDarkMode 
              ? 'border-gray-600 hover:bg-gray-700' 
              : 'border-gray-200 hover:bg-gray-50'
          }`}>
            <div className="text-2xl mb-1">🏦</div>
            <div className={`text-xs transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Bank</div>
          </div>
        </div>
      </Card>

      {/* Trust Indicators */}
      <div className="mt-4 text-center">
        <div className={`flex items-center justify-center gap-4 text-xs transition-colors duration-200 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          <span className="flex items-center gap-1">
            🔒 Təhlükəsiz ödəniş
          </span>
          <span className="flex items-center gap-1">
            ⚡ Ani çatdırılma
          </span>
          <span className="flex items-center gap-1">
            🎯 7/24 dəstək
          </span>
        </div>
      </div>
    </div>
  );
}