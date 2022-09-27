import  Authorize  from './components/authorize'
import './App.css';


function App() {

  window.addEventListener("beforeunload", () => sessionStorage.clear());

  return (
    <div className="App">
      <Authorize /> 
    </div>
  );
}

export default App;
