import React from 'react'
import TaskList from '@/components/mytask/page'

const mytasks = () => {
  return (
    <section className="overflow-hidden py-16 md:py-20 lg:py-28" >
            <h2 className="text-2xl text-center font-bold mb-4">My Accepted Tasks</h2>
      <TaskList/>
      </section>
  )
}

export default mytasks