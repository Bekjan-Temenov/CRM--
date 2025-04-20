import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";
import { Product, loadProductsFromLocalStorage } from "./ProductsTable";
import { Debt, loadDebtsFromLocalStorage } from "./DebtTable";
import {
  Installment,
  loadInstallmentsFromLocalStorage,
} from "./InstallmentsTable";
import StatisticsFilters from "./Statistics/StatisticsFilters";
import StatisticsTable from "./Statistics/StatisticsTable";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export interface StatisticsData {
  name: string;
  value: number;
  color: string;
}
export interface Filters {
  category: string;
}

const StatisticsPage = () => {
  const [filters, setFilters] = useState<Filters>({ category: "all" });

  const [installments, setInstallments] = useState<Installment[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setInstallments(loadInstallmentsFromLocalStorage());
    setDebts(loadDebtsFromLocalStorage());
    setProducts(loadProductsFromLocalStorage());
  }, []);

  const statistics: StatisticsData[] = [
    { name: "Долги", value: debts.length, color: "#ff6384" },
    { name: "Товары", value: products.length, color: "#36a2eb" },
    { name: "Рассрочка", value: installments.length, color: "#ffcd56" },
  ];

  const data = {
    labels: statistics.map((s) => s.name),
    datasets: [
      {
        data: statistics.map((s) => s.value),
        backgroundColor: statistics.map((s) => s.color),
      },
    ],
  };


  

  return (
    <div className="statistics-page min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Статистика
        </h2>

        <StatisticsFilters filters={filters} setFilters={setFilters} />
     
    

        <div className="bg-white block md:hidden rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Детали статистики
          </h3>
          <div className="h-[300px] border overflow-y-auto">
            <StatisticsTable
              filters={filters}
              debts={debts}
              products={products}
              installments={installments}
              statistics={statistics}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Общая статистика
            </h3>
            <Pie data={data} />
          </div>

          <div className="bg-white hidden md:block rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Детали статистики
            </h3>
            <div className="h-[600px] border overflow-y-auto">
              <StatisticsTable
                filters={filters}
                debts={debts}
                products={products}
                installments={installments}
                statistics={statistics}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
