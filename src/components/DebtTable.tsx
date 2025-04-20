import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";

export interface Debt {
  id: number;
  name: string;
  phone: string;
  product: string;
  total: number;
  paid: number;
  date: string; // Добавим поле для даты
}

export const loadDebtsFromLocalStorage = (): Debt[] => {
  const savedDebts = localStorage.getItem('debts');
  return savedDebts ? JSON.parse(savedDebts) : [];
};

const saveDebtsToLocalStorage = (debts: Debt[]) => {
  localStorage.setItem('debts', JSON.stringify(debts));
};

const DebtsTable = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [filteredDebts, setFilteredDebts] = useState<Debt[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newDebt, setNewDebt] = useState<Omit<Debt, "id">>({
    name: "",
    phone: "",
    product: "",
    total: 0,
    paid: 0,
    date: new Date().toLocaleDateString(),
  });
  const [editingDebtId, setEditingDebtId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    const loadedDebts = loadDebtsFromLocalStorage();
    setDebts(loadedDebts);
    setFilteredDebts(loadedDebts);
  }, []);

  useEffect(() => {
    let filtered = debts;

    if (searchTerm) {
      filtered = filtered.filter((debt) =>
        debt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debt.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debt.product.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (paymentStatus !== "all") {
      const isPaid = paymentStatus === "paid";
      filtered = filtered.filter((debt) => (debt.paid >= debt.total) === isPaid);
    }

    if (dateFilter !== "all") {
      const today = new Date();
      const filterDate = new Date(today.setDate(today.getDate() - parseInt(dateFilter)));
      filtered = filtered.filter((debt) => new Date(debt.date) >= filterDate);
    }

    setFilteredDebts(filtered);
  }, [searchTerm, paymentStatus, dateFilter, debts]);

  const handleAddDebt = () => {
    const id = Date.now();
    const newEntry: Debt = { id, ...newDebt };
    const updatedDebts = [...debts, newEntry];
    setDebts(updatedDebts);
    saveDebtsToLocalStorage(updatedDebts);
    setNewDebt({
      name: "",
      phone: "",
      product: "",
      total: 0,
      paid: 0,
      date: new Date().toLocaleDateString(),
    });
    setIsOpen(false);
  };

  const handleEditDebt = (id: number) => {
    const debtToEdit = debts.find((debt) => debt.id === id);
    if (debtToEdit) {
      const { id: _, ...rest } = debtToEdit;
      setNewDebt(rest);
      setEditingDebtId(id);
      setIsOpen(true);
    }
  };

  const handleSaveEdit = () => {
    const updatedDebts = debts.map((debt) =>
      debt.id === editingDebtId ? { ...debt, ...newDebt } : debt
    );
    setDebts(updatedDebts);
    saveDebtsToLocalStorage(updatedDebts);
    setNewDebt({
      name: "",
      phone: "",
      product: "",
      total: 0,
      paid: 0,
      date: new Date().toLocaleDateString(),
    });
    setEditingDebtId(null);
    setIsOpen(false);
  };

  const handleDelete = (id: number) => {
    const updatedDebts = debts.filter((debt) => debt.id !== id);
    setDebts(updatedDebts);
    saveDebtsToLocalStorage(updatedDebts);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Долги</h2>

      {/* Фильтры */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded mr-4"
        />
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="border p-2 rounded mr-4"
        >
          <option value="all">Все</option>
          <option value="paid">Оплачено</option>
          <option value="unpaid">Не оплачено</option>
        </select>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">Все</option>
          <option value="7">Последние 7 дней</option>
          <option value="30">Последний месяц</option>
        </select>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Добавить долг
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
            <Dialog.Title className="text-lg font-bold mb-4">
              {editingDebtId ? "Редактировать долг" : "Добавить долг"}
            </Dialog.Title>
            <div className="grid gap-2">
              <input
                type="text"
                placeholder="Имя"
                value={newDebt.name}
                onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Телефон"
                value={newDebt.phone}
                onChange={(e) => setNewDebt({ ...newDebt, phone: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Товар"
                value={newDebt.product}
                onChange={(e) => setNewDebt({ ...newDebt, product: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Сумма"
                value={newDebt.total}
                onChange={(e) => setNewDebt({ ...newDebt, total: +e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Оплачено"
                value={newDebt.paid}
                onChange={(e) => setNewDebt({ ...newDebt, paid: +e.target.value })}
                className="border p-2 rounded"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Отмена
                </button>
                <button
                  onClick={editingDebtId ? handleSaveEdit : handleAddDebt}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Таблица */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Имя</th>
            <th className="p-2 border">Телефон</th>
            <th className="p-2 border">Товар</th>
            <th className="p-2 border">Сумма</th>
            <th className="p-2 border">Оплачено</th>
            <th className="p-2 border">Осталось</th>
            <th className="p-2 border">Дата</th>
            <th className="p-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredDebts.map((debt) => (
            <tr key={debt.id}>
              <td className="p-2 border">{debt.name}</td>
              <td className="p-2 border">{debt.phone}</td>
              <td className="p-2 border">{debt.product}</td>
              <td className="p-2 border">{debt.total} сом</td>
              <td className="p-2 border">{debt.paid} сом</td>
              <td className="p-2 border">{+debt.total - +debt.paid} сом</td>
              <td className="p-2 border">{debt.date}</td>
              <td className="p-2 border space-x-2 w-auto md:w-[170px]">
                <button
                  onClick={() => handleEditDebt(debt.id)}
                  className="bg-yellow-400 cursor-pointer text-white px-2 py-1 mb-2 rounded"
                >
                  Ред.
                </button>
                <button
                  onClick={() => handleDelete(debt.id)}
                  className="bg-red-500 cursor-pointer text-white px-2 py-1 rounded"
                >
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

export default DebtsTable;
