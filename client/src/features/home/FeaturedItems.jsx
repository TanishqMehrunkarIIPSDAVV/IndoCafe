import React, { useEffect, useState } from 'react';
import MenuCard from '../../components/ui/MenuCard';
import api from '../../lib/axios';

const FeaturedItems = ({ outletId, showAll = false }) => {
  const [items, setItems] = useState([]);

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

  if (!outletId) return null;

  // Display limited items (8) or all items based on showAll prop
  const displayItems = showAll ? items : items.slice(0, 8);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayItems.map((item) => (
        <MenuCard key={item._id} item={item} />
      ))}
      {displayItems.length === 0 && (
        <div className="col-span-full text-center text-zinc-400 py-8">No items available at this outlet yet.</div>
      )}
    </div>
  );
};

export default FeaturedItems;
