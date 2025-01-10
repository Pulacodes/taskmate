'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from "@clerk/nextjs";
import Image from 'next/image';
import Link from 'next/link';


export default function TaskDetailsPage() {
  const { user } = useUser();
  const params = useParams();
  const taskid = params?.taskid;


  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [offers, setOffers] = useState([]);
  const [showOfferBox, setShowOfferBox] = useState(false);
  const [offerText, setOfferText] = useState('');
  const [editingOffer, setEditingOffer] = useState(false);
  const [existingOffer, setExistingOffer] = useState(null);
  

  useEffect(() => {
    if (!taskid) {
      setError('Task ID is missing.');
      return;
    }
    
    const fetchTask = async () => {
      try {
        const res = await fetch(`/api/tasks/viewtask/${taskid}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch');
        }
        const data = await res.json();
        setTask(data);
        setOffers(data.offers || []);
        const userOffer = data.offers?.find((offer) => offer.userId === user?.emailAddresses[0]?.emailAddress);
        if (userOffer) setExistingOffer(userOffer);
      } catch (err) {
        setError(err.message);
      }
    };
   
    fetchTask();
     
    
  }, [taskid, user,task?.createdBy]);
  
  const handleSubmitOffer = async () => {
    if (offerText.trim() === '') {
      alert('Please write a description for your offer.');
      return;
    }

    const payload = {
      userId: user?.emailAddresses[0]?.emailAddress,
      amount: parseFloat(prompt('Enter your offer amount:', existingOffer?.amount || '0')), // Prompt for amount
      message: offerText,
    };

    const method = editingOffer ? 'Post' : 'POST';

    try {
      const response = await fetch(`/api/tasks/viewtask/${taskid}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit offer');
      }

      const updatedOffers = editingOffer
        ? offers.map((offer) => (offer.userId === user?.emailAddresses[0]?.emailAddress ? { ...offer, ...payload } : offer))
        : [...offers, payload];

      setOffers(updatedOffers);
      setOfferText('');
      setShowOfferBox(false);
      setEditingOffer(false);
      setExistingOffer(payload);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading task details...</p>
      </div>
    );
  }
  const handleAssign = (offer) => {
    const taskPrice = parseFloat(task.price); // Ensure this is the correct price
    const assignedUser = offer.userId; // User being assigned
  
    // Navigate to the checkout page
    window.location.href = `/checkout?price=${taskPrice}&user=${encodeURIComponent(assignedUser)}`;
  };
  
  const isTaskOwner = user?.emailAddresses[0]?.emailAddress === task?.user.email;
  

  const statusColor =
    task.status === 'available'
      ? 'text-green-500'
      : task.status === 'Assigned'
      ? 'text-purple-500'
      : task.status === 'Completed'
      ? 'text-red-500'
      : 'text-gray-500';

  return (
    <section className="overflow-hidden py-16 md:py-20 lg:py-28">
      
      <div className="min-h-screen bg-gray-100 py-10 px-5">
    
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="px-4 pb-6 text-center lg:pb-8">
                  <div className="relative  mx-auto w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-30 sm:max-w-30 sm:p-3">
                  <Link href={`/Profile/${task.user.email}`}>
                  <Image
                      src={task.user.avatar || '/default-avatar.svg'} // Use user avatar or a default one
                      width={100}
                      height={100}
                      alt={`${username}'s profile avatar`}
                      className='rounded-full'
                    />
                    </Link>
                  </div>
                </div>
          
                <h3 className="text-center mb-1.5 text-2xl font-semibold text-black dark:text-white">
                  {task.user.username}
                </h3>
                  
                    
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{task.title}</h1>
          <p className="text-gray-600 mb-4">{task.content}</p>
          <p className={`mb-4 font-semibold ${statusColor}`}>
            {task.status}
          </p>

          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-lg font-bold text-gray-800">
              Price: TL{task.price.toFixed(2)}
            </p>
            {!isTaskOwner && !existingOffer && (
              <button
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setShowOfferBox(true)}
              >
                Make an offer
              </button>
            )}
            
          </div>

          {showOfferBox && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-lg mb-6">
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                rows="4"
                placeholder="Explain why you are best for this task..."
                value={offerText}
                onChange={(e) => setOfferText(e.target.value)}
              ></textarea>
              <div className="flex justify-end">
                <button
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
                  onClick={handleSubmitOffer}
                >
                  {editingOffer ? 'Update Offer' : 'Submit Offer'}
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  onClick={() => {
                    setShowOfferBox(false);
                    setEditingOffer(false);
                    setOfferText('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Offers:</h2>
          {offers.length === 0 ? (
            <p className="text-gray-500">No offers have been made yet.</p>
          ) : (
            <ul className="space-y-4">
              {offers.map((offer, index) => (
                <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-md">
                  <p className="font-bold text-gray-800">{offer.userId}</p>
                  <p className="text-gray-600">{offer.message}</p>
                  {!isTaskOwner && existingOffer && (
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                onClick={() => {
                  setShowOfferBox(true);
                  setEditingOffer(true);
                  setOfferText(existingOffer.message);
                }}
              >
                Edit offer
              </button>
            )}
            {isTaskOwner &&  (
              <button
                className="bg-primary text-white px-4 py-2 absolute-left rounded-md hover:bg-gray-600"
                onClick={() => handleAssign(offer)}
              >
                Assign
              </button>
            )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}