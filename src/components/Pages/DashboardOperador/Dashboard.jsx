import React from 'react';
import { FaHome, FaChartPie, FaTable, FaChartLine } from "react-icons/fa";
import styles from './Dashboard.module.css';
import logo from '../../../assets/logoonnet.png';
import GraficoTotalOperacoes from './Grafico Total Operacoes/Grafico';
import GraficoTotalVendas from './Grafico Total Vendas/Grafico';
import GraficoTotalRenovacoes from './Grafico Total Renovações/Grafico';
import GraficoTotalOperacoesCidades from './Grafico Total Operacoes Cidades/Grafico';
import GraficoTotalOperacoesComissoes from './Grafico Total Operacoes Comissoes/Grafico';
import GraficoTotalVendasSetores from './Grafico Total Vendas Setor/Grafico';
import NavResumo from './Nav Resumo/Grafico';
import Filtro from './Filtro/Filtro';
import ImagemUser from './Imagem Cliente/Imagem';
import { loadGraficoTotalOperacoesUsuario } from '../../../services/loadGraficoTotalOperacoesUsuario';
import TabelaUsuarios from './Tabela Clientes/Tabela';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useState, useEffect } from "react";


const Dashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [filter, setFilter] = useState({ startDate: null, endDate: null });

  return (
    <div className={styles.card}>
      <div className={styles.principal}>
        <div className={styles.esquerda}>
          <div className={styles.navCima}></div>
          <div className={styles.navContent}>
            <Filtro onFilterChange={setFilter} />
          </div>
          <div className={styles.navBaixo}></div>
        </div>
        <div className={styles.direita}>
          <div className={styles.top}>
          <ImagemUser />
          </div>
          <div className={styles.baixo}>
            <Tabs className={styles.tabIndex} selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
              <TabList  className={styles.tabList}>
                <Tab className={styles.tab} tabIndex={-1}>
                    <a href="#"><FaChartPie /></a>
                </Tab>
                <Tab className={styles.tab}>
                    <a href="#"><FaChartLine /></a>
                </Tab>
                <Tab className={styles.tab}>
                  <a href="#"><FaTable /></a>
                </Tab>
              </TabList>

              {/* Painel dos Gráficos */}
              <TabPanel>
                <div className={styles.container}>
                  <NavResumo filter={filter} />
                  <GraficoTotalOperacoesComissoes filter={filter} />
                </div>
              </TabPanel>

              <TabPanel>
                <div className={styles.container}>
                  <div className={styles.cima}>
                    <GraficoTotalVendas filter={filter} />
                    <GraficoTotalRenovacoes filter={filter} />
                  </div>
                  <GraficoTotalOperacoesCidades filter={filter} />
                </div>
              </TabPanel>

              {/* Painel da Tabela */}
              <TabPanel>
                <div className={styles.container}>
                  <TabelaUsuarios filter={filter} />
                </div>
              </TabPanel>
            </Tabs>
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
