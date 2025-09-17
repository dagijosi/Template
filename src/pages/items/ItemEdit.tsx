import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItem, editItem } from '../../data/items';
import { Button } from '@/common/ui/Button';
import { Input } from '@/common/ui/Input';

const ItemEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [itemName, setItemName] = useState<string>('');
  const itemId = Number(id);

  useEffect(() => {
    const item = getItem(itemId);
    if (item) {
      setItemName(item.name);
    }
  }, [itemId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim() && itemId) {
      editItem(itemId, itemName);
      navigate('/items');
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Item</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Item Name</label>
            <Input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit">Save Changes</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/items')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemEdit;
