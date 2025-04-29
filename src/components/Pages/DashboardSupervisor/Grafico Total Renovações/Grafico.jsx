import React from "react";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import { loadGraficoTotalRenovacoesUsuario } from "../../../../services/loadGraficoTotalRenovacoesUsuario";
import styles from './Grafico.module.css';

const ApexChart = ({ filter }) => {
    const [dados, setDados] = useState({ labels: [], series: [] });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await loadGraficoTotalRenovacoesUsuario(sessionStorage.getItem(0));
          
          const dadosFiltrados = carrega.filter(item => {
            const dataValida = new Date(item.date) >= new Date(filter.startDate) && new Date(item.date) <= new Date(filter.endDate);
            const operadorValido = filter.operator.length === 0 || filter.operator.includes(item.user);
            const operacaoValida = filter.operation.length === 0 || filter.operation.includes(item.comission);
            return dataValida && operadorValido && operacaoValida;
              });

          // Agrupar e contar ocorrências de cada contrato
          const agrupado = dadosFiltrados.reduce((index, item) => {
            index[item.operation] = (index[item.operation] || 0) + 1;
            return index;
          }, {'Renovação':0,'Downgrade':0,'Upgrade':0});
          // Criar os arrays de labels e valores
          const labels = Object.keys(agrupado);
          const series = Object.values(agrupado);

          setDados({ labels, series });
        } catch (error) {
          console.error("Erro ao carregar dados: ", error);
        }
      };
      fetchData();
    }, [filter]);
    
    const dataAtual = new Date().toLocaleDateString();

  return (
    <div>
      <div id="chart" className={styles.Grafico}>
        <ReactApexChart
          options={{
            chart: {
              type: "pie", // Tipo de gráfico
              toolbar: {
                show: true, // Mostra a barra de ferramentas
                tools: {
                  download: true, // Habilita o botão de download
                },
                export: {
                  csv: {
                    filename: `Relatórios_Total_Renovações_${sessionStorage.getItem(0)}_${dataAtual}`,
                    columnDelimiter: ",",
                    headerCategory: "Categoria",
                    headerValue: "Valor",
                  },
                  svg: {
                    enabled: false,
                  },
                  png: {
                    filename: `Relatórios_Total_Renovações_${sessionStorage.getItem(0)}_${dataAtual}`,
                  },
                },
              },
            },
            // dataLabels: {
            //   enabled: true,
            //   formatter: function (val, opts) {
            //     // Retorna o valor real ao invés de porcentagem
            //     return opts.w.config.series[opts.seriesIndex];
            //   },
            // },
            colors: ['#2E93fA', '#FF4560', '#66DA26'],
            labels: dados.labels,
            legend: {
              position: "bottom",
            },
            responsive: [
              {
                breakpoint: 400,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            title: {
              text: 'Total Renovações',
              align: 'center',
              margin: 10,
              offsetX: 0,
              offsetY: 0,
              floating: false,
              style: {
                fontSize:  '24px',
                fontWeight:  'bold',
                fontFamily:  undefined,
                color:  '#263238'
              },
            },
            tooltip: {
              shared: true,
              hideEmptySeries: true,
            },
          }}
          series={dados.series}
          type="pie"
          width={500}
        />
      </div>
    </div>
  );
};

export default ApexChart;
