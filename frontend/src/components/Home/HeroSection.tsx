import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, Users, Gift } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function HeroSection() {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Swap, Share, <span className="text-emerald-600">Sustain</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join the clothing exchange revolution. Trade your unused garments for new treasures 
            while building a sustainable future for fashion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {!user ? (
              <>
                <Link
                  to="/signup"
                  className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>Start Swapping</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  to="/browse"
                  className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-50 transition-all duration-200"
                >
                  Browse Items
                </Link>
              </>
            ) : (
              <Link
                to="/browse"
                className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>Explore Closet</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainable Fashion</h3>
              <p className="text-gray-600">
                Reduce textile waste by giving clothes a second life through our exchange platform.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Connect with like-minded individuals who share your passion for sustainable living.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real Points & Rewards</h3>
              <p className="text-gray-600">
                Earn points for every approved item you contribute — and spend them on items you love.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
