import { useEffect, useState } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  date: string; // Дата добавления товара
}



export const loadProductsFromLocalStorage = (): Product[] => {
  const savedProducts = localStorage.getItem("products");
  return savedProducts ? JSON.parse(savedProducts) : [];
};

const saveProductsToLocalStorage = (products: Product[]) => {
  localStorage.setItem("products", JSON.stringify(products));
};

const ProductsTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    date: new Date().toISOString(),
  });
  const [sortOption, setSortOption] = useState<string>("popular");
  const [dateRange, setDateRange] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  useEffect(() => {
    const loadedProducts = loadProductsFromLocalStorage();
    setProducts(loadedProducts);
  }, []);

  const handleAddProduct = () => {
    const id = Date.now(); 
    const updatedProducts = [...products, { id, ...newProduct }];
    setProducts(updatedProducts);
    saveProductsToLocalStorage(updatedProducts);
    setNewProduct({
      name: "",
      price: 0,
      date: new Date().toLocaleDateString(),
    });
    setIsOpen(false);
  };

  const handleEditProduct = () => {
    if (editingProductId === null) return;

    const updatedProducts = products.map((product) =>
      product.id === editingProductId
        ? { ...product, ...newProduct } 
        : product
    );

    setProducts(updatedProducts);
    saveProductsToLocalStorage(updatedProducts);
    setNewProduct({
      name: "",
      price: 0,
      date: new Date().toLocaleDateString(),
    });
    setIsOpen(false);
    setIsEditing(false);
    setEditingProductId(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteProduct = (id: number) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    saveProductsToLocalStorage(updatedProducts);
  };

  const handleEditClick = (product: Product) => {
    setNewProduct({
      name: product.name,
      price: product.price,
      date: product.date,
    });
    setEditingProductId(product.id);
    setIsEditing(true);
    setIsOpen(true);
  };

  const filteredProducts = products.filter((product) => {
    const productDate = new Date(product.date); 

    const matchesSearchTerm = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    
    let matchesDateRange = true;
    if (dateRange === "1day") {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      matchesDateRange = productDate >= oneDayAgo;
    } else if (dateRange === "1month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      matchesDateRange = productDate >= oneMonthAgo;
    } else if (dateRange === "3months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      matchesDateRange = productDate >= threeMonthsAgo;
    }


    return (
      matchesSearchTerm &&
      matchesDateRange 
    );
  });

  if (sortOption === "popular") {
    const nameFrequencyMap: Record<string, number> = {};
    filteredProducts.forEach((product) => {
      const name = product.name.toLowerCase();
      nameFrequencyMap[name] = (nameFrequencyMap[name] || 0) + 1;
    });

    products.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameFrequencyMap[nameB] - nameFrequencyMap[nameA];
    });
  } else if (sortOption === "newest") {
    products.reverse();
  } else if (sortOption === "oldest") {
    
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Товары</h2>

      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Поиск по товару"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border p-2 rounded"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="popular">Популярные</option>
          <option value="newest">Новые</option>
          <option value="oldest">Старые</option>
        </select>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">За всё время</option>
          <option value="1day">1 день</option>
          <option value="1month">1 месяц</option>
          <option value="3months">3 месяца</option>
        </select>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Добавить товар
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? "Редактировать товар" : "Добавить товар"}
            </h3>
            <input
              type="text"
              placeholder="Название товара"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="border p-2 rounded mb-4 w-full"
            />
            <input
              type="text"
              placeholder="Цена"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: +e.target.value })
              }
              className="border p-2 rounded mb-4 w-full"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Отмена
              </button>
              <button
                onClick={isEditing ? handleEditProduct : handleAddProduct}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {isEditing ? "Сохранить изменения" : "Добавить"}
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full border mt-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Название</th>
            <th className="p-2 border">Цена</th>
            <th className="p-2 border">Дата</th>
            <th className="p-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td className="p-2 border">{product.name}</td>
              <td className="p-2 border">{product.price} сом</td>
              <td className="p-2 border">{product.date}</td>
              <td className="p-2 border w-auto md:w-[200px]">
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-yellow-400 cursor-pointer text-white px-2 md:px-4 py-2 mb-2 md:mr-2 rounded"
                >
                  Ред.
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded"
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

export default ProductsTable;
