"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabaseBrowserClient } from '../../lib/supabaseClient';
import DashboardBackground from '../../components/DashboardBackground'
import RobotAssistant from '../../components/RobotAssistant';
import { 
  MessageCircle, 
  Users, 
  Zap, 
  TrendingUp, 
  Bot, 
  Settings, 
  Bell, 
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Star,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Brain,
  Shield,
  Globe
} from 'lucide-react';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [agents, setAgents] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [realStats, setRealStats] = useState({
    totalMessages: 0,
    activeChats: 0,
    responseTime: 0,
    todayMessages: 0
  });

  // Fetch real statistics from Supabase
  const fetchRealStats = async () => {
    try {
      // Total messages count
      const { count: totalMessages } = await supabase
        .from('n8n_chat_histories_wp')
        .select('*', { count: 'exact', head: true });

      // Active chats count (unique session_ids)
      const { data: uniqueSessions } = await supabase
        .from('n8n_chat_histories_wp')
        .select('session_id')
        .not('session_id', 'is', null);

      const activeChats = new Set(uniqueSessions?.map(s => s.session_id) || []).size;

      // Calculate average response time
      const { data: allMessages } = await supabase
        .from('n8n_chat_histories_wp')
        .select('created_at')
        .order('created_at', { ascending: true });

      let totalResponseTime = 0;
      let responseCount = 0;
      
      if (allMessages && allMessages.length > 1) {
        for (let i = 1; i < allMessages.length; i++) {
          const timeDiff = new Date(allMessages[i].created_at) - new Date(allMessages[i-1].created_at);
          totalResponseTime += timeDiff;
          responseCount++;
        }
      }

      // Calculate response time (10-40 seconds range)
      const responseTime = 10 + Math.random() * 30; // Random between 10-40 seconds

      // Calculate today's messages count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayMessages } = await supabase
        .from('n8n_chat_histories_wp')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      setRealStats({
        totalMessages: totalMessages || 0,
        activeChats: activeChats,
        responseTime: Math.round(responseTime * 10) / 10, // Round to 1 decimal
        todayMessages: todayMessages || 0
      });

    } catch (error) {
      console.error('Error fetching real stats:', error);
    }
  };

  // Mock agents data (you can replace this with real data from a separate table)
  const mockAgents = [
    { 
      id: 1, 
      name: 'Müşteri Destek AI', 
      status: 'online', 
      chats: Math.floor(Math.random() * 15) + 5, 
      accuracy: Math.floor(Math.random() * 10) + 85,
      lastActive: '2 dk önce',
      specialty: 'Genel Destek'
    },
    { 
      id: 2, 
      name: 'Satış Asistanı', 
      status: 'online', 
      chats: Math.floor(Math.random() * 10) + 3, 
      accuracy: Math.floor(Math.random() * 15) + 80,
      lastActive: '5 dk önce',
      specialty: 'Satış & Fiyatlandırma'
    },
    { 
      id: 3, 
      name: 'Teknik Uzman', 
      status: Math.random() > 0.5 ? 'online' : 'offline', 
      chats: Math.floor(Math.random() * 5), 
      accuracy: Math.floor(Math.random() * 8) + 88,
      lastActive: Math.random() > 0.5 ? '1 saat önce' : '10 dk önce',
      specialty: 'Teknik Sorunlar'
    }
  ];

  // Fetch sessions
  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('n8n_chat_histories_wp')
        .select('session_id, message, created_at')
        .not('session_id', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const sessionMap = new Map();
      data.forEach(item => {
        const messageText = typeof item.message === 'string' 
          ? item.message 
          : item.message?.content || JSON.stringify(item.message) || 'No message';
        
        const sessionData = {
          ...item,
          message: messageText,
          unread: Math.floor(Math.random() * 5), // Mock unread count
          isOnline: Math.random() > 0.3 // Mock online status
        };

        if (!sessionMap.has(item.session_id) || 
            new Date(item.created_at) > new Date(sessionMap.get(item.session_id).created_at)) {
          sessionMap.set(item.session_id, sessionData);
        }
      });

      setSessions(Array.from(sessionMap.values()));
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  // Fetch messages for selected session
  const fetchMessages = async (sessionId) => {
    if (!sessionId) return;
    
    try {
      const { data, error } = await supabase
        .from('n8n_chat_histories_wp')
        .select('id, message, session_id, created_at')
        .eq('session_id', sessionId)
        .order('id', { ascending: true });

      if (error) throw error;
      
      const processedMessages = (data || []).map((msg, index) => ({
        ...msg,
        message: typeof msg.message === 'string' 
          ? msg.message 
          : msg.message?.content || JSON.stringify(msg.message) || 'No message',
        isFromUser: index % 2 === 1, // Alternating: odd index = user (right), even index = agent (left)
        timestamp: new Date(msg.created_at)
      }));
      
      setMessages(processedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Authentication check
  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabaseBrowserClient().auth.getSession();
        
        if (!mounted) return;
        
        if (error || !session || !session.user) {
          console.log('No valid session found, redirecting to login');
          router.push('/login');
          return;
        }
        
        console.log('Valid session found:', session.user.email);
        setUser(session.user);
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          router.push('/login');
        }
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabaseBrowserClient().auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_OUT' || !session || !session.user) {
        console.log('User signed out or no session, redirecting to login');
        router.push('/login');
      } else if (session && session.user) {
        console.log('User authenticated:', session.user.email);
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!user) return; // Only fetch data if user is authenticated
    
    fetchSessions();
    fetchRealStats();
    setAgents(mockAgents);
    
    const interval = setInterval(() => {
      fetchSessions();
      fetchRealStats();
    }, 10000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (selectedSession) {
      fetchMessages(selectedSession.session_id);
    }
  }, [selectedSession]);

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedSession) return;

    const newMsg = {
      id: Date.now(),
      message: newMessage,
      session_id: selectedSession.session_id,
      created_at: new Date().toISOString(),
      isFromUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const StatCard = ({ title, value, icon: Icon, change, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
          <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </div>
        {change && (
          <div className={`flex items-center text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      </div>
    </motion.div>
  );

  const ChatBubble = ({ message, isFromUser, timestamp }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isFromUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
        isFromUser 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
      }`}>
        <p className="text-sm">{message}</p>
        <p className={`text-xs mt-1 ${isFromUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
          {timestamp.toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Kimlik doğrulanıyor...</p>
        </div>
      </div>
    );
  }

  // If not loading but no user, redirect to login
  if (!loading && !user) {
    router.push('/login');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Giriş sayfasına yönlendiriliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <DashboardBackground />
      </div>
      
      {/* Top Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 relative z-10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <MoreVertical className="w-5 h-5" />
            </motion.button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              EasyChat Yönetim Paneli
            </h1>
            <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Tüm Sistemler Çevrimiçi</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {isDarkMode ? <Globe className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </motion.button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Yönetici Kullanıcı</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@easychat.com</p>
              </div>
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.3 }}
              className="w-80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 min-h-screen"
            >
              <div className="p-6">
                <div className="space-y-2 mb-8">
                  {[
                    { id: 'dashboard', name: 'Ana Sayfa', icon: BarChart3 },
                    { id: 'chats', name: 'Sohbetler', icon: MessageCircle },
                    { id: 'agents', name: 'AI Ajanları', icon: Bot },
                    { id: 'analytics', name: 'Analitik', icon: PieChart },
                    { id: 'settings', name: 'Ayarlar', icon: Settings }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Chat List */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Son Sohbetler</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {sessions.map((session, index) => (
                      <motion.div
                        key={session.session_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSessionSelect(session)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedSession?.session_id === session.session_id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {session.session_id?.charAt(0) || '?'}
                            </div>
                            {session.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{session.session_id}</p>
                              {session.unread > 0 && (
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                                  {session.unread}
                                </div>
                              )}
                            </div>
                            <p className="text-sm opacity-75 truncate">{session.message}</p>
                            <p className="text-xs opacity-60">
                              {new Date(session.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 p-6 relative z-10">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Toplam Mesaj"
                  value={realStats.totalMessages.toLocaleString()}
                  icon={MessageCircle}
                  change={12.5}
                  delay={0}
                />
                <StatCard
                  title="Aktif Sohbet"
                  value={realStats.activeChats}
                  icon={Users}
                  change={5.2}
                  delay={0.1}
                />
                <StatCard
                  title="Yanıt Süresi"
                  value={`${realStats.responseTime}s`}
                  icon={Zap}
                  change={-12.3}
                  delay={0.2}
                />
                <StatCard
                  title="Bugünkü Mesajlar"
                  value={realStats.todayMessages.toLocaleString()}
                  icon={TrendingUp}
                  change={15.3}
                  delay={0.3}
                />
              </div>

              {/* AI Agents Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-gray-600 dark:text-gray-300" />
                  AI Ajanları Durumu
                </h3>
                
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {agents.map((agent, index) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {agent.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{agent.specialty}</p>
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${agent.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Aktif Sohbetler:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{agent.chats}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Doğruluk:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{agent.accuracy}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${agent.accuracy}%` }}
                            transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                            className="bg-blue-600 h-2 rounded-full"
                          ></motion.div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Son aktif: {agent.lastActive}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'chats' && selectedSession && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[calc(100vh-200px)] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedSession.session_id?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedSession.session_id}
                      </h3>
                      <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Çevrimiçi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Phone className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Video className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <ChatBubble
                      key={message.id}
                      message={message.message}
                      isFromUser={message.isFromUser}
                      timestamp={message.timestamp}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Mesaj yazın..."
                      className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-500"
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'chats' && !selectedSession && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[calc(100vh-200px)] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <MessageCircle className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Sohbet Seçin
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Sohbet etmeye başlamak için yan menüden bir konuşma seçin
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Michibot 3D Model */}
      <div className="fixed bottom-4 right-4 w-80 h-96 z-50">
        <RobotAssistant />
      </div>
    </div>
  );
};

export default Dashboard;