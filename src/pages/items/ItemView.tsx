import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getItem, deleteItem } from '../../data/items';
import { Button } from '@/common/ui/Button';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';

const ItemView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const item = getItem(Number(id));

  const handleDelete = () => {
    if (item) {
      deleteItem(item.id);
      navigate('/items');
    }
  };

  if (!item) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold mb-4">Item not found</h1>
          <Button asChild>
            <Link to="/items" className="flex items-center justify-center">
              <FaArrowLeft className="mr-2" />
              Back to Items
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">{item.name}</h1>
        <div className="flex justify-center space-x-4">
          <Button variant="destructive" onClick={handleDelete} className="flex items-center">
            <FaTrash className="mr-2" />
            Delete
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/items" className="flex items-center">
              <FaArrowLeft className="mr-2" />
              Back to Items
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemView;
