import { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
registerLocale("pt-BR", ptBR);
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Filtro.module.css";
import { serviceOperadores } from "../../../../services/serviceOperador";
import Select from 'react-select';

const getPreviousMonthRange = () => {
    const now = new Date();
  
    const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayPrevMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      startDate: new Date(firstDayPrevMonth),
      endDate: lastDayPrevMonth,
    };
  };
  
const Filtro = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState(getPreviousMonthRange().startDate);
  const [endDate, setEndDate] = useState(getPreviousMonthRange().endDate);
  const [showPicker, setShowPicker] = useState(false);
  const [operacoes, setOperacoes] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState([]);


  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        startDate: getPreviousMonthRange().startDate,
        endDate: getPreviousMonthRange().endDate,
        operation: '0',
      });
    }
    const fetchData = async () => {
      try {
        const carrega = await serviceOperadores(sessionStorage.getItem(0));
        const carregaOperacoes = () => {
          const operacoes = [...new Set(carrega.map(item => item.operation))].sort((a, b) => a.localeCompare(b));
          const operacoesOptions = operacoes.map(operation => ({
            value: operation,
            label: operation
          }));
          return operacoesOptions;
        };
        setOperacoes(carregaOperacoes());
      } catch (error) {
        console.error("Erro ao carregar dados: ", error);
      }
    };
    fetchData();
  }, []);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    triggerFilterChange(date, endDate, selectedOperation);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    triggerFilterChange(startDate, date, selectedOperation);
  };

  const handleOperationChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOperation(selected);
    triggerFilterChange(startDate, endDate, selected);
  };

  const triggerFilterChange = (start, end, operation) => {
    if (onFilterChange) {
      onFilterChange({
        startDate: start,
        endDate: end,
        operation: operation,
      });
    }
  };

  const resetDate = () => {
    const newStart = getPreviousMonthRange().startDate;
    const newEnd = getPreviousMonthRange().endDate;
    setStartDate(newStart);
    setEndDate(newEnd);
    setSelectedOperation([]);
    triggerFilterChange(newStart, newEnd, [], []);
  };


  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#fff',
      borderRadius: '8px',
      border: 'none',
      boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
      padding: '8px',
      cursor: 'pointer',
      width: '100%',
      maxWidth: '400px',
      minWidth: '200px',
      fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
      marginTop: '1px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#f9f9f9' : '#fff',
      color: '#000',
      cursor: 'pointer',
      textAlign: 'center',
      fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
      ':hover': {
        backgroundColor: '#85c2ff',
        color: '#fff',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0e0e0',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#000',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#000',
      ':hover': {
        backgroundColor: '#000',
        color: '#fff',
      },
    }),
  };

  return (
      <div className={styles.divFiltro}>
        <div className={styles.titulo}>Filtros: <button onClick={resetDate}>Limpar</button></div>
        <div className={styles.divDatas}>
              <DatePicker
                  title="Data Inicial"
                  selected={startDate}
                  onChange={handleStartDateChange}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className={styles.customDatepicker}
                  placeholderText="Data inicial"
                  dateFormat="dd/MM/yyyy"
                  locale="pt-BR"
              />
              <DatePicker
                  title="Data Final"
                  selected={endDate}
                  onChange={handleEndDateChange}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  className={styles.customDatepicker}
                  placeholderText="Data final"
                  dateFormat="dd/MM/yyyy"
                  locale="pt-BR"
              />
              {/* <button onClick={resetDate}>Limpar</button> */}
              {/* <button onClick={handleFilterChange}>Aplicar</button> */}
          </div>
          <div className={styles.divComboBox}>
          <Select
            isMulti
            options={operacoes}
            value={operacoes.filter(op => selectedOperation.includes(op.value))}
            onChange={(selected) => {
              const values = selected.map(op => op.value);
              setSelectedOperation(values);
              triggerFilterChange(startDate, endDate, values);
            }}
            placeholder="Selecione operações"
            styles={customStyles}
          />
          </div>
      </div>
  );
};
export default Filtro;
