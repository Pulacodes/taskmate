'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ReviewsCarousel from '@/components/Review/page';
import { useParams } from 'next/navigation';
import Review from "@/components/Review/Averagerating/page"



export default function ProfilePage() {
  const params = useParams();
  const email = params?.email; // Extract `userid` safely
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added to handle errors

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
      } catch (err) {
        setError(err.message); // Capture the error
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    fetchData();
  }, [email]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!userData) return <p>User not found.</p>;

  // Destructure user data
  const { bannerUrl, avatarUrl, username, aboutMe, tasks, assignedTasks, completedTasks } = userData;

  return (
    <div className="mx-auto min-h-screen ">

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
        <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
          <Image
            src={avatarUrl || '/default-avatar.svg'} 
            className='rounded-full'
            width={160}
            height={160}
            alt={`${username}'s profile avatar`}
          />
        </div>
      </div>

      <h3 className="text-center mb-1.5 text-2xl font-semibold text-black dark:text-white">
        {username}
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

      {/* Reviews */}
      <div className="mb-6 text-center">
        <h2 className="text-xl text-center font-semibold">Reviews</h2>
        <ReviewsCarousel userId={email} />
      </div>
    </div>
  );
}
