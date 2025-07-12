import React from 'react';
import { Shirt, Heart, Recycle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shirt className="h-8 w-8 text-emerald-400" />
              <span className="text-2xl font-bold">ReWear</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Join the sustainable fashion revolution. Exchange, redeem, and discover amazing clothing 
              while reducing textile waste and building community.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Recycle className="h-4 w-4" />
                <span>Sustainable</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>Community-Driven</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Point System</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 ReWear. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}