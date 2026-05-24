import { useState, useEffect } from "react";
import { getCategoriesAPI } from "../../services/categoryService";
import { uploadImageAPI } from "../../services/uploadService";
import useAuthStore from "../../store/authStore";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import toast from "react-hot-toast";

const ProductForm = ({ onSubmit, initialData = null, onCancel = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    image: initialData?.image || "",
    brand: initialData?.brand || "",
    category: initialData?.category?._id || initialData?.category || "",
    stock: initialData?.stock || "",
  });

  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesAPI();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price || "",
        image: initialData.image || "",
        brand: initialData.brand || "",
        category: initialData.category?._id || initialData.category || "",
        stock: initialData.stock || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        title: "",
        description: "",
        price: "",
        image: "",
        brand: "",
        category: "",
        stock: "",
      });
    }
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      
      setUploading(true);
      const data = await uploadImageAPI(file, token);
      setFormData((prev) => ({
        ...prev,
        image: data.imageUrl,
      }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
        {initialData ? "Edit Product Details" : "Create New Product"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Product Title"
          type="text"
          name="title"
          placeholder="e.g. iPhone 15 Pro"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <Input
          label="Brand"
          type="text"
          name="brand"
          placeholder="e.g. Apple"
          value={formData.brand}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-slate-700">Description</label>
        <textarea
          name="description"
          rows="4"
          className="block w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder-slate-400"
          placeholder="Detailed description of product features..."
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Price (₹)"
          type="number"
          name="price"
          placeholder="Price in INR"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <Input
          label="Stock"
          type="number"
          name="stock"
          placeholder="Quantity in stock"
          value={formData.stock}
          onChange={handleChange}
          required
        />

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          options={[
            { value: "", label: "Select Category" },
            ...categories.map((c) => ({ value: c._id, label: c.name })),
          ]}
        />
      </div>

      {/* Image URL & File Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <Input
          label="Product Image URL"
          type="text"
          name="image"
          placeholder="Paste external image link..."
          value={formData.image}
          onChange={handleChange}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Or Upload Image File</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
            />
            {uploading && (
              <span className="absolute right-2 top-2 text-xs font-semibold text-teal-600 animate-pulse">
                Uploading...
              </span>
            )}
          </div>
        </div>
      </div>

      {formData.image && (
        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 inline-block">
          <p className="text-xs text-slate-500 font-semibold mb-2">Image Preview:</p>
          <img
            src={formData.image}
            alt="preview"
            className="h-24 w-auto object-contain rounded-lg shadow-inner bg-white border border-slate-200"
          />
        </div>
      )}

      <div className="flex items-center gap-3 pt-3 border-t border-slate-100 justify-end">
        {onCancel && (
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="shadow-md shadow-teal-500/10">
          {initialData ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;