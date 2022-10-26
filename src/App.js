import './App.css'
import { Waterfall } from './components/Waterfall/index.jsx';

function App() {
  return (
    <div id="container">
      <Waterfall column={3} imgWidth={150} gapX={10} gapY={10} type={0}/>
    </div>
  );
}

export default App;
