import React, { Component } from 'react';
import './App.css';
import MasterLibros from './componentes';

class App extends Component {
  render(){
    return(
        <div className="container-fluid">
          <MasterLibros />
        </div>
    );

  }
}
export default App;
