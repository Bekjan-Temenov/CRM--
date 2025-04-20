import { Filters } from "../StatisticsPage";


const StatisticsFilters = ({
    filters,
    setFilters,
  }: {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  }) => {
    return (
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-lg mb-6">
        <div className="w-1/3">
          <label className="block text-gray-600 font-semibold">Период</label>
          <select
            className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Все время</option>
            <option value="1month">1 месяц</option>
            <option value="1week">1 неделя</option>
          </select>
        </div>
  
        <div className="w-1/3">
          <label className="block text-gray-600  font-semibold">Категория</label>
          <select
          className="border rounded-lg px-3 py-1"
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="all">Все</option>
            <option value="debt">Долги</option>
            <option value="products">Товары</option>
            <option value="installment">Рассрочки</option>
          </select>
        </div>
      </div>
    );
  };

  export default StatisticsFilters