import React from 'react';
import styles from './Dashboard.module.css';
import logo from '../../../assets/logoonnet.png';
import GraficoTotalOperacoes from './Grafico Total Operacoes/Grafico'
import GraficoTotalVendas from './Grafico Total Vendas/Grafico'
import GraficoTotalRenovacoes from './Grafico Total Renovações/Grafico'
import GraficoTotalOperacoesCidades from './Grafico Total Operacoes Cidades/Grafico'
import ImagemUser from './Imagem Cliente/Imagem'
import AutoLogout from '../../../services/returnLogin'
import TabelaUsuarios from './Tabela Clientes/Tabela'


const Dashboard = () => {
  AutoLogout();

  return (
    <div className={styles.card}>
      <div className={styles.principal}>
        <div className={styles.esquerda}>

        </div>
        <div className={styles.direita}>
          <div className={styles.top}>
          <ImagemUser />
          </div>
          <div className={styles.container}>
            <div className={styles.cima}>
              {/* <GraficoTotalOperacoes /> */}
                <GraficoTotalVendas />
                <GraficoTotalRenovacoes />
            </div>
            <div className={styles.baixo}>
              <GraficoTotalOperacoesCidades />
            </div>
            {/* <button type="submit" className={styles.button} onClick={retorna}>Voltar</button> */}
          </div>
          <div className={styles.bottom}>
            <TabelaUsuarios />
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.empresa}>
          <img src={logo} alt="Logo" />
        </div>
        <div className={styles.direitos}>
          <span>Copyright &#169; 2025 OnNet Telecom &#174;</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
