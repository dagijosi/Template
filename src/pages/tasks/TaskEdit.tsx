import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/common/ui/Button';
import { Input } from '@/common/ui/Input';
import { Textarea } from '@/common/ui/Textarea';
import { useTaskQuery } from '@/queries/useTasksQuery';
import { useUpdateTaskMutation } from '@/queries/useTaskMutation';
import { type Task } from '@/data/tasks';

const TaskEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const taskId = Number(id);
  const navigate = useNavigate();

  const { data: task, isLoading, isError } = useTaskQuery(taskId);
  const updateTaskMutation = useUpdateTaskMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [status, setStatus] = useState<Task["status"]>("pending");
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [recurrence, setRecurrence] = useState<Task["recurrence"]>("none");
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description || '');
      setDueDate(task.dueDate || '');
      setPriority(task.priority || "medium");
      setStatus(task.status || "pending");
      setCategory(task.category || '');
      setTags(task.tags?.join(', ') || '');
      setRecurrence(task.recurrence || "none");
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Task name cannot be empty.');
      return;
    }

    const updatedFields: Partial<Omit<Task, "id" | "createdAt">> = {
      name,
      description: description || undefined,
      dueDate: dueDate || undefined,
      priority,
      status,
      category: category || undefined,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
      recurrence,
    };

    updateTaskMutation.mutate({ id: taskId, updatedFields }, {
      onSuccess: () => {
        navigate('/tasks');
      },
      onError: (err) => {
        setError(`Failed to update task: ${err.message}`);
      },
    });
  };

  if (isLoading) return <div>Loading task...</div>;
  if (isError || !task) return <div>Error loading task or task not found.</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Task</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Task Name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            required
            error={error}
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <Input
            label="Priority"
            type="text"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task["priority"]) }
          />
          <Input
            label="Status"
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value as Task["status"]) }
          />
          <Input
            label="Category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Input
            label="Tags (comma-separated)"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Input
            label="Recurrence"
            type="text"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value as Task["recurrence"]) }
          />
          <div className="flex space-x-2">
            <Button type="submit">Save Changes</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/tasks')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEdit;
