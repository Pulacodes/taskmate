'use client';
import { useParams, useRouter } from 'next/navigation';
import Review from "@/components/Review/Averagerating/page"
import TaskCompletion from "../../../components/TaskCompletion/TaskCompletion"; 
import ReviewForm from '../../../components/reviewform';
import { useEffect, useState } from 'react';
import { FiClock, FiDollarSign, FiFileText, FiUpload } from "react-icons/fi";
import { BsCardImage, BsBriefcase, BsCalendar } from "react-icons/bs";
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';


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
  const [bidAmount, setbidAmount] = useState('');
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
  
        // Check user only after data is set
        if (user) {
          const userOffer = data.offers?.find((offer) => offer.userId === user?.emailAddresses[0]?.emailAddress);
          if (userOffer) setExistingOffer(userOffer);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTask();
  }, [taskid, user]);
  
  if (loading) return <div className="flex items-center justify-center text-white h-screen bg-gray-900">
    <p>Loading</p>
</div>;
  const handleSubmitOffer = async () => {
    if (offerText.trim() === '') {
      alert('Please write a description for your offer.');
      return;
    }

    const payload = {
      userId: user?.emailAddresses[0]?.emailAddress,
      avatar: user?.avatar,
      name : user?.username,
      amount: parseFloat(bidAmount), // Prompt for amount
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
      setbidAmount('');
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
  
  const isTaskOwner = user?.emailAddresses[0]?.emailAddress === task?.user?.email;


  return (
    <section className="overflow-hidden py-16 md:py-20 lg:py-28 bg-gradient-to-br from-dark-primary/10 to-transparent bg-gray-900">
      
       <div className="max-w-7xl mx-auto">
          {/* Task Header */}
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-heading text-4xl text-center font-bold  text-lg font-heading text-gray-200 mb-4">{task.title}</h1>
          <div className="flex flex-wrap items-center text-center gap-4 mb-4">
            <div className="flex items-center text-center text-gray-400">
              <BsBriefcase className="mr-2 text-blue-400" />
              <span>{task.category}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <FiDollarSign className="mr-2 text-green" />
              <span>{task.price}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <FiClock className="mr-2" />
              <span>{task.createdAt}</span>
            </div>
          </div>
          <h2 className='text-white '>Description:</h2>
          <p className="text-body text-gray-400 mb-4">{task.content}</p>
          
        </div>

        {/*Project Files*/}
        <div className="flex bg-gray-800/60 backdrop-blur-lg relative px-4 pb-6 mx-auto space-x-2">
  <h2 className="text-xl font-heading text-gray-200 mb-4">Project Files:</h2>
  {task.files?.length > 0 &&
    task.files.map((file, dox) => {
      const isImage = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(file); // Check if it's an image

      return isImage ? (
        <div
          key={dox} // Moved the key here
          className="rounded-lg shadow-sm p-6 mb-6"
        >
          <div className="flex overflow-x-auto gap-4 pb-4">
            <Image
              src={file}
              width={150}
              height={150}
              alt="Project Image"
              className="w-48 h-32 object-cover rounded-lg"
            />
          </div>
        </div>
      ) : (
        <div
          key={dox} // Key remains here for non-image files
          className="flex items-center overflow-x-auto space-x-2 bg-gray-800 text-white p-2 rounded-lg"
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

    <br/>
          
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={task.user.avatar}
              alt={task.user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
            <Link href={`/Profile/${task.user.email}`} >
              <h3 className="font-heading text-gray-200">{task.user.username}</h3>
              </Link>
              <div className="flex items-center gap-4 text-gray-400">
                <span><Review userId={task.user.email}/></span>
              </div>
            </div>
          </div>
        </div>

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
            <div className="bg-card rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-heading text-gray-400 mb-6">Submit Your Proposal</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">Bid Amount</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setbidAmount(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your bid amount"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Proposal</label>
                <textarea
                  value={offerText}
                  onChange={(e) => setOfferText(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-ring h-32"
                  placeholder="Write your proposal here"
                  required
                />
              </div>
  
              <div className="flex gap-4">
                <button
                  onClick={handleSubmitOffer}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Submit Bid
                </button>
                <button
                  onClick={() => {
                      setShowOfferBox(false);
                      setEditingOffer(false);
                      setOfferText('');
                    }}
                  className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          )}
         
          <h2 className="text-2xl font-bold text-gray-200 mb-4 flex items-center justify-between  p-4 rounded-lg mb-6">Offers:</h2>
          
          {offers.length === 0 ? (
            <p className="text-gray-300 text-center">No offers have been made yet.</p>
          ) : (
          <ul className="space-y-4">
            {offers.map((offer, index) => (
              <li key={index} className="bg-gray-800 bg-blur/80 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-4">
                  <Image src={offer.avatar} width={50} height={50} alt={`${offer.userId}'s profile avatar`} className="rounded-full" />
                  <div>
                    <p className="text-lg font-semibold text-gray-200">{offer.name}</p>
                    <p className="text-sm text-gray-400"><Review userId={offer.userId} /></p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-400">
                  <FiDollarSign className="mr-2 text-green" />
                  <span>{offer.amount}</span><br/>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <p className="mt-2 text-gray-300">{offer.message}</p>
                  <Link href={`/Profile/${offer.userId}`} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  View profile
                  </Link>
                  {isTaskOwner && (
                     <button className="bg-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300" onClick={() => handleAssign(offer)}>
                      Assign
                     </button>
                     )}
                </div>
              </li>
              ))}
          </ul>
          )}
        </div>

          ) : task.status === 'complete' && !isTaskOwner ? (
            <ReviewForm userId={task.user.email} username={task.user.username} />
          ) : task.status === 'complete' && isTaskOwner ? (
            <div>
              <h2 className="text-white mb-4">Proof of Completion:</h2>
              <div className="flex flex-wrap px-4 pb-6 mx-auto gap-4">
                {task.image ? (
                  (() => {
                    const file = task.image;
                    const isImage = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(file);
                    return isImage ? (
                      <Image
                        src={file}
                        width={150}
                        height={150}
                        alt="Proof of completion image"
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
                ) : (
                  <p className="text-gray-400">No proof of completion uploaded.</p>
                )}
              </div>
              <ReviewForm userId={task.offers?.[0]?.userId} username={task.offers?.[0]?.name} />
            </div>
          ) : isTaskOwner ? (
            <p className="text-gray-400 font-bold text-2xl text-center">Task in progress...</p>
          ) : (
            <TaskCompletion
              taskId={task._id}
              initialRequirements={task.requirements}
              initialStatus={task.status}
              price={task.price}
            />
          )
            }
        </div>
      
    </section>
  );
}