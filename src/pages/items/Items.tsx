import React from 'react';
import { Link } from 'react-router-dom';
import { getItems } from '../../data/items';
import { Button } from '@/common/ui/Button';
import { FaPlus, FaEye } from 'react-icons/fa';

const Items: React.FC = () => {
  const items = getItems();

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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50">
              <Link to={`${item.id}`} className="text-primary font-semibold hover:underline">
                {item.name}
              </Link>
              <Button variant="outline" size="sm" asChild>
                <Link to={`${item.id}`} className="flex items-center">
                  <FaEye className="mr-2" />
                  View
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Items;
