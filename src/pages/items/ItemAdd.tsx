import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addItem } from '../../data/items';
import { Button } from '@/common/ui/Button';
import { Input } from '@/common/ui/Input';
import { FaPlus } from 'react-icons/fa';
import { FiTag } from 'react-icons/fi';

const ItemAdd: React.FC = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addItem(name);
      navigate('/items');
    } else {
      setError('Item name is required.');
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Add Item</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) {
                  setError('');
                }
              }}
              placeholder="Enter item name"
              icon={<FiTag />}
              label="Name"
              required
              error={error}
              labelStyle="floating"
              description="Enter the name of the item you want to add."
            />
          </div>
          <Button type="submit" className="w-full flex items-center justify-center">
            <FaPlus className="mr-2" />
            Add Item
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ItemAdd;
