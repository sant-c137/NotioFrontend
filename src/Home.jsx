import GetSharedNote from './GetSharedNote';
import GetNote from './GetNote';
import CreateNote from './CreateNote';
import Header from './Header';
import './Home.css';

const Home = () => {
  return (
    <>
      <div className="home-container">
        <Header />
        <GetNote />
        <GetSharedNote />
      </div>
    </>
  );
};

export default Home;
