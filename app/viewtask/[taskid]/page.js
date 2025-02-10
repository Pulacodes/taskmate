'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Review from "@/components/Review/Averagerating/page"
import dynamic from 'next/dynamic';
import TaskCompletion from "../../../components/TaskCompletion/TaskCompletion"; 
import ReviewForm from '../../../components/reviewform';
import loadingAnimation from "@/public/Animation.json";
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
const Lottie = dynamic(
  () => import('lottie-react'),
  { ssr: false }
);

export default function TaskDetailsPage() {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const taskid = params?.taskid;


  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [offers, setOffers] = useState([]);
  const [showOfferBox, setShowOfferBox] = useState(false);
  const [offerText, setOfferText] = useState('');
  const [loading, setLoading] = useState(true);
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
      finally {
        setLoading(false); // Ensure loading state is updated
      }
    };
   
    fetchTask();
     
    
  }, [taskid, user,task?.createdBy]);
  if (loading) return <div className="flex items-center justify-center h-screen bg-gray-900">
  <Lottie animationData={loadingAnimation} loop={true} className="w-52 h-52" />
</div>;
  const handleSubmitOffer = async () => {
    if (offerText.trim() === '') {
      alert('Please write a description for your offer.');
      return;
    }

    const payload = {
      userId: user?.emailAddresses[0]?.emailAddress,
      name : user?.username,
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
    const assignedUser = offer.name; // User being assigned
    const assignedemail = offer.userId;
  
    // Navigate to the checkout page
    router.push(`/checkout?price=${taskPrice}&user=${encodeURIComponent(assignedUser)}&taskId=${taskid}&email=${assignedemail}`);
  };
  
  const isTaskOwner = user?.emailAddresses[0]?.emailAddress === task?.user.email;
  

  const statusColor =
    task.status === 'available'
      ? 'text-blue-500'
      : task.status === 'assigned'
      ? 'text-yellow-500'
      : task.status === 'complete'
      ? 'text-success'
      : 'text-gray-500';

  return (
    <section className="overflow-hidden py-16 md:py-20 lg:py-28 bg-[url('/taskback.jpg')]">
      
        <div className="overflow-hidden min-h-screen backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 py-16 md:py-20 lg:py-28">
          <div className="px-4 pb-6 text-center lg:pb-8">
                  <div className="relative  mx-auto w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-30 sm:max-w-30 sm:p-3">
                  <Link href={`/Profile/${task.user.email}`}>
                  <Image
                      src={task.user.avatar || '/default-avatar.svg'} // Use user avatar or a default one
                      width={100}
                      height={100}
                      alt={`${task.user.username}'s profile avatar`}
                      className='rounded-full'
                    />
                    </Link>
                  </div>
                  
                </div>
          
                <h3 className="text-center mb-1.5 text-2xl font-semibold text-white dark:text-white">
                  {task.user.username}
                </h3>
                  
                    
          <h1 className="text-3xl text-center font-bold text-gray-200 mb-4">{task.title}</h1>
          <div className="flex relative px-4 pb-6 mx-auto space-x-2">
  {task.files?.map((file, index) => {
    const isImage = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(file); // Check if it's an image

    return isImage ? (
      <Image
        key={index}
        src={file}
        width={150}
        height={150}
        alt="Task image"
        className="rounded-lg object-cover"
      />
    ) : (
      <div
        key={index}
        className="flex items-center space-x-2 bg-gray-800 text-white p-2 rounded-lg"
      >
        <span className="truncate max-w-[100px]">{file.split('/').pop()}</span>
        <a
          href={file}
          download
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Download
        </a>
      </div>
    );
  })}
</div>

          <p className=" text-center text-gray-400 mb-4">{task.content}</p>
          

          {task.status === 'available' ? ( 
            <div>
            <div className="flex items-center justify-between  p-4 rounded-lg mb-6">
            <p className="text-lg font-bold text-center text-white">
              Budget Price: TL{task.price.toFixed(2)}
            </p>
            <SignedIn>
            {!isTaskOwner && !existingOffer && (
              <button
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setShowOfferBox(true)}
              >
                Make an offer
              </button>
            )}
      </SignedIn>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <div className='tex-white bg-white border-lg '><SignInButton /> to bid</div>
        
      </SignedOut>
            
            
          </div>

          {showOfferBox && (
            <div className="backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 p-4 rounded-lg shadow-lg mb-6">
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                rows="4"
                placeholder="Explain why you are best for this task..."
                value={offerText}
                onChange={(e) => setOfferText(e.target.value)}
              ></textarea>
              <div className="flex justify-end ">
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
          
          <h2 className="text-2xl font-bold text-gray-200 mb-4 flex items-center justify-between  p-4 rounded-lg mb-6">Offers:</h2>
          <p className={`mb-4 font-bold flex items-center justify-between  p-4 rounded-lg mb-6 ${statusColor}`}>
           Status: {task.status}
          </p>
          {offers.length === 0 ? (
            <p className="text-gray-300 text-center">No offers have been made yet.</p>
          ) : (
            <ul className="space-y-4">
              {offers.map((offer, index) => (
                <li key={index} className="bg-gray-800 bg-opacity-65 p-4 rounded-lg shadow-md">
                  <Link href={`/Profile/${offer.userId}`}>
          
                  <div className="flex items-center p-4 border-b border-transparent">
                 
                  <Image
                      src={offer.avatar || '/default-avatar.svg'} // Use user avatar or a default one
                      width={40}
                      height={40}
                      alt={`${offer.userId}'s profile avatar`}
                      className='rounded-full mr-5'
                    />
                    <p className="text-bold text-gray-200 mr-5 font-semibold">{offer.name}</p>
                    <p><Review userId={offer.userId}/></p>
                  </div>
                
                  </Link>
                  <br/>
                  <p className="text-gray-400 font-bold text-2xl text-center">Bid: TL{offer.amount}</p>
                  <p className="text-gray-200 text-center">{offer.message}</p>
                  
            {isTaskOwner &&  (
              <button
                className="bg-primary text-white px-4 py-2 absolute-left flex items-end justify-between rounded-md hover:bg-blue-600"
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

          ) : task.status === 'complete' && !isTaskOwner ? ( <ReviewForm userId={task.user.email} username={task.user.username}/>): 
           task.status === 'complete' && isTaskOwner ? (   
           <><div className="flex relative px-4 pb-6 mx-auto space-x-2">
              {task.image && (
  (() => {
    const file = task.image;
    const isImage = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(file); // Check if it's an image

    return isImage ? (
      <Image
        src={file}
        width={150}
        height={150}
        alt="Task image"
        className="rounded-lg object-cover"
      />
    ) : (
      <div className="flex items-center space-x-2 bg-gray-800 text-white p-2 rounded-lg">
        <span className="truncate max-w-[100px]">{file.split('/').pop()}</span>
        <a
          href={file}
          download
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Download
        </a>
      </div>
    );
  })()
)}

            </div><ReviewForm userId={task.offers.userId} username={task.offers[0].name} /></>): isTaskOwner ?
            ( <p className="text-gray-400 font-bold text-2xl text-center">Task in progress... </p> ):
            (<TaskCompletion 
            taskId={task._id} 
            initialRequirements={task.requirements} 
            initialStatus={task.status}
            price={task.price}
          />
          )}
        </div>
      
    </section>
  );
}