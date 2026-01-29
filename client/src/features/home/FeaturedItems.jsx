import React, { useEffect, useMemo, useState } from 'react';
import MenuCard from '../../components/ui/MenuCard';
import api from '../../lib/axios';

const FeaturedItems = ({ outletId, showAll = false, searchQuery = '', categoryFilter = 'all', dietFilter = 'all' }) => {
  const [items, setItems] = useState([]);
  const [tag] = useState('all');

  // Use external filters if provided
  const activeSearch = searchQuery;
  const activeCategory = categoryFilter;
  const activeDiet = dietFilter;

  useEffect(() => {
    const fetchMenu = async () => {
      if (!outletId) return;

      try {
        const res = await api.get(`/api/menu/public/${outletId}`);

        if (res.data.success) {
          const allItems = res.data.data;

          // Filter to show only available items
          const availableItems = allItems.filter((item) => item.isAvailable !== false);

          setItems(availableItems);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    fetchMenu();
  }, [outletId]);

  const filteredItems = useMemo(() => {
    if (!outletId) return [];
    const term = activeSearch.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesDiet = activeDiet === 'all' || (activeDiet === 'veg' ? item.isVeg === true : item.isVeg === false);
      const matchesTag = tag === 'all' || (Array.isArray(item.tags) && item.tags.includes(tag));
      const matchesSearch =
        !term || item.name.toLowerCase().includes(term) || (item.description || '').toLowerCase().includes(term);
      return matchesCategory && matchesDiet && matchesTag && matchesSearch;
    });
  }, [items, activeSearch, activeCategory, activeDiet, tag, outletId]);

  const displayItems = showAll ? filteredItems : filteredItems.slice(0, 8);

  if (!outletId) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayItems.map((item) => (
          <MenuCard key={item._id} item={item} />
        ))}
        {displayItems.length === 0 && (
          <div className="col-span-full text-center text-zinc-400 py-8">No items match your filters yet.</div>
        )}
      </div>
    </div>
  );
};

export default FeaturedItems;
