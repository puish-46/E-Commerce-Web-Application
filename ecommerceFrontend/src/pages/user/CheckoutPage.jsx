import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import MainLayout from "../../layouts/MainLayout";
import useCartStore from "../../store/cartStore";
import { placeOrderAPI } from "../../services/orderService";
import { getUserProfileAPI } from "../../services/userService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  
  // Custom address fields if user wants to enter manually
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await getUserProfileAPI();
        if (data.addresses && data.addresses.length > 0) {
          setAddresses(data.addresses);
          const defaultAddr = data.addresses.find(a => a.isDefault) || data.addresses[0];
          setSelectedAddressId(defaultAddr._id);
          formatAndSetShippingAddress(defaultAddr);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setFetchingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);

  const formatAndSetShippingAddress = (addr) => {
    setShippingAddress(`${addr.fullName}, ${addr.address}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}. Phone: ${addr.phone}`);
  };

  const handleAddressSelect = (e) => {
    const id = e.target.value;
    if (id === "manual") {
      setSelectedAddressId("manual");
      setShippingAddress("");
    } else {
      setSelectedAddressId(id);
      const addr = addresses.find(a => a._id === id);
      if (addr) formatAndSetShippingAddress(addr);
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      return toast.error("Please provide a shipping address");
    }

    try {
      setLoading(true);
      const orderData = {
        orderItems: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod,
        totalPrice: cart.totalPrice,
      };

      await placeOrderAPI(orderData);
      
      // Clear cart locally (ideally there should be a clearCartAPI, but we'll re-fetch or clear local)
      setCart({ items: [], totalPrice: 0 });
      
      toast.success("Order placed successfully!");
      navigate("/my-orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN - FORM */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* SHIPPING ADDRESS SECTION */}
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="bg-teal-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                  Shipping Address
                </h2>
                
                {!fetchingAddresses && addresses.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Saved Address</label>
                    <select 
                      value={selectedAddressId} 
                      onChange={handleAddressSelect}
                      className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md border"
                    >
                      {addresses.map(addr => (
                        <option key={addr._id} value={addr._id}>
                          {addr.fullName} - {addr.address}, {addr.city}
                        </option>
                      ))}
                      <option value="manual">Enter manually</option>
                    </select>
                  </div>
                )}

                {selectedAddressId === "manual" || addresses.length === 0 ? (
                  <Input 
                    label="Full Shipping Address" 
                    value={shippingAddress} 
                    onChange={(e) => setShippingAddress(e.target.value)} 
                    placeholder="Enter your complete address..."
                  />
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{shippingAddress}</p>
                  </div>
                )}
              </div>

              {/* PAYMENT METHOD SECTION */}
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="bg-teal-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                  Payment Method
                </h2>
                
                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-teal-500 bg-teal-50 rounded-lg cursor-pointer">
                    <input 
                      type="radio" 
                      value="COD" 
                      checked={paymentMethod === "COD"} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300" 
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-teal-900">Cash on Delivery (COD)</span>
                      <span className="block text-xs text-teal-700 mt-1">Pay when you receive your order</span>
                    </div>
                  </label>
                  
                  {/* Stripe option removed as per user request */}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN - ORDER SUMMARY */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-md overflow-hidden border border-gray-100 flex-shrink-0">
                        <img src={item.product.image} alt={item.product.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.product.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
                
                <hr className="border-gray-200 mb-4" />
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{cart.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="text-teal-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 mt-4 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{cart.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  fullWidth 
                  onClick={handlePlaceOrder}
                  disabled={loading || !shippingAddress}
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>
                
                <p className="text-xs text-center text-gray-500 mt-4">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;