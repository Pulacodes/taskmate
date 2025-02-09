import React from 'react'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import TaskList from '@/components/mytask/page'

const mytasks = () => {
  return (
    <section className="overflow-hidden min-h-screen bg-gradient-to-r from-neutral-600 via-gray-950 to-blue-950 py-16 md:py-20 lg:py-28" >

    <SignedIn>
      <h2 className="text-2xl text-center text-white font-bold mb-4">My Tasks</h2>
      <TaskList/>
    </SignedIn>
    <SignedOut>
      <div className=' text-center'>
      <p className='text-gray-200'> Please Sign in to access any in app features</p>
    </div>
    </SignedOut>
            
      </section>
  )
}

export default mytasks