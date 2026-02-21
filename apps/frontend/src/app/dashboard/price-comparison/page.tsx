'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, TrendingDown, Award, AlertCircle, CheckCircle, MapPin, Plus, Edit, Save, X } from 'lucide-react';

interface PriceEntry {
  store: string;
  price: number;
  distance: string;
}

interface Product {
  name: string;
  category: string;
  prices: PriceEntry[];
}

export default function PriceComparison() {
  const [selectedCategory, setSelectedCategory] = useState('groceries');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<{productName: string; storeName: string} | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [products, setProducts] = useState<Record<string, Product[]>>({
    groceries: [
      {
        name: 'Rice (1kg)',
        category: 'Staples',
        prices: [
          { store: 'D-Mart', price: 45, distance: '1.2 km' },
          { store: 'Big Bazaar', price: 52, distance: '2.5 km' },
          { store: 'Local Kirana', price: 48, distance: '0.3 km' },
          { store: 'Reliance Fresh', price: 50, distance: '1.8 km' },
        ]
      },
      {
        name: 'Milk (1L)',
        category: 'Dairy',
        prices: [
          { store: 'Amul Parlour', price: 62, distance: '0.5 km' },
          { store: 'Mother Dairy', price: 60, distance: '0.8 km' },
          { store: 'Local Vendor', price: 58, distance: '0.2 km' },
        ]
      },
      {
        name: 'Onions (1kg)',
        category: 'Vegetables',
        prices: [
          { store: 'Vegetable Market', price: 35, distance: '1.0 km' },
          { store: 'D-Mart', price: 42, distance: '1.2 km' },
          { store: 'Roadside Vendor', price: 30, distance: '0.4 km' },
        ]
      },
    ],
    transport: [
      {
        name: 'Office Commute (10km)',
        category: 'Daily',
        prices: [
          { store: 'Metro', price: 30, distance: '0.5 km walk' },
          { store: 'Auto', price: 120, distance: 'Door to door' },
          { store: 'Bus', price: 15, distance: '0.3 km walk' },
          { store: 'Shared Auto', price: 25, distance: 'Main road' },
        ]
      },
    ],
    utilities: [
      {
        name: 'Mobile Recharge (2GB/day)',
        category: 'Telecom',
        prices: [
          { store: 'Jio', price: 239, distance: 'Online' },
          { store: 'Airtel', price: 265, distance: 'Online' },
          { store: 'Vi', price: 249, distance: 'Online' },
        ]
      },
    ],
  });

  const categories = [
    { id: 'groceries', label: 'Groceries', icon: '🛒' },
    { id: 'transport', label: 'Transport', icon: '🚗' },
    { id: 'utilities', label: 'Utilities', icon: '💡' },
  ];

  const currentProducts = products[selectedCategory] || [];

  const calculateMonthlySavings = () => {
    let savings = 0;
    currentProducts.forEach(product => {
      const cheapest = Math.min(...product.prices.map(p => p.price));
      const expensive = Math.max(...product.prices.map(p => p.price));
      const diff = expensive - cheapest;
      const frequency = selectedCategory === 'groceries' ? 4 :
                       selectedCategory === 'transport' ? 20 :
                       1;
      savings += diff * frequency;
    });
    return savings;
  };

  const monthlySavings = calculateMonthlySavings();

  const toggleProductExpand = (productName: string) => {
    setExpandedProduct(expandedProduct === productName ? null : productName);
  };

  const startEditing = (productName: string, storeName: string, currentPrice: number) => {
    setEditingPrice({ productName, storeName });
    setEditValue(currentPrice.toString());
  };

  const savePrice = () => {
    if (!editingPrice) return;
    
    const newPrice = parseFloat(editValue);
    if (isNaN(newPrice) || newPrice <= 0) {
      alert('Please enter a valid price');
      return;
    }

    setProducts(prevProducts => {
      const updated = { ...prevProducts };
      const categoryProducts = updated[selectedCategory];
      const productIndex = categoryProducts.findIndex(p => p.name === editingPrice.productName);
      
      if (productIndex !== -1) {
        const priceIndex = categoryProducts[productIndex].prices.findIndex(
          p => p.store === editingPrice.storeName
        );
        
        if (priceIndex !== -1) {
          categoryProducts[productIndex].prices[priceIndex].price = newPrice;
        }
      }
      
      return updated;
    });

    setEditingPrice(null);
    setEditValue('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const cancelEditing = () => {
    setEditingPrice(null);
    setEditValue('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold">✓ Price updated successfully!</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-blue-600" />Smart Price Comparison
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Find the cheapest prices for everyday items in your area</p>
      </div>

      {/* Savings Summary */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm opacity-90 mb-1">Potential Monthly Savings</p>
            <p className="text-4xl font-black">{formatCurrency(monthlySavings)}</p>
            <p className="text-xs opacity-80 mt-1">By choosing cheapest options</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Annual Savings</p>
            <p className="text-4xl font-black">{formatCurrency(monthlySavings * 12)}</p>
            <p className="text-xs opacity-80 mt-1">Over one year</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white/10 rounded-xl">
          <p className="text-sm">
            💡 <strong>Tip:</strong> Click "Edit Price" to update with your local prices. Your data is saved in your browser.
          </p>
        </div>
      </div>

      {/* Category Selector */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setExpandedProduct(null);
              setEditingPrice(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-400'
            }`}>
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Price Comparisons */}
      <div className="space-y-4">
        {currentProducts.map((product, i) => {
          const cheapest = Math.min(...product.prices.map(p => p.price));
          const mostExpensive = Math.max(...product.prices.map(p => p.price));
          const savings = mostExpensive - cheapest;
          const savingsPercent = ((savings / mostExpensive) * 100).toFixed(0);
          const isExpanded = expandedProduct === product.name;

          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div 
                className="flex justify-between items-start mb-4 cursor-pointer"
                onClick={() => toggleProductExpand(product.name)}>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    {product.name}
                    {!isExpanded && <span className="text-sm text-blue-600">▼ Click to expand</span>}
                    {isExpanded && <span className="text-sm text-blue-600">▲ Click to collapse</span>}
                  </h3>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Save up to</p>
                  <p className="text-2xl font-black text-green-600">{formatCurrency(savings)}</p>
                  <p className="text-xs text-green-600 font-bold">{savingsPercent}% cheaper!</p>
                </div>
              </div>

              <div className={`space-y-2 ${!isExpanded ? 'hidden' : ''}`}>
                {product.prices
                  .sort((a, b) => a.price - b.price)
                  .map((price, j) => {
                    const isCheapest = price.price === cheapest;
                    const diff = price.price - cheapest;
                    const isEditing = editingPrice?.productName === product.name && editingPrice?.storeName === price.store;
                    
                    return (
                      <div key={j} className={`p-4 rounded-xl border-2 transition-all ${
                        isCheapest 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-gray-200 hover:border-blue-200'
                      }`}>
                        {isEditing ? (
                          // Edit Mode
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <p className="font-bold text-gray-900">{price.store}</p>
                              <span className="text-xs text-gray-500">({price.distance})</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-600">₹</span>
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1 px-4 py-2 border-2 border-blue-400 rounded-lg text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={cancelEditing}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors">
                                <X className="w-4 h-4" />
                                Cancel
                              </button>
                              <button
                                onClick={savePrice}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                                <Save className="w-4 h-4" />
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {isCheapest && <Award className="w-5 h-5 text-green-600" />}
                                <div>
                                  <p className="font-bold text-gray-900">{price.store}</p>
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <MapPin className="w-3 h-3" />
                                    {price.distance}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className={`text-2xl font-black ${isCheapest ? 'text-green-600' : 'text-gray-900'}`}>
                                  {formatCurrency(price.price)}
                                </p>
                                {!isCheapest && diff > 0 && (
                                  <p className="text-xs text-red-600 font-semibold">
                                    +{formatCurrency(diff)} more
                                  </p>
                                )}
                                {isCheapest && (
                                  <p className="text-xs text-green-600 font-bold">✓ BEST PRICE</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <button 
                                onClick={() => startEditing(product.name, price.store, price.price)}
                                className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:underline">
                                <Edit className="w-4 h-4" />
                                Edit Price
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
              </div>

              {!isExpanded && (
                <div className="flex items-center justify-center py-2">
                  <p className="text-sm text-gray-500">
                    {product.prices.length} stores compared • Cheapest: {product.prices.find(p => p.price === cheapest)?.store}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />💡 Smart Shopping Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• <strong>Update prices regularly:</strong> Click "Edit Price" to add your local store prices</li>
          <li>• <strong>Buy in bulk:</strong> Rice, dal, oil - 10kg/5L packs = 15-20% cheaper</li>
          <li>• <strong>Timing matters:</strong> Evening discounts at supermarkets (8-9 PM)</li>
          <li>• <strong>Compare transport:</strong> Metro/bus vs auto = ₹2,000+/month savings</li>
        </ul>
      </div>
    </div>
  );
}