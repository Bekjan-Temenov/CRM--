import { useEffect, useState } from "react";

export interface Installment {
  id: number;
  name: string;
  phone: string;
  price: number;
  months: number;
  monthlyPayment: number;
  date: string;
}

export const loadInstallmentsFromLocalStorage = (): Installment[] => {
  const saved = localStorage.getItem("installments");
  return saved ? JSON.parse(saved) : [];
};

const saveInstallmentsToLocalStorage = (data: Installment[]) => {
  localStorage.setItem("installments", JSON.stringify(data));
};

const InstallmentsTable = () => {
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [newData, setNewData] = useState<Omit<Installment, "id" | "monthlyPayment">>({
    name: "",
    phone: "",
    price: 0,
    months: 1,
    date: new Date().toLocaleDateString(),
  });
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState<string>("all"); 
  const [duration, setDuration] = useState<string>("all");  
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    setInstallments(loadInstallmentsFromLocalStorage());
  }, []);

  const handleAdd = () => {
    const id = Date.now();
    const monthlyPayment = newData.price / newData.months;
    const newItem: Installment = { id, ...newData, monthlyPayment };
    const updated = [...installments, newItem];
    setInstallments(updated);
    saveInstallmentsToLocalStorage(updated);
    resetForm();
  };

  const handleEdit = () => {
    if (editingId === null) return;
    const updated = installments.map((item) =>
      item.id === editingId
        ? { ...item, ...newData, monthlyPayment: newData.price / newData.months }
        : item
    );
    setInstallments(updated);
    saveInstallmentsToLocalStorage(updated);
    resetForm();
  };

  const handleDelete = (id: number) => {
    const updated = installments.filter((item) => item.id !== id);
    setInstallments(updated);
    saveInstallmentsToLocalStorage(updated);
  };

  const handleEditClick = (item: Installment) => {
    setNewData({ name: item.name, phone: item.phone, price: item.price, months: item.months, date: item.date });
    setIsEditing(true);
    setEditingId(item.id);
    setIsOpen(true);
  };

  const resetForm = () => {
    setNewData({ name: "", phone: "", price: 0, months: 1, date: new Date().toLocaleDateString() });
    setIsEditing(false);
    setEditingId(null);
    setIsOpen(false);
  };

  // Filter by name and price range
  const filtered = installments.filter((item) => {
    const matchName = item.name.toLowerCase().includes(search.toLowerCase());
    const matchPrice =
      priceRange === "all"
        ? true
        : priceRange === "min"
        ? item.price >= 1000
        : priceRange === "max"
        ? item.price <= 5000
        : true;

    // Filter by duration
    const matchDuration =
      duration === "all"
        ? true
        : duration === "1d"
        ? item.months === 1
        : duration === "1m"
        ? item.months === 1
        : duration === "3m"
        ? item.months === 3
        : true;

    return matchName && matchPrice && matchDuration;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Рассрочки</h2>

      {/* Фильтры */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="ФИО или телефон"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />

        {/* Селект для цены */}
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">Все цены</option>
          <option value="min">Мин. цена</option>
          <option value="max">Макс. цена</option>
        </select>

        {/* Селект для срока рассрочки */}
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">Все сроки</option>
          <option value="1d">1 день</option>
          <option value="1m">1 месяц</option>
          <option value="3m">3 месяца</option>
        </select>

      </div>
        <button onClick={() => setIsOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
          Добавить
        </button>

      {/* Модалка */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">{isEditing ? "Редактировать" : "Новая рассрочка"}</h3>
            <input
              type="text"
              placeholder="ФИО"
              value={newData.name}
              onChange={(e) => setNewData({ ...newData, name: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Телефон"
              value={newData.phone}
              onChange={(e) => setNewData({ ...newData, phone: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="number"
              placeholder="Цена"
              value={newData.price}
              onChange={(e) => setNewData({ ...newData, price: +e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="number"
              placeholder="Месяцы"
              value={newData.months}
              onChange={(e) => setNewData({ ...newData, months: +e.target.value })}
              className="border p-2 rounded mb-4 w-full"
            />
            <div className="flex justify-end gap-2">
              <button onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded">Отмена</button>
              <button
                onClick={isEditing ? handleEdit : handleAdd}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {isEditing ? "Сохранить" : "Добавить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Таблица */}
      <table className="min-w-full border mt-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ФИО</th>
            <th className="p-2 border">Телефон</th>
            <th className="p-2 border">Сумма</th>
            <th className="p-2 border">Месяцев</th>
            <th className="p-2 border">В месяц</th>
            <th className="p-2 border">Дата</th>
            <th className="p-2 border w-[200px]">Действия</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.phone}</td>
              <td className="p-2 border">{item.price}</td>
              <td className="p-2 border">{item.months}</td>
              <td className="p-2 border">{item.monthlyPayment.toFixed(2)}</td>
              <td className="p-2 border">{item.date}</td>
              <td className="p-2 border flex gap-2 w-[200px]">
                <button onClick={() => handleEditClick(item)} className="bg-yellow-400 cursor-pointer text-white px-4 py-2 rounded">
                  Ред.
                </button>
                <button onClick={() => handleDelete(item.id)} className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded">
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstallmentsTable;
