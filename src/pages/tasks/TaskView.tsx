import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/common/ui/Button';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useTaskQuery } from '@/queries/useTasksQuery';
import { useDeleteTaskMutation } from '@/queries/useTaskMutation';

const TaskView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const taskId = Number(id);
  const navigate = useNavigate();

  const { data: task, isLoading, isError } = useTaskQuery(taskId);
  const deleteTaskMutation = useDeleteTaskMutation();

  const handleDelete = () => {
    if (task) {
      deleteTaskMutation.mutate(task.id, {
        onSuccess: () => {
          navigate('/tasks');
        },
      });
    }
  };

  if (isLoading) return <div>Loading task...</div>;
  if (isError || !task) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold mb-4">Task not found</h1>
          <Button asChild>
            <Link to="/tasks" className="flex items-center justify-center">
              <FaArrowLeft className="mr-2" />
              Back to Tasks
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">{task.name}</h1>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Due Date:</strong> {task.dueDate}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Category:</strong> {task.category}</p>
        <p><strong>Tags:</strong> {task.tags?.join(', ')}</p>
        <p><strong>Recurrence:</strong> {task.recurrence}</p>
        <div className="flex justify-center space-x-4 mt-6">
          <Button variant="destructive" onClick={handleDelete} className="flex items-center">
            <FaTrash className="mr-2" />
            Delete
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/tasks" className="flex items-center">
              <FaArrowLeft className="mr-2" />
              Back to Tasks
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskView;
