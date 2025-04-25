import React from "react";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import { loadTabelaSupervisores } from "../../../../services/loadTabelaSupervisores";
import style from './Grafico.module.css';
import { GiConsoleController } from "react-icons/gi";

const ApexChart = ({ filter }) => {
    const [maisPlanosVendidos, setMaisPlanosVendidos] = useState([]);
    const [maisPlanosVendidosValor, setMaisPlanosVendidosValor] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await loadTabelaSupervisores(sessionStorage.getItem(0));
          
          const dadosFiltrados = filter.startDate && filter.endDate
            ? carrega.filter(item =>
                new Date(item.date) >= new Date(filter.startDate) &&
                new Date(item.date) <= new Date(filter.endDate)
              )
            : carrega;
            
          const processaMaisPlanosVendidos = () => {
            const groupedData = {};
    
            dadosFiltrados.forEach(({ plan }) => {
              if (!groupedData[plan]) groupedData[plan] = 0;
              groupedData[plan] += 1; // Contamos as operações
            });
            
            return [
              {
                name: "Planos Vendidos",
                data: Object.entries(groupedData).map(([plan, count]) => ({
                  x: plan,
                  y: count,
                })).sort((a, b) => b.y - a.y),
              }
            ];

          };

          const processaMaisPlanosVendidosValor = () => {
            const groupedData = {};
    
            dadosFiltrados.forEach(({ plan_value }) => {
              if (!groupedData[plan_value]) groupedData[plan_value] = 0;
              groupedData[plan_value] += 1; // Contamos as operações
            });
            
            return Object.entries(groupedData).map(([plan_value, count]) => ({
              label: Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(plan_value)), // Exibir como texto no eixo
              value: count,
            }))
            .sort((a, b) => b.value - a.value);

          };
          
          setMaisPlanosVendidosValor(processaMaisPlanosVendidosValor());
          setMaisPlanosVendidos(processaMaisPlanosVendidos());
        } catch (error) {
          console.error("Erro ao carregar dados: ", error);
        }
      };
      fetchData();
    }, [filter]);

    const dataAtual = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
    
  return (
    <div className={style.linha}>
      <div id="chart" className={style.Grafico}>
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
                return opt.w.globals.labels[opt.dataPointIndex] + ": " + val;
              },
              style: {
                  fontSize: function(val) {
                    return Math.max(10, Math.min(22, 50 - (opt.w.globals.labels[opt.dataPointIndex] + ": " + val).length)) + "px";
                  },
                  fontWeight: 'bold'
              },
              dropShadow: {
                enabled: true,
              },
            },
            colors: ['#85c2ff'],
            title: {
              text: 'Planos Mais Vendidos',
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
              labels: {
                style: {
                  fontSize: "12px", // Aplica o tamanho dinâmico
                },
              },
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
          series={maisPlanosVendidos}
          type="bar"
          width={410}
        />
      </div>

      <div id="chart" className={style.Grafico}>
        <ReactApexChart
          options={{
            chart: {
              type: "polarArea", // Tipo de gráfico
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
            labels: maisPlanosVendidosValor.map((item) => item.label),
            colors: ['#85c2ff'],
            title: {
              text: 'Planos Mais Vendidos(R$)',
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
            stroke: {
              colors: ["#fff"],
            },
            fill: {
              opacity: 1,
            },
            tooltip: {
              y: {
                formatter: (val) => `${val} vendas`, // Formata o valor no tooltip
              },
            },
            dataLabels: {
              enabled: true,
              formatter: (val, { seriesIndex, w }) => {
                return w.config.labels[seriesIndex]; // Usa os labels corretamente
              },
              style: {
                fontSize: "14px",
                fontWeight: "bold",
              },
              background: {
                enabled: true,
                foreColor: '#000',
                padding: 4,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: '#fff',
                opacity: 0.9,
                dropShadow: {
                  enabled: false,
                  top: 1,
                  left: 1,
                  blur: 1,
                  color: '#000',
                  opacity: 0.45
                }
              },
            },
            legend: {
              show: false,
            },
          }}
          series={maisPlanosVendidosValor.map((item) => item.value)}
          type="polarArea"
          width={410}
        />
      </div>
    </div>
  );
};

export default ApexChart;
