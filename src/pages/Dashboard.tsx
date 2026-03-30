import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CalendarCheck, Clock, CheckCircle2, AlertCircle, 
  DollarSign, PieChart, Users, LayoutDashboard, 
  ListTodo, MessageSquare, LogOut, PartyPopper,
  Image as ImageIcon, Plus, Trash2, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db, logOut } from '../firebase';
import { 
  collection, query, where, onSnapshot, 
  addDoc, updateDoc, deleteDoc, doc, 
  serverTimestamp, orderBy 
} from 'firebase/firestore';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [moodboards, setMoodboards] = useState<any[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingInspiration, setIsAddingInspiration] = useState(false);
  const [newInspiration, setNewInspiration] = useState({ title: '', imageUrl: '' });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const bookingsQuery = query(collection(db, 'bookings'), where('userId', '==', user.uid));
    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const tasksQuery = query(
      collection(db, 'tasks'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const moodboardsQuery = query(
      collection(db, 'moodboards'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeMoodboards = onSnapshot(moodboardsQuery, (snapshot) => {
      setMoodboards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeBookings();
      unsubscribeTasks();
      unsubscribeMoodboards();
    };
  }, [user]);

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim() || !user) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        userId: user.uid,
        text: newTaskText,
        completed: false,
        urgent: false,
        createdAt: serverTimestamp()
      });
      setNewTaskText('');
      setIsAddingTask(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), { completed: !completed });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddInspiration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInspiration.title.trim() || !newInspiration.imageUrl.trim() || !user) return;

    try {
      await addDoc(collection(db, 'moodboards'), {
        userId: user.uid,
        title: newInspiration.title,
        imageUrl: newInspiration.imageUrl,
        createdAt: serverTimestamp()
      });
      setNewInspiration({ title: '', imageUrl: '' });
      setIsAddingInspiration(false);
    } catch (error) {
      console.error("Error adding inspiration:", error);
    }
  };

  const deleteInspiration = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'moodboards', id));
    } catch (error) {
      console.error("Error deleting inspiration:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const activeBooking = bookings.find(b => b.status === 'confirmed') || bookings[0];
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalBudget = activeBooking?.estimatedCost || 5000;
  const spentBudget = activeBooking?.spent || (activeBooking ? activeBooking.estimatedCost * 0.65 : 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col sticky top-16 md:h-[calc(100vh-4rem)] z-10">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border border-gray-200" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
                {user?.displayName?.[0] || user?.email?.[0] || 'U'}
              </div>
            )}
            <div className="overflow-hidden">
              <h2 className="font-bold text-gray-900 truncate">{user?.displayName || 'User'}</h2>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'tasks', icon: ListTodo, label: 'Tasks & Timeline' },
            { id: 'moodboard', icon: ImageIcon, label: 'Mood Board' },
            { id: 'vendors', icon: Users, label: 'Vendors' },
            { id: 'budget', icon: PieChart, label: 'Budget' },
            { id: 'messages', icon: MessageSquare, label: 'Messages' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-pink-50 text-pink-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-pink-500' : 'text-gray-400'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl font-medium transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          
          {/* Dashboard Header */}
          {activeBooking ? (
            <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 opacity-20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500 opacity-20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-pink-500/20 text-pink-300 border border-pink-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {activeBooking.status} Event
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" /> 45 Days Left
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{activeBooking.eventType} Planning</h1>
                  <p className="text-gray-300 flex items-center gap-2">
                    <PartyPopper className="w-5 h-5 text-pink-400" /> 
                    {activeBooking.guestCount} Guests Expected
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[140px]">
                  <p className="text-gray-300 text-sm font-medium mb-1">Overall Progress</p>
                  <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">
                    {tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-pink-500 to-violet-600 rounded-3xl p-8 text-white shadow-xl mb-8 text-center">
              <h1 className="text-3xl font-bold mb-4">Welcome to Your Planning Hub!</h1>
              <p className="text-pink-100 mb-6">Ready to start planning your next big campus event?</p>
              <button 
                onClick={() => navigate('/services')}
                className="bg-white text-pink-600 px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Start Planning Now
              </button>
            </div>
          )}

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Quick Stats */}
                  <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Tasks Completed</p>
                        <p className="text-2xl font-bold text-gray-900">{completedTasksCount} / {tasks.length}</p>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6 text-violet-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Vendors Secured</p>
                        <p className="text-2xl font-bold text-gray-900">{activeBooking?.services?.length || 0}</p>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center shrink-0">
                        <DollarSign className="w-6 h-6 text-pink-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Budget Used</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${spentBudget.toLocaleString()} 
                          <span className="text-sm text-gray-400 font-normal">/ ${totalBudget.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Planning Timeline (Simplified for real data) */}
                  <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-bold text-gray-900">Recent Tasks</h3>
                      <button onClick={() => setActiveTab('tasks')} className="text-sm font-medium text-pink-500 hover:text-pink-600">View all &rarr;</button>
                    </div>
                    <div className="space-y-4">
                      {tasks.slice(0, 5).map((task) => (
                        <div key={task.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 bg-gray-50/50">
                          <button onClick={() => toggleTask(task.id, task.completed)}>
                            {task.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                            )}
                          </button>
                          <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                      {tasks.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No tasks yet. Start by adding one!</p>
                      )}
                    </div>
                  </div>

                  {/* Action Items */}
                  <div className="col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-rose-500" /> Urgent Items
                      </h3>
                      <div className="space-y-3">
                        {tasks.filter(t => t.urgent && !t.completed).slice(0, 3).map(task => (
                          <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg bg-rose-50 border border-rose-100">
                            <span className="text-sm font-bold text-rose-900">{task.text}</span>
                          </div>
                        ))}
                        {tasks.filter(t => t.urgent && !t.completed).length === 0 && (
                          <p className="text-sm text-gray-500 italic">No urgent items at the moment.</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-500 to-violet-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                      <h3 className="text-lg font-bold mb-2 relative z-10">Need Help?</h3>
                      <p className="text-pink-100 text-sm mb-4 relative z-10">Your dedicated event manager is Sarah. Reach out anytime.</p>
                      <button className="w-full bg-white text-violet-600 font-bold py-2 px-4 rounded-xl hover:shadow-md transition-all relative z-10">
                        Message Sarah
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'moodboard' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Event Inspiration</h3>
                      <p className="text-gray-500">Save images and links that inspire your event vibe.</p>
                    </div>
                    <button 
                      onClick={() => setIsAddingInspiration(true)}
                      className="bg-pink-50 text-pink-600 px-4 py-2 rounded-lg font-medium hover:bg-pink-100 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Inspiration
                    </button>
                  </div>

                  {isAddingInspiration && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      onSubmit={handleAddInspiration}
                      className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                          <input 
                            type="text" 
                            value={newInspiration.title}
                            onChange={(e) => setNewInspiration({ ...newInspiration, title: e.target.value })}
                            placeholder="e.g., Neon Lighting Setup"
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                          <input 
                            type="url" 
                            value={newInspiration.imageUrl}
                            onChange={(e) => setNewInspiration({ ...newInspiration, imageUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <button 
                          type="button"
                          onClick={() => setIsAddingInspiration(false)}
                          className="px-4 py-2 text-gray-500 font-medium hover:text-gray-700"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="bg-pink-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-pink-600 transition-colors"
                        >
                          Save Inspiration
                        </button>
                      </div>
                    </motion.form>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {moodboards.map((item) => (
                      <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <img 
                          src={item.imageUrl || "https://picsum.photos/seed/event/400/300"} 
                          alt={item.title}
                          className="w-full h-48 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="p-4 bg-white">
                          <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-xs text-gray-500">
                            Added on {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                          </p>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => deleteInspiration(item.id)}
                            className="p-2 bg-white/90 backdrop-blur rounded-full text-rose-500 hover:bg-rose-50 shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {moodboards.length === 0 && !isAddingInspiration && (
                      <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-gray-900 mb-1">Your Mood Board is Empty</h4>
                        <p className="text-gray-500 mb-6">Start collecting inspiration for your next big campus event.</p>
                        <button 
                          onClick={() => setIsAddingInspiration(true)}
                          className="bg-pink-500 text-white px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
                        >
                          Add First Image
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">To-Do List</h3>
                    <button 
                      onClick={() => setIsAddingTask(true)}
                      className="bg-pink-50 text-pink-600 px-4 py-2 rounded-lg font-medium hover:bg-pink-100 transition-colors"
                    >
                      + Add Task
                    </button>
                  </div>

                  {isAddingTask && (
                    <motion.form 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleAddTask}
                      className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 flex gap-3"
                    >
                      <input 
                        type="text" 
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        placeholder="What needs to be done?"
                        className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                        autoFocus
                      />
                      <button 
                        type="submit"
                        className="bg-pink-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-pink-600 transition-colors"
                      >
                        Add
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsAddingTask(false)}
                        className="text-gray-500 px-4 py-2 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </motion.form>
                  )}

                  <div className="space-y-3">
                    {tasks.map(task => (
                      <div key={task.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${
                        task.completed ? 'bg-gray-50 border-gray-100 opacity-60' : 
                        task.urgent ? 'bg-rose-50 border-rose-100' : 'bg-white border-gray-200 hover:border-pink-300'
                      }`}>
                        <button onClick={() => toggleTask(task.id, task.completed)}>
                          {task.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                          )}
                        </button>
                        <span className={`flex-1 text-lg ${
                          task.completed ? 'line-through text-gray-500' : 
                          task.urgent ? 'font-bold text-rose-900' : 'text-gray-800 font-medium'
                        }`}>
                          {task.text}
                        </span>
                        <div className="flex items-center gap-3">
                          {task.urgent && !task.completed && (
                            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Urgent</span>
                          )}
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {tasks.length === 0 && !isAddingTask && (
                      <div className="text-center py-20 text-gray-500">
                        <ListTodo className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Your task list is empty. Start planning your event!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'vendors' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Vendor Management</h3>
                  {activeBooking?.services?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeBooking.services.map((service: string, idx: number) => (
                        <div key={idx} className="p-5 rounded-xl border border-gray-100 hover:border-pink-200 hover:shadow-md transition-all group">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-sm text-pink-500 font-bold uppercase tracking-wider mb-1">{service}</p>
                              <h4 className="text-xl font-bold text-gray-900">Assigned Vendor</h4>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 bg-emerald-100 text-emerald-700">
                              <CheckCircle2 className="w-3 h-3" /> Confirmed
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                            <p className="text-gray-500 font-medium flex items-center gap-1">
                              <ExternalLink className="w-4 h-4" /> View Contract
                            </p>
                            <button className="text-sm font-medium text-violet-600 hover:text-violet-700 opacity-0 group-hover:opacity-100 transition-opacity">
                              Message Vendor &rarr;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-gray-500 border-2 border-dashed border-gray-100 rounded-3xl">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>No vendors booked yet. Check out our services to get started.</p>
                      <button 
                        onClick={() => navigate('/services')}
                        className="mt-4 text-pink-500 font-bold hover:underline"
                      >
                        Browse Services
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'budget' && (
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                      <h3 className="text-2xl font-bold text-gray-900">Budget Overview</h3>
                      <div className="bg-gray-100 px-4 py-2 rounded-xl font-bold text-gray-700">
                        Total Budget: ${totalBudget.toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <p className="text-emerald-600 font-medium mb-2 flex items-center gap-2">
                          <DollarSign className="w-5 h-5" /> Estimated Spent
                        </p>
                        <p className="text-4xl font-extrabold text-emerald-700">${spentBudget.toLocaleString()}</p>
                        <p className="text-sm text-emerald-600/80 mt-2">
                          {Math.round((spentBudget / totalBudget) * 100)}% of total budget
                        </p>
                      </div>
                      <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100">
                        <p className="text-pink-600 font-medium mb-2 flex items-center gap-2">
                          <PieChart className="w-5 h-5" /> Remaining
                        </p>
                        <p className="text-4xl font-extrabold text-pink-700">${(totalBudget - spentBudget).toLocaleString()}</p>
                        <p className="text-sm text-pink-600/80 mt-2">
                          {100 - Math.round((spentBudget / totalBudget) * 100)}% of total budget
                        </p>
                      </div>
                    </div>

                    {/* Overall Budget Progress Bar */}
                    <div className="mb-10">
                      <div className="w-full h-6 bg-gray-100 rounded-full flex overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(spentBudget / totalBudget) * 100}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="bg-emerald-500 h-full"
                        />
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${((totalBudget - spentBudget) / totalBudget) * 100}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="bg-pink-500 h-full"
                        />
                      </div>
                      <div className="flex justify-between text-sm font-bold text-gray-500 mt-3 px-2">
                        <span>{Math.round((spentBudget / totalBudget) * 100)}% Utilized</span>
                        <span>{100 - Math.round((spentBudget / totalBudget) * 100)}% Available</span>
                      </div>
                    </div>

                    {activeBooking?.services && (
                      <div className="mb-4">
                        <h4 className="font-bold text-gray-900 mb-4">Service Breakdown</h4>
                        <div className="space-y-4">
                          {activeBooking.services.map((s: string, i: number) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="w-32 text-sm font-medium text-gray-600">{s}</div>
                              <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(1 / activeBooking.services.length) * 100}%` }}
                                  transition={{ duration: 1, delay: i * 0.1 }}
                                  className={`h-full ${i % 2 === 0 ? 'bg-violet-500' : 'bg-pink-500'}`}
                                />
                              </div>
                              <div className="w-24 text-right text-sm font-bold text-gray-900">
                                ${(spentBudget / activeBooking.services.length).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                  <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Messages</h3>
                      <p className="text-sm text-gray-500">Chat with your event planning team</p>
                    </div>
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">SM</div>
                      <div className="w-8 h-8 rounded-full bg-violet-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">CV</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50/30">
                    <div className="flex justify-center">
                      <span className="bg-gray-200 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Today</span>
                    </div>
                    
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-pink-500 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">SM</div>
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-800">Hi {user?.displayName || 'there'}! I'm Sarah, your lead planner. I've seen your initial booking request for the {activeBooking?.eventType || 'event'}. How can I help you get started today?</p>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">Sarah Miller • 10:45 AM</p>
                      </div>
                    </div>

                    <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-600">
                        {user?.displayName?.[0] || 'U'}
                      </div>
                      <div className="bg-violet-600 p-4 rounded-2xl rounded-tr-none shadow-md text-white">
                        <p className="text-sm">Thanks Sarah! I'm really excited about this. I've just added some inspiration to my mood board. Can you take a look?</p>
                        <p className="text-[10px] text-violet-200 mt-2 font-medium text-right">You • 10:48 AM</p>
                      </div>
                    </div>

                    <div className="flex gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-pink-500 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">SM</div>
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-800">Absolutely! I'll check those out right now and start matching them with our vendors. I'll get back to you by the end of the day with some options.</p>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">Sarah Miller • 10:50 AM</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                      />
                      <button className="bg-gradient-to-r from-pink-500 to-violet-600 text-white p-3 rounded-xl hover:shadow-lg transition-all">
                        <MessageSquare className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
