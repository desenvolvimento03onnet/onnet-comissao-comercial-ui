import React from "react";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import { loadGraficoTotalPassagemTempo } from "../../../../services/loadGraficoTotalPassagemTempo";
import style from './Grafico.module.css';

const ApexChart = ({ filter }) => {
    // const [chartData, setChartData] = useState({ categories: [], series: [] });
    const [chartDataBySector, setChartDataBySector] = useState([]);
    const [chartDataOverall, setChartDataOverall] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await loadGraficoTotalPassagemTempo(sessionStorage.getItem(0));
          //const usuaSe = await loadUsuarioSetores(sessionStorage.getItem(0));
          
          // Filtrar dados conforme data selecionada
        const dadosFiltrados = filter.startDate && filter.endDate
        ? carrega.filter(item =>
            new Date(item.date) >= new Date(filter.startDate) &&
            new Date(item.date) <= new Date(filter.endDate)
          )
        : carrega;

        const datas = carrega.reduce((index, item) => {
          index[item.date.slice(0, 7)] = (index[item.date.slice(0, 7)] || 0) + 1;
          return index;
        },{});

        const operacoes = carrega.reduce((index, item) => {
          index[item.operation] = (index[item.operation] || 0) + 1;
          return index;
        },{});
      
      const processDataBySector = () => {
        const groupedData = {};
    
        dadosFiltrados.forEach(({ date, sector }) => {
          const data = date.slice(0, 7); // Pegamos apenas "YYYY-MM"
          if (!groupedData[sector]) groupedData[sector] = {};
          if (!groupedData[sector][data]) groupedData[sector][data] = 0;
          groupedData[sector][data] += 1; // Contamos as operações
        });
    
        return Object.keys(groupedData).map((sector) => ({
          name: sector,
          data: Object.entries(groupedData[sector]).map(([date, count]) => ({
            x: date,
            y: count,
          })),
        }));
      };
    
      const processDataOverall = () => {
        const groupedData = {};
        // Lista fixa de operações conhecidas
        const todasOperacoes = Object.keys(operacoes);
        // Lista fixa de datas conhecidas
        const todasDatas = Object.keys(datas);

        todasOperacoes.forEach((operation) => {
          groupedData[operation] = {};
          todasDatas.forEach((data) => {
            groupedData[operation][data] = 0; // Inicializa com 0
          });
        });

        dadosFiltrados.forEach(({ date, operation }) => {
          const data = date.slice(0, 7);
          groupedData[operation][data] += 1;
        });
    
        return todasOperacoes.map((operation) => ({
          name: operation,
          data: todasDatas.map((date) => ({
            x: date,
            y: groupedData[operation][date],
          })),
        }));
        
      };
      setChartDataBySector(processDataBySector());
      setChartDataOverall(processDataOverall());
        } catch (error) {
          console.error("Erro ao carregar dados: ", error);
        }
      };
      fetchData();
    }, [filter]);
    
    // 🔹 Função para definir cores dinamicamente com base na série
  const getColor = (seriesIndex, w) => {
    const seriesName = w.globals.seriesNames[seriesIndex];

    const colorMap = {
      "FRENTE-LOJA": "#7d7ac9",
      "TELEMARKETING": "#fbefa5",
      "PAP": "#1c8080",
      "Venda": "#FF9800",
      "Renovação": "#2E93fA",
      "Downgrade": "#FF4560",
      "Upgrade": "#66DA26"
    };

    return colorMap[seriesName] || "#333"; // Cor padrão
  };
  const dataAtual = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
  return (
    <div className={style.content}>
      {/* Gráfico por setor */}
      <h2>Operações por Setor</h2>
      <ReactApexChart
        options={{
          chart: {
            height: '100%',
            width: '100%',
            type: "line",
            stacked: false,
            toolbar: {
              show: true, // Mostra a barra de ferramentas
              tools: {
                download: true, // Habilita o botão de download
              },
              export: {
                csv: {
                  filename: `Relatório_Total_Operações_por_Setor_no_Mês_${sessionStorage.getItem(0)}_${dataAtual}`,
                  columnDelimiter: ";",
                  headerCategory: "Categoria",
                  headerValue: "Valor",
                },
                svg: { filename: `Relatório_Total_Operações_por_Setor_no_Mês_${sessionStorage.getItem(0)}_${dataAtual}` },
                png: { filename: `Relatório_Total_Operações_por_Setor_no_Mês_${sessionStorage.getItem(0)}_${dataAtual}` },
              },
            },
          },
          responsive: [
            {
              breakpoint: 2000,
              options: {
                chart: {
                  height: 500,
                  width: 1245,
                },
                legend: {
                  position: 'bottom'
                }
              }
            }
          ],
          plotOptions: {
            line: {
              isSlopeChart: true,
            },
          },
          dataLabels: {
            background: {
              enabled: true,
            },
            formatter(val, opts) {
              const seriesName = opts.w.config.series[opts.seriesIndex].name
              return val !== null ? seriesName : ''
            },
          },
          colors: chartDataBySector.map((_, index) => getColor(index, { globals: { seriesNames: chartDataBySector.map(s => s.name) } })),
          stroke: { 
            width: [9, 9, 9, 9],
            dashArray: [0, 0, 0, 0],
            curve: 'smooth',
          },
          title: { text: "Quantidades de Operações por Setor", align: "left" },
          yaxis: {
            show: true,
            labels: {
              show: true,
            },
          },
          xaxis: { position: 'bottom', },
          tooltip: {
            followCursor: true,
            intersect: false,
            shared: true
          },
          legend: { 
            show: true,
            position: 'top',
            horizontalAlign: 'left',
          },
        }}
        series={chartDataBySector}
        type="line"
      />

      <ReactApexChart
        options={{
          chart: {
            height: '100%',
            width: '100%',
            type: "line",
            stacked: false,
            toolbar: {
              show: true, // Mostra a barra de ferramentas
              tools: {
                download: true, // Habilita o botão de download
              },
              export: {
                csv: {
                  filename: `Relatório_Total_Operações_no_Mês_${sessionStorage.getItem(0)}_${dataAtual}`,
                  columnDelimiter: ";",
                  headerCategory: "Categoria",
                  headerValue: "Valor",
                },
                svg: { filename: `Relatório_Total_Operações_no_Mês_${sessionStorage.getItem(0)}_${dataAtual}` },
                png: { filename: `Relatório_Total_Operações_no_Mês_${sessionStorage.getItem(0)}_${dataAtual}` },
              },
            },
          },
          responsive: [
            {
              breakpoint: 2000,
              options: {
                chart: {
                  height: 500,
                  width: 1245,
                },
                legend: {
                  position: 'bottom'
                }
              }
            }
          ],
          plotOptions: {
            line: {
              isSlopeChart: true,
            },
          },
          dataLabels: {
            background: {
              enabled: true,
            },
            formatter(val, opts) {
              const seriesName = opts.w.config.series[opts.seriesIndex].name
              console.log(chartDataOverall);
              return val !== null ? (seriesName + ':' + val) : ''
            },
          },
          colors: chartDataOverall.map((_, index) => getColor(index, { globals: { seriesNames: chartDataOverall.map(s => s.name) } })),
          stroke: { 
            width: [5, 5, 5, 5],
            dashArray: [0, 0, 0, 0],
            curve: 'smooth',
          },
          title: { text: "Total de Operações", align: "left" },
          yaxis: {
            show: true,
            max: 2,
            labels: {
              show: true,
            },
          },
          xaxis: { position: 'bottom', },
          tooltip: {
            followCursor: true,
            intersect: false,
            shared: true
          },
          legend: { 
            show: true,
            position: 'top',
            horizontalAlign: 'left',
          },
        }}
        series={chartDataOverall}
        type="line"
        width={1500}
        height={500}
      />
    </div>
  );
};

export default ApexChart;
