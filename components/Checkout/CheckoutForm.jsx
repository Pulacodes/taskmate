'use client';
import { useSearchParams, useRouters } from "next/navigation";
import { useState } from "react";
import { HiX, HiLocationMarker, HiDocumentAdd } from "react-icons/hi";
import { debounce } from "lodash";


const TaskMarketplaceCheckout = () => {
  const searchParams = useSearchParams();
  const amount = parseFloat(searchParams.get("price") || "0");
  const assignedUser = searchParams.get("user") || "Someone";
  const email = searchParams.get("email");
  const taskId = searchParams.get("taskId");
  if (!taskId) {
    alert("Task ID is missing. Please try again.");
    return;
  }
  const [formData, setFormData] = useState({
    taskId,
    amount,
    assignedUser,
    taskType: "",
    address: {
      Building: "",
      Room: ""
    },
    email,
    requirements: [],
    personalInfo: {
      name: "",
      email: "",
      phone: ""
    }
  });

  const [newRequirement, setNewRequirement] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validatePhone = (phone) => {
    return phone === "" || phone.match(/^\+?[1-9]\d{1,14}$/);
  };

  const handleInputChange = debounce((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, 300);

  const addRequirement = () => {
    if (newRequirement.trim() && formData.requirements.length < 10) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.taskType) newErrors.taskType = "Please select a task type";
    if (!formData.personalInfo.name) newErrors.name = "Name is required";
    if (!formData.personalInfo.email || !validateEmail(formData.personalInfo.email)) {
      newErrors.email = "Valid email is required";
    }
    if (formData.personalInfo.phone && !validatePhone(formData.personalInfo.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (formData.requirements.length === 0) {
      newErrors.requirements = "At least one requirement is needed";
    }
    if (formData.taskType === "physical") {
      if (!formData.address.street) newErrors.street = "Street address is required";
      if (!formData.address.city) newErrors.city = "City is required";
      if (!formData.address.state) newErrors.state = "State is required";
      if (!formData.address.postalCode) newErrors.postalCode = "Postal code is required";
      if (!formData.address.country) newErrors.country = "Country is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("taskId", formData.taskId);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("amount", formData.amount);
      formDataToSend.append("taskType", formData.taskType);
      formDataToSend.append("address", JSON.stringify(formData.address));
      formDataToSend.append("requirements", JSON.stringify(formData.requirements));
      formDataToSend.append("personalInfo", JSON.stringify(formData.personalInfo));
      files.forEach(file => formDataToSend.append("files", file));

      const response = await fetch("/api/tasks/assign", {
        method: "POST",
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error("Failed to assign task");
      }
      const result = await response.json();

      alert("Task assigned successfully!");
    
    } catch (error) {
      console.error("API error:", error);
      alert("Error assigning task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-dark-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
        <h1 className="text-center text-3xl text-bold font-heading mb-8">Task Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Task Type Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Task Type</h2>
            <div className="flex space-x-4">
            <HiLocationMarker className="w-5 h-5" />
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="taskType"
                  value="remote"
                  onChange={(e) => handleInputChange("taskType", e.target.value)}
                  className="form-radio text-primary"
                />
                <span>Remote Task</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="taskType"
                  value="physical"
                  onChange={(e) => handleInputChange("taskType", e.target.value)}
                  className="form-radio text-primary"
                />
                <span>Physical Task</span>
              </label>
            </div>
            {errors.taskType && <p className="text-destructive text-sm">{errors.taskType}</p>}
          </div>

          {/* Location Details */}
          {formData.taskType === "physical" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Location Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Building Name</label>
                  <input
                    type="text"
                    placeholder="eg: Tekant 3"
                    onChange={(e) => handleInputChange("address", { ...formData.address, Building: e.target.value })}
                    className="w-full bg-dark-secondary text-dark-foreground p-2 rounded"
                  />
                  {errors.street && <p className="text-destructive text-sm">{errors.street}</p>}
                </div>
                <div>
                  <label className="block mb-2">Room number</label>
                  <input
                    type="text"
                    onChange={(e) => handleInputChange("address", { ...formData.address, Room: e.target.value })}
                    placeholder="3221"
                    className="w-full bg-dark-secondary text-dark-foreground p-2 rounded"
                  />
                  {errors.city && <p className="text-destructive text-sm">{errors.city}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Requirements Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Task Requirements</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add a requirement"
                className="flex-1 bg-dark-secondary text-dark-foreground p-2 rounded"
              />
              <button
                type="button"
                onClick={addRequirement}
                className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {formData.requirements.map((req, index) => (
                <li key={index} className="flex items-center justify-between bg-dark-secondary p-2 rounded">
                  <span>{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="text-destructive hover:text-opacity-80"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
            {errors.requirements && <p className="text-destructive text-sm">{errors.requirements}</p>}
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Additional Files</h2>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full bg-dark-secondary text-dark-foreground p-2 rounded"
            />
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-dark-secondary p-2 rounded">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-destructive hover:text-opacity-80"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  onChange={(e) => handleInputChange("personalInfo", { ...formData.personalInfo, name: e.target.value })}
                  className="w-full bg-dark-secondary text-dark-foreground p-2 rounded"
                />
                {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  onChange={(e) => handleInputChange("personalInfo", { ...formData.personalInfo, email: e.target.value })}
                  className="w-full bg-dark-secondary text-dark-foreground p-2 rounded"
                />
                {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
              </div>
              <div>
                <label className="block mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  onChange={(e) => handleInputChange("personalInfo", { ...formData.personalInfo, phone: e.target.value })}
                  className="w-full bg-dark-secondary text-dark-foreground p-2 rounded"
                  placeholder="+90 0000000000"
                />
                {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            
            className="w-full bg-primary text-primary-foreground py-3 rounded font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskMarketplaceCheckout;
