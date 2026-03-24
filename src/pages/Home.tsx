import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ShieldCheck, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);

  useEffect(() => {
    fetch('/api/books?limit=4')
      .then(res => res.json())
      .then(data => setFeaturedBooks(data.slice(0, 4)))
      .catch(console.error);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Read More. <span className="text-blue-600">Spend Less.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            The smartest way to rent, buy, and sell books. Join thousands of students and readers saving up to 80% on textbooks and bestsellers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/browse" className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              Browse Books
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </Link>
            <Link to="/dashboard" className="inline-flex justify-center items-center px-8 py-4 border border-gray-300 text-lg font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Instant Access</h3>
              <p className="mt-2 text-gray-500">Rentals start immediately. Fast shipping on physical books.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Verified Sellers</h3>
              <p className="mt-2 text-gray-500">Every seller is vetted. 100% money-back guarantee.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-3 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Massive Selection</h3>
              <p className="mt-2 text-gray-500">Over 1 million titles available to rent or buy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
            <p className="text-gray-500 mt-2">The most popular books this week.</p>
          </div>
          <Link to="/browse" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book: any) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
