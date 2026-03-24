import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rentDuration, setRentDuration] = useState('30');

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setBook(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Book not found');
        navigate('/browse');
      });
  }, [id, navigate]);

  const handleAddToCart = (type: 'buy' | 'rent') => {
    // Simple cart implementation using localStorage for MVP
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const item = {
      book_id: book.id,
      title: book.title,
      image_url: book.image_url,
      type,
      quantity: 1,
      price: type === 'buy' ? book.price_sell : book.price_rent * (parseInt(rentDuration) / 30),
      rental_duration: type === 'rent' ? parseInt(rentDuration) : null
    };

    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    toast.success(`Added to cart for ${type === 'buy' ? 'purchase' : 'rental'}`);
    navigate('/cart');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!book) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-[2/3] bg-gray-100 rounded-xl overflow-hidden relative">
              <img 
                src={book.image_url || `https://picsum.photos/seed/${book.id}/800/1200`} 
                alt={book.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {book.stock < 3 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Only {book.stock} left in stock!
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-2">{book.category}</div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600">{book.author}</p>
              
              <div className="flex items-center mt-4 gap-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">4.8 (124 reviews)</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">Condition: <span className="font-semibold text-gray-900 capitalize">{book.condition.replace('_', ' ')}</span></span>
              </div>
            </div>

            <div className="prose prose-blue text-gray-600 mb-8">
              <p>{book.description || 'No description available.'}</p>
            </div>

            {/* Pricing & Actions */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mt-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Rent Option */}
                <div className="flex flex-col">
                  <div className="text-sm text-gray-500 font-medium mb-1">Rent this book</div>
                  <div className="text-3xl font-bold text-gray-900 mb-4">
                    ${book.price_rent.toFixed(2)}<span className="text-base font-normal text-gray-500">/mo</span>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <select 
                      value={rentDuration}
                      onChange={(e) => setRentDuration(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="30">1 Month</option>
                      <option value="90">3 Months (Semester)</option>
                      <option value="180">6 Months</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => handleAddToCart('rent')}
                    className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2"
                  >
                    <Clock className="w-5 h-5" />
                    Rent Now
                  </button>
                </div>

                {/* Buy Option */}
                <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-gray-200 pt-6 sm:pt-0 sm:pl-6">
                  <div className="text-sm text-gray-500 font-medium mb-1">Buy this book</div>
                  <div className="text-3xl font-bold text-gray-900 mb-4">
                    ${book.price_sell.toFixed(2)}
                  </div>
                  
                  <div className="mb-4 text-sm text-gray-600 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <span>100% Money Back Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-500" />
                      <span>Ships within 24 hours</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAddToCart('buy')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-auto shadow-md hover:shadow-lg"
                  >
                    Buy Now
                  </button>
                </div>

              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <ShieldCheck className="w-4 h-4" />
              Secure transaction by BookMarket. Sold by <span className="font-semibold text-gray-900">{book.seller_name}</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
