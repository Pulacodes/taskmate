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
  const [pHolder, setPlaceHolder] = useState(true)
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
  const { bannerUrl, avatarUrl, username, aboutMe, tasks, assignedTasks, completedTasks, portfolioImages } = userData;

  return (
    <div className="mx-auto min-h-screen bg-gray-900 text-white">

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

      <h3 className="mb-2 text-center text-2xl font-bold">{username}</h3>
        <h3 className="mb-4 text-center text-xl text-gray-400">{userData.profession}</h3>

      <div className="flex items-center justify-center">
        <h3 className="text-center mx-auto mb-5 mt-4.5 text-2xl font-semibold text-black dark:text-white">
          <Review userId={email} />
        </h3>
      </div>

      {/* User Stats */}
        <div className="mx-auto mb-8 grid max-w-3xl grid-cols-3 rounded-lg bg-gray-800 p-4 shadow-lg">
          <div className="flex flex-col items-center justify-center border-r border-gray-700 p-4">
            <span className="text-xl font-bold">{tasks || 0}</span>
            <span className="text-sm text-gray-400">Tasks</span>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-gray-700 p-4">
            <span className="text-xl font-bold">{assignedTasks || 0}</span>
            <span className="text-sm text-gray-400">Assigned</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-xl font-bold">{completedTasks || 0}</span>
            <span className="text-sm text-gray-400">Completed</span>
          </div>
        </div>

      {/* About Me Section */}
      <div className="mx-auto max-w-3xl px-4">
          <h4 className="mb-4 text-xl font-bold">About Me</h4>
          <p className="mb-8 text-gray-300">
            {aboutMe || 'This user has not shared any information about themselves.'}
          </p>
        </div>


      {/* Portfolio Section */}
              <div className="mx-auto max-w-3xl px-4">
                <h4 className="mb-4 text-xl font-bold">Portfolio</h4>
                {pHolder && (
                  <div className="flex flex-wrap gap-4">
                    <Image
                          src={"/placeholder.jpg"}
                          width={150}
                          height={150}
                          alt="Portfolio image"
                          className="rounded-lg object-cover"
                        />
                  </div>
                )

                }
                <div className="flex flex-wrap gap-4">
                  {portfolioImages?.length > 0 &&
                    portfolioImages.map((file, index) => {
                      const isImage = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(file);
                      setPlaceHolder(false);
                      return isImage ? (
                        <Image
                          key={index}
                          src={file}
                          width={150}
                          height={150}
                          alt="Portfolio image"
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div
                          key={index}
                          className="flex items-center space-x-2 rounded-lg bg-gray-800 p-2"
                        >
                          <span className="max-w-[100px] truncate text-gray-300">{file.split('/').pop()}</span>
                          <a
                            href={file}
                            download
                            className="rounded bg-blue-600 px-3 py-1 text-white transition hover:bg-blue-700"
                          >
                            Download
                          </a>
                        </div>
                      );
                    })}
                </div>
              </div>

      {/* Reviews Section */}
              <div className="mx-auto max-w-auto px-4 py-8">
                <h2 className="mb-4 text-center text-gray-200 text-2xl font-bold">Reviews</h2>
                <ReviewsCarousel userId={email} />
              </div>
    </div>
  );
}
