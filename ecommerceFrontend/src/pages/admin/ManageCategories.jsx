import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getCategoriesAPI,
  createCategoryAPI,
  updateCategoryAPI,
  deleteCategoryAPI,
} from "../../services/categoryService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Skeleton from "../../components/ui/Skeleton";
import toast from "react-hot-toast";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategoriesAPI();
      setCategories(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // SUBMIT (CREATE OR EDIT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name is required");

    try {
      if (editingCategory) {
        await updateCategoryAPI(editingCategory._id, { name, description });
        toast.success("Category updated successfully!");
        setEditingCategory(null);
      } else {
        await createCategoryAPI({ name, description });
        toast.success("Category created successfully!");
      }
      setName("");
      setDescription("");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategoryAPI(id);
      fetchCategories();
      toast.success("Category deleted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <AdminLayout>
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Categories</h1>
        <p className="text-slate-500 text-sm mt-1">Manage and define product grouping categories for your catalog filter sidebar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FORM */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Category Name"
              type="text"
              placeholder="e.g. Smart Electronics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Description</label>
              <textarea
                rows="3"
                className="block w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder-slate-400"
                placeholder="Brief summary..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingCategory ? "Update" : "Create"}
              </Button>
              {editingCategory && (
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setName("");
                    setDescription("");
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* LIST */}
        <div className="lg:col-span-8 space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <Skeleton type="text" width="60%" />
              <Skeleton type="text" width="40%" />
            </div>
          ) : categories.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 py-12 text-center shadow-sm">
              <p className="text-slate-500 font-semibold">No categories registered yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Description</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {categories.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900">{c.name}</td>
                        <td className="py-4 px-6 text-slate-500 max-w-xs truncate">{c.description || "-"}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => {
                                setEditingCategory(c);
                                setName(c.name);
                                setDescription(c.description || "");
                              }}
                              className="p-1.5 text-teal-600 hover:text-white hover:bg-teal-600 border border-teal-200 rounded-lg transition-all"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(c._id)}
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageCategories;