export interface Command {
  name: string;
  description: string;
  template: string; // This will now be a user-friendly string
}

export const commands: Command[] = [
  {
    name: 'navigate',
    description: 'Navigate to a different page. Usage: /navigate <path>',
    template: '/navigate ',
  },
  {
    name: 'getItems',
    description: 'List all items. Usage: /getItems',
    template: '/getItems',
  },
  {
    name: 'addItem',
    description: 'Add a new item. Usage: /addItem <name>',
    template: '/addItem ',
  },
  {
    name: 'addItems',
    description: 'Add multiple new items. Usage: /addItems <name1>, <name2>, ...',
    template: '/addItems ',
  },
  {
    name: 'editItem',
    description: 'Edit an existing item. Usage: /editItem <id> <name>',
    template: '/editItem ',
  },
  {
    name: 'editItems',
    description: 'Edit multiple items. Usage: /editItems <id1>:<name1>, <id2>:<name2>, ...',
    template: '/editItems ',
  },
  {
    name: 'deleteItem',
    description: 'Delete an item by its ID. Usage: /deleteItem <id>',
    template: '/deleteItem ',
  },
  {
    name: 'deleteItems',
    description: 'Delete multiple items by their IDs. Usage: /deleteItems <id1>, <id2>, ...',
    template: '/deleteItems ',
  },
  {
    name: 'getTasks',
    description: 'List all tasks. Usage: /getTasks',
    template: '/getTasks',
  },
  {
    name: 'getTaskById',
    description: 'Get a task by its ID. Usage: /getTaskById <id>',
    template: '/getTaskById ',
  },
  {
    name: 'addTask',
    description: 'Add a new task. Usage: /addTask <JSON_task_object>',
    template: '/addTask ',
  },
  {
    name: 'addTasks',
    description: 'Add multiple new tasks. Usage: /addTasks <JSON_tasks_array>',
    template: '/addTasks ',
  },
  {
    name: 'editTask',
    description: 'Edit an existing task. Usage: /editTask <id> <JSON_updated_fields>',
    template: '/editTask ',
  },
  {
    name: 'editTasks',
    description: 'Edit multiple tasks. Usage: /editTasks <JSON_tasks_to_edit_array>',
    template: '/editTasks ',
  },
  {
    name: 'deleteTask',
    description: 'Delete a task by its ID. Usage: /deleteTask <id>',
    template: '/deleteTask ',
  },
  {
    name: 'deleteTasks',
    description: 'Delete multiple tasks by their IDs. Usage: /deleteTasks <id1>, <id2>, ...',
    template: '/deleteTasks ',
  },
];
  