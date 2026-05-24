import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ProductForm from "../../components/admin/ProductForm";
import {
  createProductAPI,
  getAdminProductsAPI,
  deleteProductAPI,
  updateProductAPI,
} from "../../services/adminProductService";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import toast from "react-hot-toast";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAdminProductsAPI();
      setProducts(data?.products || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // CREATE PRODUCT
  const handleCreateProduct = async (formData) => {
    try {
      await createProductAPI(formData);
      fetchProducts();
      setIsFormOpen(false);
      toast.success("Product created successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product");
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProductAPI(id);
      fetchProducts();
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  // UPDATE PRODUCT
  const handleUpdateProduct = async (formData) => {
    try {
      await updateProductAPI(editingProduct._id, formData);
      setEditingProduct(null);
      setIsFormOpen(false);
      fetchProducts();
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Products</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track your products, inventory, and status.</p>
        </div>
        {!isFormOpen && (
          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 shadow-md shadow-teal-500/10 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Product
          </Button>
        )}
      </div>

      {/* RENDER FORM */}
      {isFormOpen && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 sm:p-4 mb-6 shadow-sm">
          <ProductForm
            onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
            initialData={editingProduct}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingProduct(null);
            }}
          />
        </div>
      )}

      {/* PRODUCTS DISPLAY */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <Skeleton type="text" width="40%" />
          <Skeleton type="card" />
          <Skeleton type="card" />
        </div>
      ) : (!Array.isArray(products) || products.length === 0) ? (
        <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 text-3xl">
            📦
          </div>
          <h3 className="text-lg font-bold text-slate-800">No products found</h3>
          <p className="text-slate-500 text-sm mt-1 mb-5 max-w-sm mx-auto">Get started by creating your very first catalog listing.</p>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
          >
            Add Product Now
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">Product Details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6 text-right">Price</th>
                  <th className="py-4 px-6 text-center">Stock</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {Array.isArray(products) && products.map((product) => {
                  const outOfStock = product.stock === 0;
                  return (
                    <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-12 h-12 object-contain rounded-lg border border-slate-150 bg-white"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{product.title}</p>
                          <p className="text-xs text-slate-400 font-semibold">{product.brand}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-slate-600 font-medium bg-slate-100 border border-slate-200 rounded px-2.5 py-0.5 text-xs">
                          {product.category?.name || product.category || "General"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-slate-900">
                        ₹{product.price.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Badge variant={outOfStock ? "danger" : product.stock < 5 ? "warning" : "success"}>
                          {outOfStock ? "Out of stock" : `${product.stock} items`}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsFormOpen(true);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="p-1.5 text-teal-600 hover:text-white hover:bg-teal-600 border border-teal-200 rounded-lg transition-all"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-1.5 text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 rounded-lg transition-all"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProductsPage;