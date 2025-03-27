export async function getTaskStats(email) {
    try {
      const res = await fetch('/api/tasks/mytasks', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const tasks = await res.json();
  
      const postedByUser = tasks.filter(task => task.user.email === email).length;
      const inProgress = tasks.filter(task => task.AssignedTo === email && task.status === 'assigned').length;
      const completed = tasks.filter(task => task.AssignedTo === email && task.status === 'complete').length;
      const totalProgressAndCompleted = inProgress + completed;
  
      return {
        postedByUser,
        inProgress,
        completed,
        totalProgressAndCompleted,
      };
    } catch (error) {
      console.error('Error fetching task stats:', error);
      return {
        postedByUser: 0,
        inProgress: 0,
        completed: 0,
        totalProgressAndCompleted: 0,
      };
    }
  }
  