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
];