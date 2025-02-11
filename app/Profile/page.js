'use client';
import { SignedIn, SignedOut } from '@clerk/nextjs'
import Image from "next/image";
import  EditProfile from "../../components/editprofile/page" 
import { useState, useEffect } from "react";
import ReviewsCarousel from '@/components/Review/page';
import Review from "@/components/Review/Averagerating/page"
import { useUser } from "@clerk/nextjs";


export default function ProfilePage() {
 const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added to handle errors
  const [editing, setEditing] = useState(false);


  useEffect(() => {
    if (!email) return;

    // Fetch user data and related information
    const fetchData = async () => {
      try {
        // Fetch user data
        const userRes = await fetch(`/api/users/${email}`);
        if (!userRes.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userRes.json();

        // Set state with fetched data
        setUserData(userData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err) {
        setError(err.message); // Capture the error
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    fetchData();
  }, [email]);

  if (loading) return <div className="flex items-center text-white justify-center h-screen bg-gray-900">
  <p>Loading...</p>
</div>;
  if (error) return <p>Error: {error}</p>;
  if (!userData) return <p>User not found.</p>;
  const handleEditClick = () => setEditing(true);

  // Destructure user data
  const { bannerUrl, avatarUrl, username, aboutMe, tasks, assignedTasks, completedTasks, portfolioImages } = userData;

  return (
    <div className="mx-auto min-h-screen ">
      <SignedIn>
        {/* Profile Banner */}
      <div className="relative z-20 h-35 md:h-65">
        <Image
          src={bannerUrl || '/default-banner.jpg'} // Use user banner or a default one
          alt={`${username}'s profile cover`}
          className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          width={970}
          height={260}
        />
      </div>

      {/* Profile Avatar */}
      <div className="px-4 pb-6 text-center lg:pb-8">
        <div className="relative z-30 mx-auto -mt-22 h-full w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
          <Image
            src={avatarUrl || '/default-avatar.svg'} 
            className='rounded-full'
            width={160}
            height={160}
            alt={`${username}'s profile avatar`}
          />
        </div>
      </div>
            {editing && (
          <EditProfile/>
        )}

      <h3 className="text-center mb-1.5 text-2xl font-semibold text-black dark:text-white">
        {username}
        
      </h3>
      <h3 className="text-center mb-1.5 text-2xl font-semibold text-black dark:text-white">
        {userData.profession}
        
      </h3>
      <div className="flex items-center justify-center">
        <h3 className="text-center mx-auto mb-5 mt-4.5 text-2xl font-semibold text-black dark:text-white">
          <Review userId={email} />
        </h3>
      </div>

      {/* User Stats */}
      <div className="mx-auto mb-5.5 mt-4.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
        
        <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
          <span className="font-semibold text-black dark:text-white">
            {tasks || 0}
          </span>
          <span className="text-sm">Tasks</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
          <span className="font-semibold text-black dark:text-white">
            {assignedTasks || 0}
          </span>
          <span className="text-sm">Assigned</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
          <span className="font-semibold text-black dark:text-white">
            {completedTasks || 0}
          </span>
          <span className="text-sm">Completed</span>
        </div>
      </div>

      {/* About Me Section */}
      <div className="mx-auto max-w-180">
        <h4 className="font-semibold text-black dark:text-white">
          About Me
        </h4>
        <p className="mt-4.5 mb-15">
          {aboutMe || 'This user has not shared any information about themselves.'}
        </p>
      </div>
                    <button onClick={handleEditClick} className="mt-4 flex justify-end items-left p-2 bg-blue-500 text-white rounded">Edit Profile</button>  

      <div className="flex relative px-4 pb-6 mx-auto space-x-2">
      <h4 className="font-semibold text-black dark:text-white">
        
          PORTFOLIO:
        </h4><br/>
  {portfolioImages?.length > 0 && portfolioImages.map((file, index) =>  {
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

      {/* Reviews */}
      <div className="mb-6 text-center">
        <h2 className="text-xl text-center font-semibold">Reviews</h2>
        <ReviewsCarousel userId={email} />
      </div>

      </SignedIn>
      <SignedOut>
       <p className='text-gray-800'> Please Sign in to access any in app features</p>
      </SignedOut>

      
    </div>
  );
}