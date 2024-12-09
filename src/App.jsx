import Login from './auth/Login';
import Register from './auth/Register';
import Layout from './Layout';
import './App.css';

function App() {
  return (
    <>
      <div className="container">
        <Login />
        <Register />
      </div>

      <Layout />
    </>
  );
}

export default App;
