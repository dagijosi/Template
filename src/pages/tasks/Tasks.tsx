import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/common/ui/Button';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useTasksQuery } from '@/queries/useTasksQuery';
import { useDeleteTaskMutation } from '@/queries/useTaskMutation';
import {type Task } from '@/data/tasks';

const Tasks: React.FC = () => {
  const { data: tasks, isLoading, isError } = useTasksQuery();
  const deleteTaskMutation = useDeleteTaskMutation();

  const handleDelete = (id: number) => {
    deleteTaskMutation.mutate(id);
  };

  if (isLoading) return <div>Loading tasks...</div>;
  if (isError) return <div>Error loading tasks.</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button asChild>
          <Link to="add" className="flex items-center">
            <FaPlus className="mr-2" />
            Add Task
          </Link>
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ul className="space-y-4">
          {tasks?.map((task: Task) => (
            <li key={task.id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50">
              <Link to={`${task.id}`} className="text-primary font-semibold hover:underline">
                {task.name}
              </Link>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`${task.id}/edit`} className="flex items-center">
                    <FaEdit className="mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(task.id)}>
                  <FaTrash className="mr-2" />
                  Delete
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`${task.id}`} className="flex items-center">
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

export default Tasks;
