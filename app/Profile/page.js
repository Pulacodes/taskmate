'use client';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getTaskStats } from '../../lib/Taskstats';
import ReviewsCarousel from '@/components/Review/page';

export default function ProfilePage() {
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    postedByUser: 0,
    inProgress: 0,
    completed: 0,
    totalProgressAndCompleted: 0,
  });

  useEffect(() => {
    if (!email) return;

    const fetchUserData = async () => {
      try {
        const userRes = await fetch(`/api/users/${email}`);
        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const userData = await userRes.json();
        setUserData(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      if (email) {
        const taskStats = await getTaskStats(email);
        setStats(taskStats);
      }
    };

    fetchUserData();
    fetchStats();
  }, [email]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!userData) return <p>User not found.</p>;

  const { bannerUrl, avatarUrl, username, aboutMe, portfolioImages, profession } = userData;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SignedIn>
        <div className="relative h-48 md:h-64">
          <Image
            src={bannerUrl || '/default-banner.jpg'}
            alt={`${username}'s profile cover`}
            className="h-full w-full object-cover object-center"
            width={970}
            height={260}
          />
        </div>

        <div className="px-4 pb-6 text-center">
          <div className="relative mx-auto -mt-20 h-32 w-32 rounded-full border-4 border-gray-800 bg-gray-800 p-1 sm:h-44 sm:w-44 sm:p-3">
            <Image 
                src={avatarUrl} 
                width={96}
                height={96}
                className="w-50 h-40 rounded-full mb-2 object-cover"
                alt="Avatar preview"
            />
          </div>
        </div>

        <h3 className="mb-2 text-center text-2xl font-bold">{username}</h3>
        <h3 className="mb-4 text-center text-xl text-gray-400">{profession}</h3>

        <div className="mx-auto mb-8 grid max-w-3xl grid-cols-3 rounded-lg bg-gray-800 p-4 shadow-lg">
          <div className="flex flex-col items-center justify-center border-r border-gray-700 p-4">
            <span className="text-xl font-bold">{stats.totalProgressAndCompleted}</span>
            <span className="text-sm text-gray-400">Tasks</span>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-gray-700 p-4">
            <span className="text-xl font-bold">{stats.inProgress}</span>
            <span className="text-sm text-gray-400">Assigned</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-xl font-bold">{stats.completed}</span>
            <span className="text-sm text-gray-400">Completed</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4">
          <h4 className="mb-4 text-xl font-bold">About Me</h4>
          <p className="mb-8 text-gray-300">
            {aboutMe || 'This user has not shared any information about themselves.'}
          </p>
        </div>

        <button
        className="mx-auto mb-8 w-50 flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700">
                      Edit Profile
        </button>

        <div className="mx-auto max-w-3xl px-4">
          <h4 className="mb-4 text-xl font-bold">Portfolio</h4>
          <div className="flex flex-wrap gap-4">
            {portfolioImages?.length > 0 &&
              portfolioImages.map((file, index) => {
                const isImage = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(file);
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

        <div className="mx-auto max-w-7xl px-4 py-8">
          <h2 className="mb-4 text-center text-gray-200 text-2xl font-bold">Reviews</h2>
          <ReviewsCarousel userId={email} />
        </div>
      </SignedIn>

      <SignedOut>
        <p className="text-center text-gray-400">Please sign in to access any in-app features.</p>
      </SignedOut>
    </div>
  );
}
