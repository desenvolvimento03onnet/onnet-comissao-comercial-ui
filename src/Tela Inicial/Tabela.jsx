import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './Tabela.css';

const Tabela = () => {
  return (
    <div className='Tabela'>
      <table>
        <tr>
          <th>Data</th>
          <th>Cliente</th>
          <th>Operação</th>
          <th>Valor</th>
        </tr>
        <tr>
          <td>Teste</td>
          <td>Teste</td>
          <td>Teste</td>
          <td>Teste</td>
        </tr>
        <tr>
          <td>Teste</td>
          <td>Teste</td>
          <td>Teste</td>
          <td>Teste</td>
        </tr>
        <tr>
          <td>Teste</td>
          <td>Teste</td>
          <td>Teste</td>
          <td>Teste</td>
        </tr>
      </table>
    </div>
  );
};

export default Tabela;