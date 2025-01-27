import React from 'react';
// import { Routes, Route } from 'react-router-dom';
import TelaInicial from './Tela Inicial/TelaInicial.jsx';
import Tabela from './Tela Inicial/Tabela.jsx';
import GraficoTotal from './Tela Inicial/GraficoTotal.jsx';
import Grafico from './Tela Inicial/Grafico.jsx';
import ImgOnNet from './assets/logoonnet.png';
import './App.css'

// function App() {
  
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" Component={''}  />
//         <Route path="/TelaInicial" Component={TelaInicial} />
//       </Routes>
//     </Router>
//   );
// }

const App = () => {
  return (
      <div className="container">
        <div className="esquerda">
          <div className="cima">
            <a href="http://177.85.0.28:4000"><img src={ImgOnNet} alt="Logo" /></a>
          </div>
          <div className="baixo">
            <div className="cimaB">
              <TelaInicial />
              <TelaInicial />
              <TelaInicial />
            </div>
            <div className="hr"></div>
            <div className="baixoB">

            </div>

          {/* <Routes>
            <Route path="/" element={<TelaInicial />} />
            <Route path="/app" element={<TelaInicial />} />
          </Routes> */}
          </div>
        </div>
        <div className="direita">
          <div className="cima">
            <div className="esquerdaC">
              <Grafico />
            </div>
            <div className="direitaC">
              <GraficoTotal />
            </div>
          </div>
          <div className="baixo">
            <Tabela />
          </div>
        </div>
      </div>
    
  )
};

export default App
