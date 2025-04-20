import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "../components/layout/Layout"
import DebtTable from "../components/DebtTable"
import ProductsTable from '../components/ProductsTable';
import InstallmentsTable from '../components/InstallmentsTable';
import StatisticsPage from '../components/StatisticsPage';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/debts" replace />} />
          <Route path="/debts" element={<DebtTable/>}/>
          <Route path="/products" element={<ProductsTable/>}/>
          <Route path="/installments" element={<InstallmentsTable/>}/>
          <Route path="/staticstics" element={<StatisticsPage/>}/>
        </Route>
      </Routes>
    </Router>
  )
}
export default App