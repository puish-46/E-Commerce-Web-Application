import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import useAuthStore from "../../store/authStore";
import { 
  getUserProfileAPI, 
  updateUserProfileAPI, 
  changePasswordAPI,
  addAddressAPI,
  deleteAddressAPI 
} from "../../services/userService";
import { uploadImageAPI } from "../../services/uploadService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, login } = useAuthStore();
  const token = useAuthStore(state => state.token); // Still need token to re-login if needed, or just update local store
  
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    avatar: "",
  });
  
  // Password State
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Addresses State
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const data = await getUserProfileAPI();
      setProfileData({
        name: data.name || "",
        phone: data.phone || "",
        avatar: data.avatar || "",
      });
      setAddresses(data.addresses || []);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = await updateUserProfileAPI(profileData);
      // Update store
      login(data, token);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      await changePasswordAPI({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      toast.success("Password changed successfully");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = await uploadImageAPI(file);
      setProfileData({ ...profileData, avatar: data.imageUrl });
      toast.success("Avatar uploaded! Save profile to keep changes.");
    } catch (error) {
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const updatedAddresses = await addAddressAPI(newAddress);
      setAddresses(updatedAddresses);
      setShowAddressForm(false);
      setNewAddress({
        fullName: "", phone: "", address: "", city: "", state: "", postalCode: "", country: "", isDefault: false
      });
      toast.success("Address added successfully");
    } catch (error) {
      toast.error("Failed to add address");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const updatedAddresses = await deleteAddressAPI(id);
      setAddresses(updatedAddresses);
      toast.success("Address deleted");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* SIDEBAR TABS */}
          <div className="w-full md:w-64 flex flex-col space-y-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`text-left px-4 py-3 rounded-md transition-colors ${activeTab === 'profile' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Profile Settings
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`text-left px-4 py-3 rounded-md transition-colors ${activeTab === 'security' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Security
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              className={`text-left px-4 py-3 rounded-md transition-colors ${activeTab === 'addresses' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Saved Addresses
            </button>
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
            
            {loading ? (
              <p>Loading profile...</p>
            ) : (
              <>
                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                    <form onSubmit={handleProfileUpdate} className="max-w-xl">
                      
                      <div className="mb-8 flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                          {profileData.avatar ? (
                            <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-bold">
                              {profileData.name?.charAt(0) || user?.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Change Avatar</label>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleAvatarUpload}
                            disabled={uploading}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                          />
                          {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
                        </div>
                      </div>

                      <Input 
                        label="Full Name" 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                        required 
                      />
                      <Input 
                        label="Email Address" 
                        value={user?.email || ""} 
                        disabled 
                        className="opacity-70 cursor-not-allowed"
                      />
                      <Input 
                        label="Phone Number" 
                        type="tel"
                        value={profileData.phone} 
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})} 
                      />
                      
                      <Button type="submit" className="mt-4">Save Changes</Button>
                    </form>
                  </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="max-w-xl">
                      <Input 
                        label="Current Password" 
                        type="password"
                        value={passwordData.oldPassword} 
                        onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})} 
                        required 
                      />
                      <Input 
                        label="New Password" 
                        type="password"
                        value={passwordData.newPassword} 
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} 
                        required 
                      />
                      <Input 
                        label="Confirm New Password" 
                        type="password"
                        value={passwordData.confirmPassword} 
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                        required 
                      />
                      
                      <Button type="submit" className="mt-4">Update Password</Button>
                    </form>
                  </div>
                )}

                {/* ADDRESSES TAB */}
                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
                      <Button variant="secondary" onClick={() => setShowAddressForm(!showAddressForm)}>
                        {showAddressForm ? 'Cancel' : 'Add New Address'}
                      </Button>
                    </div>

                    {showAddressForm && (
                      <form onSubmit={handleAddAddress} className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8 max-w-2xl">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Address</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input label="Full Name" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} required />
                          <Input label="Phone Number" type="tel" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} required />
                          <div className="sm:col-span-2">
                            <Input label="Street Address" value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} required />
                          </div>
                          <Input label="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required />
                          <Input label="State/Province" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} required />
                          <Input label="Postal Code" value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} required />
                          <Input label="Country" value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})} required />
                        </div>
                        <div className="flex items-center mt-4 mb-6">
                          <input type="checkbox" id="isDefault" checked={newAddress.isDefault} onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                          <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">Set as default address</label>
                        </div>
                        <Button type="submit">Save Address</Button>
                      </form>
                    )}

                    {addresses.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No saved addresses found.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div key={addr._id} className="border border-gray-200 rounded-lg p-5 relative">
                            {addr.isDefault && (
                              <span className="absolute top-3 right-3 bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded">Default</span>
                            )}
                            <h4 className="font-bold text-gray-900">{addr.fullName}</h4>
                            <p className="text-sm text-gray-600 mt-1">{addr.phone}</p>
                            <p className="text-sm text-gray-600 mt-2">{addr.address}</p>
                            <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                            <p className="text-sm text-gray-600">{addr.country}</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <button onClick={() => handleDeleteAddress(addr._id)} className="text-sm text-red-600 hover:text-red-800 font-medium">Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;