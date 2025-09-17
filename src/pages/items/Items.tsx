import React from 'react';
import { Link } from 'react-router-dom';
import { getItems, deleteItem } from '../../data/items';
import type { Item } from '../../data/items';
import { Button } from '@/common/ui/Button';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    setItems(getItems());
  }, []);

  const handleDelete = (id: number) => {
    deleteItem(id);
    setItems(getItems()); // Re-fetch items after deletion
  };

  const getMostCommonItemName = () => {
    if (items.length === 0) return "N/A";
    const nameCounts: { [key: string]: number } = {};
    items.forEach(item => {
      nameCounts[item.name] = (nameCounts[item.name] || 0) + 1;
    });

    let mostCommonName = "";
    let maxCount = 0;
    for (const name in nameCounts) {
      if (nameCounts[name] > maxCount) {
        maxCount = nameCounts[name];
        mostCommonName = name;
      }
    }
    return mostCommonName;
  };

  const mostCommonItem = getMostCommonItemName();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Items</h1>
        <Button asChild>
          <Link to="add" className="flex items-center">
            <FaPlus className="mr-2" />
            Add Item
          </Link>
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Item Analysis</h2>
        <p>Total number of items: {items.length}</p>
        <p>Most common item name: {mostCommonItem}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50">
              <Link to={`${item.id}`} className="text-primary font-semibold hover:underline">
                {item.name}
              </Link>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`${item.id}/edit`} className="flex items-center">
                    <FaEdit className="mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                  <FaTrash className="mr-2" />
                  Delete
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`${item.id}`} className="flex items-center">
                    <FaEye className="mr-2" />
                    View
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Items;
