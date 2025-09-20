'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabaseBrowserClient } from '../lib/supabaseClient';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  MessageCircle, 
  Star,
  Activity,
  PieChart,
  Calendar,
  Zap
} from 'lucide-react';

export default function AnalyticsSection() {
  const [analyticsData, setAnalyticsData] = useState({
    dailyMessages: 0,
    weeklyMessages: 0,
    monthlyMessages: 0,
    activeUsers: 0,
    avgResponseTime: 0,
    satisfactionRate: 0,
    messageTraffic: [],
    popularQuestions: [],
    aiAccuracy: 0,
    totalSessions: 0,
    resolvedIssues: 0,
    avgSessionDuration: 0
  });
  const [loading, setLoading] = useState(false); // Geçici olarak false yapalım
  const [timeRange, setTimeRange] = useState('daily');

  const fetchAnalyticsData = async () => {
    try {
      console.log('🔍 Fetching analytics data...');
      const supabase = supabaseBrowserClient();
      
      // Get current date ranges
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Fetch message counts for different periods
      const [dailyResult, weeklyResult, monthlyResult, allMessagesResult] = await Promise.all([
        supabase
          .from('n8n_chat_histories_wp')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString()),
        
        supabase
          .from('n8n_chat_histories_wp')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', weekAgo.toISOString()),
        
        supabase
          .from('n8n_chat_histories_wp')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', monthAgo.toISOString()),
        
        supabase
          .from('n8n_chat_histories_wp')
          .select('id, message, session_id, created_at')
          .order('created_at', { ascending: false })
          .limit(1000)
      ]);

      const dailyMessages = dailyResult.count || 0;
      const weeklyMessages = weeklyResult.count || 0;
      const monthlyMessages = monthlyResult.count || 0;
      const allMessages = allMessagesResult.data || [];

      // Calculate active users (unique session_ids)
      const uniqueSessions = new Set(allMessages.map(msg => msg.session_id)).size;

      // Calculate average response time (mock calculation)
      const avgResponseTime = 15 + Math.random() * 25; // 15-40 seconds

      // Calculate satisfaction rate (mock)
      const satisfactionRate = 85 + Math.random() * 15; // 85-100%

      // Calculate AI accuracy (mock)
      const aiAccuracy = 92 + Math.random() * 8; // 92-100%

      // Generate message traffic data for the last 7 days
      const messageTraffic = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        
        const dayMessages = allMessages.filter(msg => {
          const msgDate = new Date(msg.created_at);
          return msgDate >= dayStart && msgDate < dayEnd;
        }).length;

        messageTraffic.push({
          date: dayStart.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }),
          count: dayMessages
        });
      }

      // Generate popular questions (mock data)
      const popularQuestions = [
        { question: 'Fiyat bilgisi alabilir miyim?', count: 45 },
        { question: 'Nasıl kayıt olabilirim?', count: 38 },
        { question: 'Teknik destek alabilir miyim?', count: 32 },
        { question: 'Ürün özellikleri neler?', count: 28 },
        { question: 'İade politikası nedir?', count: 25 }
      ];

      // Calculate additional metrics
      const totalSessions = uniqueSessions;
      const resolvedIssues = Math.floor(uniqueSessions * 0.78); // 78% resolution rate
      const avgSessionDuration = 8 + Math.random() * 12; // 8-20 minutes

      setAnalyticsData({
        dailyMessages,
        weeklyMessages,
        monthlyMessages,
        activeUsers: uniqueSessions,
        avgResponseTime: Math.round(avgResponseTime * 10) / 10,
        satisfactionRate: Math.round(satisfactionRate * 10) / 10,
        messageTraffic,
        popularQuestions,
        aiAccuracy: Math.round(aiAccuracy * 10) / 10,
        totalSessions,
        resolvedIssues,
        avgSessionDuration: Math.round(avgSessionDuration * 10) / 10
      });

      console.log('✅ Analytics data fetched successfully');
    } catch (error) {
      console.error('❌ Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchAnalyticsData(); // Geçici olarak devre dışı
  }, []);

  const MetricCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${trend.isPositive ? '' : 'rotate-180'}`} />
            {trend.value}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{title}</p>
    </motion.div>
  );

  // Geçici olarak loading state'i kaldırdık

  return (
    <div className="h-[calc(100vh-200px)] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analitik Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">Sistem performansı ve kullanıcı etkileşimleri</p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {['daily', 'weekly', 'monthly'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {range === 'daily' ? 'Günlük' : range === 'weekly' ? 'Haftalık' : 'Aylık'}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Günlük Mesajlar"
            value={analyticsData.dailyMessages}
            icon={MessageCircle}
            color="bg-blue-500"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Aktif Kullanıcılar"
            value={analyticsData.activeUsers}
            icon={Users}
            color="bg-green-500"
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Ortalama Yanıt Süresi"
            value={`${analyticsData.avgResponseTime}s`}
            icon={Clock}
            color="bg-orange-500"
            trend={{ value: -5, isPositive: true }}
          />
          <MetricCard
            title="Memnuniyet Oranı"
            value={`%${analyticsData.satisfactionRate}`}
            icon={Star}
            color="bg-purple-500"
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Message Traffic Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Mesaj Trafiği</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-end space-x-2">
              {analyticsData.messageTraffic.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="bg-indigo-500 rounded-t-lg w-full transition-all duration-500 hover:bg-indigo-600"
                    style={{ height: `${(item.count / Math.max(...analyticsData.messageTraffic.map(d => d.count))) * 200}px` }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">{item.date}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AI Performansı</h3>
              <Zap className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Doğruluk Oranı</span>
                <span className="font-semibold text-gray-900 dark:text-white">%{analyticsData.aiAccuracy}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${analyticsData.aiAccuracy}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Çözülen Sorunlar</span>
                <span className="font-semibold text-gray-900 dark:text-white">{analyticsData.resolvedIssues}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(analyticsData.resolvedIssues / analyticsData.totalSessions) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Popular Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">En Popüler Sorular</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.popularQuestions.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-900 dark:text-white flex-1">{item.question}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(item.count / Math.max(...analyticsData.popularQuestions.map(q => q.count))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
