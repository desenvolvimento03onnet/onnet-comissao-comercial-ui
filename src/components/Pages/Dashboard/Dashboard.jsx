import React from 'react';
import { FaHome, FaTable } from "react-icons/fa";
import styles from './Dashboard.module.css';
import logo from '../../../assets/logoonnet.png';
import GraficoTotalOperacoes from './Grafico Total Operacoes/Grafico'
import GraficoTotalVendas from './Grafico Total Vendas/Grafico'
import GraficoTotalRenovacoes from './Grafico Total Renovações/Grafico'
import GraficoTotalOperacoesCidades from './Grafico Total Operacoes Cidades/Grafico'
import GraficoTotalOperacoesComissoes from './Grafico Total Operacoes Comissoes/Grafico'
import Filtro from './Filtro/Filtro'
import ImagemUser from './Imagem Cliente/Imagem'
import { loadGraficoTotalOperacoesUsuario } from '../../../services/loadGraficoTotalOperacoesUsuario'
import AutoLogout from '../../../services/returnLogin'
import TabelaUsuarios from './Tabela Clientes/Tabela'
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useState, useEffect } from "react";


const Dashboard = () => {
  AutoLogout();
  const [tabIndex, setTabIndex] = useState(0);
  const [dados, setDados] = useState({ labels: [], series: [] });
  const [filter, setFilter] = useState({ startDate: null, endDate: null });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await loadGraficoTotalOperacoesUsuario(sessionStorage.getItem(0));
          // Agrupar e contar ocorrências de cada contrato
          const agrupado = carrega.reduce((index, item) => {
            index[item.operation] = (index[item.operation] || 0) + 1;
            return index;
          }, {'Venda':0, 'Renovação':0, 'Upgrade':0, 'Downgrade':0});
          // Criar os arrays de labels e valores
          const labels = Object.keys(agrupado);
          const series = Object.values(agrupado);
          setDados({ labels, series });
        } catch (error) {
          console.error("Erro ao carregar dados: ", error);
        }
      };
      fetchData();
    }, []);


  return (
    <div className={styles.card}>
      <div className={styles.principal}>
        <div className={styles.esquerda}>
          <div className={styles.navCima}></div>
          <div className={styles.navContent}>
            <p className={styles.links}><FaHome className={styles.icone} /> Início</p>
            {/* <p className={styles.links}><FaTable className={styles.icone} /> Tabela</p> */}
          </div>
          <div className={styles.navBaixo}></div>
        </div>
        <div className={styles.direita}>
          <div className={styles.top}>
          <ImagemUser />
          </div>
          <Tabs className={styles.tabIndex} selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
            <TabList  className={styles.tabList}>
              <Tab className={styles.tab}>
                  <a href="#">Comissões</a>
              </Tab>
              <Tab className={styles.tab}>
                  <a href="#">Resumo</a>
              </Tab>
              <Tab className={styles.tab}>
                <a href="#">Tabela</a>
              </Tab>
              <Filtro onFilterChange={setFilter} />
            </TabList>

            {/* Painel dos Gráficos */}
            <TabPanel>
              <div className={styles.container}>
                <div className={styles.aba2}>
                  <div className={styles.cima}>
                    <GraficoTotalOperacoesComissoes filter={filter} />
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className={styles.container}>
                <div className={styles.cima}>
                  {/* <div className={styles.valores}>
                  {dados.labels.map((operacao, index) => {
                    return (
                      <p key={index}>
                        {operacao + ": " + dados.series[index]}
                      </p>
                    );
                  })}
                  </div> */}
                  <GraficoTotalVendas filter={filter} />
                  <GraficoTotalRenovacoes filter={filter} />
                </div>
                <div className={styles.baixo}>
                  <GraficoTotalOperacoesCidades filter={filter} />
                </div>
              </div>
            </TabPanel>

             {/* Painel da Tabela */}
             <TabPanel>
              <div className={styles.container}>
                <div className={styles.aba2}>
                  <div className={styles.cima}>
                    <TabelaUsuarios filter={filter} />
                  </div>
                  {/* <div className={styles.bottom}>
                    <Load />
                  </div> */}
                </div>
              </div>
            </TabPanel>
          </Tabs>
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
