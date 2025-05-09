import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/AppSidebar";
import { useProfile } from "@/contexts/profile-context";
import { 
  BrainCircuit, BookOpen, ClipboardCheck, LineChart as LineChartIcon, Box, FileText, Gamepad2, 
  User, Settings, LogOut, Bell, Award, Home
} from "lucide-react";
import { ProgressManager } from "@/utils/progress-manager";
import { LineChart as ProgressLineChart, BarChart } from "@/components/Charts";
import { PieChart } from "@/components/Charts/PieChart";

const Dashboard = () => {
  const { profile, loading } = useProfile();
  const [userProgress, setUserProgress] = useState(ProgressManager.getProgress());
  const navigate = useNavigate();

  useEffect(() => {
    // Update streak and stats on login
    const progress = ProgressManager.updateStreak();
    setUserProgress(progress);

    // Set up an interval to check and update progress every minute
    const intervalId = setInterval(() => {
      const currentProgress = ProgressManager.getProgress();
      setUserProgress(currentProgress);
    }, 60000); // Check every minute

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Add event listener for visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const progress = ProgressManager.getProgress();
        setUserProgress(progress);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Analytics section
  const analyticsSection = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={Object.entries(userProgress.weeklyStats).map(([day, count]) => ({
              name: day,
              value: count
            }))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(userProgress.subjectProgress).map(([subject, data]) => (
              <div key={subject}>
                <div className="flex items-center justify-between mb-1">
                  <span className="capitalize">{subject}</span>
                  <span>{data.completed}/{data.total}</span>
                </div>
                <Progress 
                  value={(data.completed / data.total) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Calculate progress percentage
  const progressPercentage = (userProgress.xp / userProgress.totalXp) * 100;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <AppSidebar />
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/settings')}
              >
                <User className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-mathmate-300/20 to-mathmate-400/20 dark:from-mathmate-800/50 dark:to-mathmate-900/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Welcome back, {loading ? "..." : (profile?.full_name || "User")}!
                    </h2>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Continue your math learning journey. You're making great progress!
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs py-1">
                      {userProgress.streak} Day Streak 🔥
                    </Badge>
                    <Button 
                      className="bg-mathmate-300 hover:bg-mathmate-400 text-white"
                      onClick={() => navigate('/problem-solver')}
                    >
                      Solve Problems
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Level {userProgress.level}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{userProgress.xp}/{userProgress.totalXp} XP</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" indicatorClassName="bg-mathmate-400" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Problems Solved</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {userProgress.problemsSolved}/{userProgress.totalProblems}
                      </span>
                    </div>
                    <Progress 
                      value={(userProgress.problemsSolved / userProgress.totalProblems) * 100} 
                      className="h-2" 
                      indicatorClassName="bg-green-500" 
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quizzes Passed</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {userProgress.quizzesPassed}/{userProgress.totalQuizzes}
                      </span>
                    </div>
                    <Progress 
                      value={(userProgress.quizzesPassed / userProgress.totalQuizzes) * 100} 
                      className="h-2" 
                      indicatorClassName="bg-blue-500" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {userProgress.recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-mathmate-100 dark:bg-mathmate-700 rounded-full">
                        {activity.type === "quiz" && <BookOpen className="h-4 w-4 text-mathmate-500 dark:text-mathmate-300" />}
                        {activity.type === "problem" && <BrainCircuit className="h-4 w-4 text-mathmate-500 dark:text-mathmate-300" />}
                        {activity.type === "visualizer" && <LineChartIcon className="h-4 w-4 text-mathmate-500 dark:text-mathmate-300" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>{activity.date}</span>
                          {activity.score && (
                            <>
                              <span className="mx-1">•</span>
                              <span>Score: {activity.score}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {userProgress.achievements.map((achievement, index) => (
                    <div key={index} className={`p-2 rounded-lg flex flex-col items-center justify-center ${achievement.earned ? 'bg-mathmate-100 dark:bg-mathmate-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <Award className={`h-6 w-6 ${achievement.earned ? 'text-mathmate-500 dark:text-mathmate-300' : 'text-gray-400 dark:text-gray-600'}`} />
                      <p className={`text-xs text-center mt-1 ${achievement.earned ? 'font-medium text-mathmate-600 dark:text-mathmate-200' : 'text-gray-500 dark:text-gray-400'}`}>
                        {achievement.name}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Activity Distribution</CardTitle>
                <CardDescription>Your learning activities breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <PieChart
                    data={[
                      { name: 'Problems', value: userProgress.problemsSolved },
                      { name: 'Quizzes', value: userProgress.quizzesPassed },
                      { name: 'Games', value: userProgress.recentActivity.filter(a => a.type === 'game').length },
                      { name: 'Visualizations', value: userProgress.recentActivity.filter(a => a.type === 'visualizer').length }
                    ]}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>XP Growth</CardTitle>
                <CardDescription>Last 6 days progression</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart
                    data={Array.from({ length: 6 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (5 - i));
                      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                      
                      const dayActivities = userProgress.recentActivity.filter(activity => 
                        new Date(activity.date).toLocaleDateString() === date.toLocaleDateString()
                      );
                      
                      // Calculate XP based on activity scores and types
                      const dayXP = dayActivities.reduce((sum, activity) => {
                        if (activity.score) {
                          return sum + activity.score;
                        }
                        // Default XP values for activities without scores
                        switch (activity.type) {
                          case 'problem': return sum + 100;
                          case 'quiz': return sum + 150;
                          case 'visualizer': return sum + 50;
                          case 'game': return sum + 75;
                          default: return sum + 50;
                        }
                      }, 0);
                      
                      return {
                        name: dateStr,
                        value: dayXP
                      };
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Tools & Features
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "AI Problem Solver", icon: BrainCircuit, path: "/problem-solver", color: "from-blue-400 to-blue-500" },
                { name: "Quiz Zone", icon: BookOpen, path: "/quiz-zone", color: "from-green-400 to-green-500" },
                { name: "Mock Test", icon: ClipboardCheck, path: "/mock-test", color: "from-yellow-400 to-orange-400" },
                { name: "Math Visualizer", icon: LineChartIcon, path: "/visualizer", color: "from-purple-400 to-purple-500" },
                { name: "Math World (VR)", icon: Box, path: "/math-world", color: "from-red-400 to-red-500" },
                { name: "Fun Zone", icon: Gamepad2, path: "/fun-zone", color: "from-pink-400 to-pink-500" },
                { name: "Settings", icon: Settings, path: "/settings", color: "from-gray-400 to-gray-500" },
              ].map((feature, index) => (
                <Link
                  key={index}
                  to={feature.path}
                  className="rounded-xl p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${feature.color} mb-3`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {feature.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
