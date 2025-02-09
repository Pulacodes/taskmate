import { Menu } from "@/types/Menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "My Tasks",
    path: "/my-tasks",
    newTab: false,
  },
  {
    id: 33,
    title: "Tasks",
    path: "/viewtask",
    newTab: false,
  },
  {
    id: 3,
    title: "Profile",
    path: "/Profile",
    newTab: false,
  },
  {
    id: 4,
    title: "Pages",
    newTab: false,
    submenu: [
      {
        id: 41,
        title: "About Page",
        path: "/AboutUs",
        newTab: false,
      },
      {
        id: 42,
        title: "Contact Page",
        path: "/contact",
        newTab: false,
      },
      {
        id: 43,
        title: "Create New Task",
        path: "/tasks",
        newTab: false,
      },
      {
        id: 44,
        title: "Available Tasks",
        path: "/viewtask",
        newTab: false,
      },
      {
        id: 45,
        title: "My Tasks",
        path: "/my-tasks",
        newTab: false,
      },
    ],
  },
];
export default menuData;
