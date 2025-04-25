import React from "react";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import { loadGraficoTotalOperacoesUsuarios } from "../../../../services/loadGraficoTotalOperacoesUsuarios";
import './Grafico.module.css';

const ApexChart = ({ filter }) => {
    const [dados, setDados] = useState({ labels: [], series: [] });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await loadGraficoTotalOperacoesUsuarios(sessionStorage.getItem(0));
          
          const dadosFiltrados = filter.startDate && filter.endDate
            ? carrega.filter(item =>
                new Date(item.date) >= new Date(filter.startDate) &&
                new Date(item.date) <= new Date(filter.endDate)
              )
            : carrega;
          // Agrupar e contar ocorrências de cada contrato
          const agrupado = dadosFiltrados.reduce((index, item) => {
            index[item.user] = (index[item.user] || 0) + 1;
            return index;
          }, {});
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
              type: "bar", // Tipo de gráfico
              height: 350,
              dropShadow: {
                enabled: true,
              },
              toolbar: {
                show: true, // Mostra a barra de ferramentas
                tools: {
                  download: true, // Habilita o botão de download
                },
                export: {
                  csv: {
                    filename: `Relatórios_Total_Operações_Usuários_${sessionStorage.getItem(0)}_${dataAtual}`,
                    columnDelimiter: ";",
                    headerCategory: "Categoria",
                    headerValue: "Valor",
                  },
                  svg: {
                    filename: `Relatórios_Total_Operações_Usuários_${sessionStorage.getItem(0)}_${dataAtual}`,
                  },
                  png: {
                    filename: `Relatórios_Total_Operações_Usuários_${sessionStorage.getItem(0)}_${dataAtual}`,
                  },
                },
              },
            },
            plotOptions: {
              bar: {
                borderRadius: 0,
                horizontal: true,
                barHeight: '80%',
                isFunnel: true,
              },
            },
            dataLabels: {
              enabled: true,
              formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
              },
              style: {
                  fontSize: '18px',
                  fontWeight: 'bold'
              },
              dropShadow: {
                enabled: true,
              },
            },
            colors: ['#85c2ff'],
            title: {
              text: 'Total Operações por Usuário',
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
            xaxis: {
              categories: dados.labels,
            },
            // tooltip: {
            //   // y: {
            //   //   formatter: function (val) {
            //   //     return val; // Exibe o valor real no tooltip
            //   //   },
            //   // },
            //   shared: true,
            //   hideEmptySeries: true,
            // },
            legend: {
              show: false,
            },
          }}
          series={[{
            name: "Total Operações",
            data: dados.series,
          }]}
          type="bar"
          width={410}
        />
      </div>
    </div>
  );
};

export default ApexChart;
