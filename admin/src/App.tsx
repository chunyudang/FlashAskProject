import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import QuestionsList from './pages/QuestionsList';
import QuestionForm from './pages/QuestionForm';
import Categories from './pages/Categories';
import Levels from './pages/Levels';
import Users from './pages/Users';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <QuestionsList /> },
      { path: 'questions/new', element: <QuestionForm /> },
      { path: 'questions/:id/edit', element: <QuestionForm /> },
      { path: 'categories', element: <Categories /> },
      { path: 'levels', element: <Levels /> },
      { path: 'users', element: <Users /> },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
