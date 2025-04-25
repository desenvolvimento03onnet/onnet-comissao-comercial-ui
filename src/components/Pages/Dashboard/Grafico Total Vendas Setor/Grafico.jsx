import React from "react";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import { loadGraficoTotalVendasSetor } from "../../../../services/loadGraficoTotalVendasSetor";
import { loadSetores } from "../../../../services/loadSetores";
import './Grafico.module.css';

const ApexChart = ({ filter }) => {
    const [dados, setDados] = useState({ labels: [], series: [] });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await loadGraficoTotalVendasSetor(sessionStorage.getItem(0));
          const setores = await loadSetores();
          const set = setores.reduce((index, item) => {
            index[item.name] = (index[item.name] || 0);
            return index;
          },{});
          
          const dadosFiltrados = filter.startDate && filter.endDate
            ? carrega.filter(item =>
                new Date(item.date) >= new Date(filter.startDate) &&
                new Date(item.date) <= new Date(filter.endDate)
              )
            : carrega;
          // Agrupar e contar ocorrências de cada contrato
          const agrupado = dadosFiltrados.reduce((index, item) => {
            index[item.sector] = (index[item.sector] || 0) + 1;
            return index;
          }, set);
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

    const dataAtual = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
    
  return (
    <div>
      <div id="chart" className="Grafico">
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
                    filename: `Relatórios_Total_Vendas_por_Setor_${sessionStorage.getItem(0)}_${dataAtual}`,
                    columnDelimiter: ";",
                    headerCategory: "Categoria",
                    headerValue: "Valor",
                  },
                  svg: {
                    filename: `Relatórios_Total_Vendas_por_Setor_${sessionStorage.getItem(0)}_${dataAtual}`,
                  },
                  png: {
                    filename: `Relatórios_Total_Vendas_por_Setor_${sessionStorage.getItem(0)}_${dataAtual}`,
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
                breakpoint: 480,
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
              text: 'Total Vendas Por Setor',
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
          }}
          series={dados.series}
          type="pie"
          width={410}
        />
      </div>
    </div>
  );
};

export default ApexChart;
