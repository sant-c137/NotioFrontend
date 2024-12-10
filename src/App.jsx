import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import './App.css';

const Login = React.lazy(() => import('./auth/Login'));
const NotFoundPage = React.lazy(() => import('./NotFoundPage'));
const Loading = React.lazy(() => import('./Loading'));
const Register = React.lazy(() => import('./auth/Register'));
const Logout = React.lazy(() => import('./auth/Logout'));
const GetNote = React.lazy(() => import('./GetNote'));
const CreateNote = React.lazy(() => import('./CreateNote'));
const GetSharedNote = React.lazy(() => import('./GetSharedNote'));
const ProtectedRoute = React.lazy(() => import('./auth/ProtectedRoute'));

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Suspense fallback={<Loading />}>
          <Login />
          <Register />
        </Suspense>
      ),
      errorElement: <NotFoundPage />,
    },

    {
      path: '/',
      element: (
        <Suspense fallback={<Loading />}>
          <ProtectedRoute />
        </Suspense>
      ),
      errorElement: <NotFoundPage />,
      children: [
        {
          path: '/notes',
          element: (
            <Suspense fallback={<Loading />}>
              <GetNote />
              <CreateNote />
              <Logout />

              <GetSharedNote />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: '*',
      element: (
        <Suspense fallback={<Loading />}>
          <NotFoundPage />
        </Suspense>
      ),
    },
  ]);

  return router;
}

export default App;
