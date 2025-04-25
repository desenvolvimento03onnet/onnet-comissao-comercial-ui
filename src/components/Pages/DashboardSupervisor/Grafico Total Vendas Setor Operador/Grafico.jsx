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
          
          const sortedCounts = Object.fromEntries(
            Object.entries(agrupado)
                .sort((a, b) => b[1] - a[1]) // Ordena de forma descendente pela contagem
          );
          
          // Criar os arrays de labels e valores
          const labels = Object.keys(sortedCounts);
          const series = Object.values(sortedCounts);

          setDados({ labels, series });
        } catch (error) {
          console.error("Erro ao carregar dados: ", error);
        }
      };
      fetchData();
    }, [filter]);
    
  return (
    <div>
      <div id="chart" className="Grafico">
        <ReactApexChart
          options={{
            chart: {
              type: "bar", // Tipo de gráfico
              toolbar: {
                show: true, // Mostra a barra de ferramentas
                tools: {
                  download: true, // Habilita o botão de download
                },
              },
              dropShadow: {
                enabled: true,
              },
              export: {
                csv: {
                  filename: "meu_grafico",
                  columnDelimiter: ";",
                  headerCategory: "Categoria",
                  headerValue: "Valor",
                },
                svg: {
                  filename: "meu_grafico_svg",
                },
                png: {
                  filename: "meu_grafico_png",
                },
              },
            },
            plotOptions: {
              bar: {
                borderRadius: 0,
                horizontal: true,
                distributed: true,
                barHeight: '80%',
                isFunnel: true,
              },
            },
            colors: [
              '#F44F5E',
              '#E55A89',
              '#D863B1',
              '#CA6CD8',
              '#B57BED',
              '#8D95EB',
              '#62ACEA',
              '#4BC3E6',
            ],
            dataLabels: {
              enabled: true,
              formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
              },
              dropShadow: {
                enabled: true,
              },
            },
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
            // xaxis: {
            //   categories: [
            //     'Sourced',
            //     'Screened',
            //     'Assessed',
            //     'HR Interview',
            //     'Technical',
            //     'Verify',
            //     'Offered',
            //     'Hired',
            //   ],
            // },
          }}
          series={[{
            name: 'Total',
            data: dados.series
          }]}
          type="bar"
          width={410}
        />
      </div>
    </div>
  );
};

export default ApexChart;
