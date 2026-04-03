import { ShoppingList } from '../types';

// Export to CSV
export function exportToCSV(list: ShoppingList): void {
  const headers = ['Item', 'Category', 'Quantity', 'Unit', 'Price', 'Completed'];
  const rows = list.items.map(item => [
    item.name,
    item.category,
    item.quantity,
    item.unit,
    item.price || '',
    item.isCompleted ? 'Yes' : 'No',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `grocery-list-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export to JSON
export function exportToJSON(list: ShoppingList): void {
  const data = JSON.stringify(list, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `grocery-list-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export to Text
export function exportToText(list: ShoppingList): void {
  let text = `Shopping List: ${list.name}\n`;
  text += `Date: ${new Date().toLocaleDateString()}\n`;
  text += '='.repeat(50) + '\n\n';

  const grouped = list.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof list.items>);

  Object.entries(grouped).forEach(([category, items]) => {
    text += `${category}\n`;
    text += '-'.repeat(30) + '\n';
    items.forEach(item => {
      const price = item.price ? ` ($${item.price})` : '';
      const completed = item.isCompleted ? '[✓] ' : '[ ] ';
      text += `${completed}${item.name} - ${item.quantity} ${item.unit}${price}\n`;
    });
    text += '\n';
  });

  if (list.totalCost > 0) {
    text += '='.repeat(50) + '\n';
    text += `Total Cost: $${list.totalCost.toFixed(2)}\n`;
  }

  if (list.budget) {
    text += `Budget: $${list.budget.toFixed(2)}\n`;
    text += `Remaining: $${(list.budget - list.totalCost).toFixed(2)}\n`;
  }

  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `grocery-list-${new Date().toISOString().split('T')[0]}.txt`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate shareable link (for future backend integration)
export function generateShareLink(list: ShoppingList): string {
  const encoded = btoa(JSON.stringify(list));
  return `${window.location.origin}?shared=${encoded}`;
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    console.error('Failed to copy to clipboard');
    return false;
  }
}
