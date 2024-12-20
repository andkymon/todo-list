import css from "./style.css"
import { ToDoStorage } from './ToDoStorage.js';
import { ProjectFilter } from './ProjectFilter.js';
import { ProjectSort } from './ProjectSort.js';

// Example usage
ToDoStorage.addProject("A");
ToDoStorage.addProject("B");
ToDoStorage.addProject("C");

ToDoStorage.addTask("A", "Code for 8 hours", "12-21-2024", true, true, 0);
ToDoStorage.addTask("B", "Eat yummy food", "12-20-2024", false, true, 0);
ToDoStorage.addTask("X", "Eat yummy food", "12-24-2024", true, false, 0);
ToDoStorage.addTask("Y", "Eat yummy food", "12-23-2024", false, true, 0);
ToDoStorage.addTask("Z", "Eat yummy food", "12-28-2024", true, true, 0);
ToDoStorage.addTask("C", "Sleep for 8 hours", "12-23-2024", true, false, 0);
ToDoStorage.addTask("D", "Sleep for 8 hours", "12-30-2024", true, false, 1);

ToDoStorage.addTask("E", "Code for 8 hours", "12-21-2024", true, true, 1);
ToDoStorage.addTask("F", "Sleep for 8 hours", "12-30-2024", true, false, 2);
ToDoStorage.addTask("G", "Sleep for 8 hours", "12-30-2024", true, false, 1);

console.log(ToDoStorage.projects[0]);
console.log(ProjectSort.sortByCompletion(ToDoStorage.projects[0]));
console.log(ProjectFilter.filterImportantTasks(ToDoStorage.projects[0]));






