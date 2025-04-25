import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Filtro.module.css";
import { Filter } from "lucide-react"; // Ícone de filtro

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


  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        startDate: getPreviousMonthRange().startDate,
        endDate: getPreviousMonthRange().endDate,
      });
    }
  }, []);

  const handleStartDateChange = (date) => {
    const normalizedDate = date;
    setStartDate(normalizedDate);

    // Dispara o filtro sempre que a data muda
    onFilterChange &&
      onFilterChange({
        startDate: normalizedDate,
        endDate: endDate,
      });
  };

  const handleEndDateChange = (date) => {
    const normalizedDate = date;
    setEndDate(normalizedDate);

    // Dispara o filtro sempre que a data muda
    onFilterChange &&
      onFilterChange({
        startDate: startDate,
        endDate: normalizedDate,
      });
  };

  const handleFilterChange = () => {
      onFilterChange({ startDate, endDate });
      setShowPicker(false);
  };

  const resetDate = () => {
    setStartDate(getPreviousMonthRange().startDate);
    setEndDate(getPreviousMonthRange().endDate);
    onFilterChange({ startDate: getPreviousMonthRange().startDate, endDate: getPreviousMonthRange().endDate });
  }

  return (
      <div className={styles.divFiltro}>
          <button onClick={() => setShowPicker(!showPicker)}>
              <Filter size={24} />
          </button>

          {showPicker && (
              <div className={styles.divDatas}>
                  <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className={styles.customDatepicker}
                      placeholderText="Data inicial"
                  />
                  <DatePicker
                      selected={endDate}
                      onChange={handleEndDateChange}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      className={styles.customDatepicker}
                      placeholderText="Data final"
                  />
                  <button onClick={resetDate}>Limpar</button>
                  <button onClick={handleFilterChange}>Aplicar</button>
              </div>
          )}
      </div>
  );
};

export default Filtro;
