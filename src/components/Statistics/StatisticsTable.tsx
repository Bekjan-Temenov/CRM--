import { Debt } from "../DebtTable";
import { Installment } from "../InstallmentsTable";
import { Product } from "../ProductsTable";
import { Filters, StatisticsData } from "../StatisticsPage";

import { useState } from "react";

const StatisticsTable = ({
  filters,
  statistics,
  debts,
  products,
  installments,
}: {
  filters: Filters;
  statistics: StatisticsData[];
  debts: Debt[];
  products: Product[];
  installments: Installment[];
}) => {
  const [selectedName, setSelectedName] = useState<string>("");

  if (filters.category === "all") {
    return (
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 border-b">Категория</th>
            <th className="py-2 px-4 border-b">Количество</th>
          </tr>
        </thead>
        <tbody>
          {statistics.map((stat) => (
            <tr key={stat.name} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-center text-gray-800">
                {stat.name}
              </td>
              <td className="py-2 px-4 border-b text-center text-gray-800">
                {stat.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Обработчики и фильтрация
  const getFilteredData = () => {
    switch (filters.category) {
      case "debt":
        return selectedName
          ? debts.filter((item) => item.name === selectedName)
          : debts;
      case "products":
        return selectedName
          ? products.filter((item) => item.name === selectedName)
          : products;
      case "installment":
        return selectedName
          ? installments.filter((item) => item.name === selectedName)
          : installments;
      default:
        return [];
    }
  };

  const getNames = () => {
    const allNames =
      filters.category === "debt"
        ? debts.map((item) => item.name)
        : filters.category === "products"
        ? products.map((item) => item.name)
        : installments.map((item) => item.name);
    return Array.from(new Set(allNames)); // уникальные имена
  };

  const filteredData = getFilteredData();

  const getTotal = () => {
    return filteredData.reduce((sum, item) => {
      if (filters.category === "debt" || filters.category === "installment") {
        if ('total' in item) {
            return sum + Number(item.total || 0);
        }
      } else if (filters.category === "products") {
        return sum + Number((item as Product).price || 0);
      }
      return sum;
    }, 0);
  };
  

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm text-gray-700">Выберите:</label>
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
        >
          <option value="">Все</option>
          {getNames().map((name, idx) => (
            <option key={idx} value={name}>
              {name}
            </option>
          ))}
        </select>
        <span className="ml-auto text-sm font-semibold">
          Общая сумма: {getTotal()} сом
        </span>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 border-b">Название</th>
            <th className="py-2 px-4 border-b">Сумма</th>
            <th className="py-2 px-4 border-b">Дата</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-start">{item.name}</td>
              <td className="py-2 px-4 border-b text-center">
                {filters.category === "debt" ||
                filters.category === "installment"
                ? ('total' in item ? `${item.total} сом` : '')
                  : `${(item as Product).price} сом`}
              </td>
              <td className="py-2 px-4 border-b text-center">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatisticsTable;
