import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Clock } from 'lucide-react';

export default function BookCard({ book }: { book: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <Link to={`/book/${book.id}`} className="block relative aspect-[2/3] overflow-hidden bg-gray-100">
        <img 
          src={book.image_url || `https://picsum.photos/seed/${book.id}/400/600`} 
          alt={book.title} 
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        {book.stock < 3 && book.stock > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Only {book.stock} left!
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">{book.category}</div>
        <Link to={`/book/${book.id}`} className="block">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 hover:text-blue-600">{book.title}</h3>
        </Link>
        <p className="text-sm text-gray-500 mb-2">{book.author}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">(12)</span>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-end">
          <div>
            <div className="text-xs text-gray-500 mb-0.5">Rent from</div>
            <div className="text-lg font-bold text-gray-900">${book.price_rent.toFixed(2)}<span className="text-xs font-normal text-gray-500">/mo</span></div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-0.5">Buy for</div>
            <div className="text-lg font-bold text-blue-600">${book.price_sell.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
