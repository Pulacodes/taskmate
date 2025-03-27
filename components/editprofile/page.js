//components/editprofile/page.js
'use client';
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

export default function EditProfile() {
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const initialFormData = useRef(null);
  const [formData, setFormData] = useState({
    avatarUrl: '',
    aboutMe: '',
    username: '',
    profession: '',
    portfolioImages: [],
    cvUrl: ''
  });

  useEffect(() => {
    if (!email) return;

    const fetchData = async () => {
      try {
        const userRes = await fetch(`/api/users/${email}`);
        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const userData = await userRes.json();
        
        const initialData = {
          avatarUrl: userData.avatarUrl || '',
          aboutMe: userData.aboutMe || '',
          username: userData.username || '',
          profession: userData.profession || '',
          portfolioImages: userData.portfolioImages || [],
          cvUrl: userData.cvUrl || ''
        };

        setUserData(userData);
        setFormData(initialData);
        initialFormData.current = initialData;
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      const form = new FormData();
      form.append('avatar', file);
      form.append('username', formData.username);
      form.append('aboutMe', formData.aboutMe);
      form.append('profession', formData.profession);
      form.append('cvUrl', formData.cvUrl);
  
      const response = await fetch(`/api/users/${email}`, {
        method: 'POST',
        body: form,
      });
  
      if (!response.ok) throw new Error('Upload failed');
      const updatedData = await response.json();
  
      // Ensure both states update immediately
      setFormData(prev => ({ ...prev, avatarUrl: updatedData.avatarUrl }));
      setUserData(updatedData);
    } catch (err) {
      setError(err.message);
    }
  };
  

  const handlePortfolioUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const form = new FormData();
      files.forEach(file => form.append('portfolioImages', file));
      form.append('username', formData.username);
      form.append('aboutMe', formData.aboutMe);
      form.append('profession', formData.profession);
      form.append('cvUrl', formData.cvUrl);

      const response = await fetch(`/api/users/${email}`, {
        method: 'POST',
        body: form,
      });

      if (!response.ok) throw new Error('Upload failed');
      const updatedData = await response.json();
      setFormData(prev => ({
        ...prev,
        portfolioImages: updatedData.portfolioImages
      }));
      setUserData(updatedData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const form = new FormData();
      form.append('username', formData.username);
      form.append('aboutMe', formData.aboutMe);
      form.append('profession', formData.profession);
      form.append('cvUrl', formData.cvUrl);

      const response = await fetch(`/api/users/${email}`, {
        method: 'POST',
        body: form,
      });

      if (!response.ok) throw new Error('Update failed');
      const updatedData = await response.json();
      setUserData(updatedData);
      initialFormData.current = formData;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData.current);
  };

  const handleRemovePortfolioImage = async (index) => {
    try {
      const updatedImages = formData.portfolioImages.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, portfolioImages: updatedImages }));

      const response = await fetch(`/api/users/${email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioImages: updatedImages })
      });

      if (!response.ok) throw new Error('Failed to remove image');
      const updatedData = await response.json();
      setUserData(updatedData);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (!userData) return <p>Loading...</p>;

  return (
    <section>
      <div className="max-w-lg mx-auto p-4">
        <div className="mb-4">
          <label className="block mb-2 text-gray-200">Avatar:</label>
          {formData.avatarUrl && (
            <Image 
              src={formData.avatarUrl} 
              width={96}
              height={96}
              className="w-24 h-24 rounded-full mb-2 object-cover"
              alt="Avatar preview"
            />
          )}
          <input 
            type="file" 
            accept="image/*"
            onChange={handleAvatarUpload}
            className="w-full\
            "
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-200">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="username"
            className="w-full border text-gray-200 p-2 bg-black rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-200">About Me:</label>
          <textarea
            name="aboutMe"
            value={formData.aboutMe}
            onChange={handleChange}
            className="w-full border bg-black p-2  text-gray-200 rounded h-32"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-200">Profession:</label>
          <input
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            className="w-full border bg-black text-gray-200 p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-200 mb-2">Portfolio Images:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePortfolioUpload}
            className="w-full"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.portfolioImages.map((url, index) => (
              <div key={index} className="relative">
                <Image
                  width={96}
                  height={96}
                  src={url}
                  className="w-24 h-24 object-cover rounded"
                  alt={`Portfolio item ${index + 1}`}
                />
                <button
                  onClick={() => handleRemovePortfolioImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  aria-label="Remove image"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">CV URL:</label>
          <input
            type="text"
            name="cvUrl"
            value={formData.cvUrl}
            placeholder="www.linkedin.com"
            onChange={handleChange}
            className="w-full border bg-black p-2 rounded"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}