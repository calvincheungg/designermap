import '98.css/dist/98.css';
import './style.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { researchTodos, validateData } from './data/validate';

const problems = validateData();
if (problems.length) console.warn(`Data warnings (${problems.length}):\n  ${problems.join('\n  ')}`);
const todos = researchTodos();
if (todos.length) console.info(`Research to-do (${todos.length}):\n  ${todos.join('\n  ')}`);

const root = createRoot(document.getElementById('root')!);
root.render(<StrictMode><App /></StrictMode>);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
