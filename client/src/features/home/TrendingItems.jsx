import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContextValues';
import api from '../../lib/axios';
import { Flame } from 'lucide-react';
import MenuCard from '../../components/ui/MenuCard';

const TrendingItems = ({ outletId, searchQuery = '', categoryFilter = 'all', dietFilter = 'all' }) => {
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

  // Filter trending items based on search and filters
  const filteredTrendingItems = trendingItems.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesDiet = dietFilter === 'all' || (dietFilter === 'veg' ? item.isVeg === true : item.isVeg === false);
    return matchesSearch && matchesCategory && matchesDiet;
  });

  // Don't show section if no trending items found after filtering
  if (filteredTrendingItems.length === 0) {
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
        {filteredTrendingItems.map((item) => (
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
