import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addItem } from '../../data/items';
import { Button } from '@/common/ui/Button';
import { Input } from '@/common/ui/Input';
import { FaPlus, FaMagic } from 'react-icons/fa'; // Import FaMagic for AI icon
import { FiTag } from 'react-icons/fi';
import { useAIMutation } from '@/queries/useAIMutation'; // Import useAIMutation

const ItemAdd: React.FC = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { mutate: callAI, isPending: isAILoading, error: aiError } = useAIMutation();

  const handleGenerateAIName = () => {
    setError(''); // Clear any previous errors
    callAI('Suggest a single, creative name for a new item. Respond with only the name, no other text.', {
      onSuccess: (data: string) => {
        // The AI might return a full sentence, try to extract just the name
        const suggestedName = data.replace(/["'.]/g, '').trim(); // Remove quotes, periods
        setName(suggestedName);
      },
      onError: (err: Error) => {
        setError(`AI Error: ${err.message}`);
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const names = name.split(',').map((n) => n.trim()).filter((n) => n.length > 0);
      if (names.length > 0) {
        names.forEach((n) => addItem(n));
        navigate('/items');
      } else {
        setError('Item name(s) cannot be empty.');
      }
    } else {
      setError('Item name(s) is required.');
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
              placeholder="Enter item name(s) or generate with AI"
              icon={<FiTag />}
              label="Name(s)"
              required
              error={error || (aiError ? aiError.message : '')}
              labelStyle="floating"
              description="Enter the name(s) of the item(s) you want to add, separated by commas, or use AI to generate one."
            />
          </div>
          <Button
            type="button"
            onClick={handleGenerateAIName}
            className="w-full flex items-center justify-center"
            disabled={isAILoading}
            variant="outline"
          >
            {isAILoading ? 'Generating...' : <><FaMagic className="mr-2" /> Generate Name with AI</>}
          </Button>
          <Button type="submit" className="w-full flex items-center justify-center">
            <FaPlus className="mr-2" />
            Add Item(s)
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ItemAdd;
