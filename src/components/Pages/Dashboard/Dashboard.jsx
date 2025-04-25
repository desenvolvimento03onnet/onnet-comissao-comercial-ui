import React, { Suspense, lazy } from 'react';
import Load from './Load/Load';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

const DashboardT = lazy(() => import('../DashboardTotal/Dashboard'));
const DashboardS = lazy(() => import('../DashboardSupervisor/Dashboard'));
const DashboardO = lazy(() => import('../DashboardOperador/Dashboard'));

const Dashboard = ( ) => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/');
  };

    const permissionLevel = sessionStorage.getItem(3);

    if (!permissionLevel) {
      return <div><button onClick={handleGoToLogin} className={styles.ErroPermissao}>Permissão inválida ou não encontrada! Faça login novamente.</button></div>;
    }

   let DashboardComponent;

  switch (parseInt(permissionLevel)) {
    case 1:
      DashboardComponent = DashboardT;
      break;
    case 2:
      DashboardComponent = DashboardS;
      break;
    case 3:
      DashboardComponent = DashboardO;
      break;
    default:
      return <div><button onClick={handleGoToLogin} className={styles.ErroPermissao}>Permissão inválida! Contate o T.I.</button></div>;
  }

  return (
    <Suspense fallback={<Load />}>
      <DashboardComponent />
    </Suspense>
  );
};

export default Dashboard;
