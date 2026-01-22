import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContextValues';
import api from '../../lib/axios';
import { Flame } from 'lucide-react';
import MenuCard from '../../components/ui/MenuCard';

const TrendingItems = ({ outletId }) => {
  const { addToCart } = useCart();
  const [trendingItems, setTrendingItems] = useState([]);

  useEffect(() => {
    const fetchTrendingItems = async () => {
      if (!outletId) return;

      try {
        const res = await api.get(`/api/menu/public/trending/${outletId}`);
        if (res.data.success) {
          setTrendingItems(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching trending items:', err);
        setTrendingItems([]);
      }
    };

    fetchTrendingItems();
  }, [outletId]);

  // Don't show section if no trending items found
  if (trendingItems.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-white">Trending Now</h2>
        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">Popular</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingItems.map((item) => (
          <MenuCard
            key={item._id}
            item={item}
            onAddToCart={() => {
              addToCart(item);
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default TrendingItems;
