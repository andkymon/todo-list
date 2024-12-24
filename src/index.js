import css from "./style.css"
import { ToDoStorage } from './logic/ToDoStorage.js';
import { NavToggle } from './UI/NavToggle.js';
import { ProjectDialog } from './UI/AddProjectDialog.js';
import { NavBar } from './UI/NavBar.js';

//Nav Toggle
NavToggle.init();

//Add Project Dialog
ProjectDialog.init();

//NavBar
NavBar.init();

ToDoStorage.addProject("Kyle");

ToDoStorage.addProject("Hanz");
//Nav selection
ToDoStorage.addTask("A", "B", "12-01-2000", true, true, 0);

ToDoStorage.addTask("Kyle", "Hanz", "12-01-2000", true, true, 1);





    




