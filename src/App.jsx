import { useState } from 'react';
import { MonthProvider, useMonth } from './context/MonthContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ReviewForm } from './components/ReviewForm';
import { ReviewList } from './components/ReviewList';
import { AdminDashboard } from './components/AdminDashboard';
import { FoodDisplay } from './components/FoodDisplay';
import { Login } from './pages/Login';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import logo from './assets/logo.png';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const Home = () => {
  const { activeMonthId, months } = useMonth();
  const activeMonth = months.find(m => m.id === activeMonthId);

  if (!activeMonth) return <div>Loading...</div>;

  return (
    <Layout>
      {/* Hero / Intro */}
      <section className="text-center space-y-4 mb-16 animate-fade-in relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-50 -z-10"></div>

        {/* Brand Logo - Centered above title */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Yakawa's Kitchen"
            className="w-32 md:w-40 h-auto object-contain rounded-lg drop-shadow-sm hover:scale-105 transition-transform duration-500"
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-heading text-pink-500 drop-shadow-sm">
          {activeMonth.name} Experience
        </h1>
        <p className="text-xl md:text-2xl text-brown-500 font-light italic">
          "Made with a little bit of magic ♡"
        </p>

        {activeMonth.status === 'closed' && (
          <div className="inline-block px-4 py-2 bg-gray-100 text-gray-500 rounded-full text-sm font-bold uppercase tracking-widest mt-4">
            Submissions Closed
          </div>
        )}
      </section>

      {/* Food Display Section - Above Rating Form */}
      {activeMonth.status === 'active' && (
        <section className="animate-slide-up">
          <FoodDisplay month={activeMonth} />
        </section>
      )}

      {/* Submission Form */}
      {activeMonth.status === 'active' && (
        <section className="mb-20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <ReviewForm />
        </section>
      )}

      {/* Reviews Display */}
      <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading text-brown-700">Community Thoughts</h2>
          <div className="h-1 flex-1 bg-pink-50 ml-6 rounded-full"></div>
        </div>
        <ReviewList />
      </section>

    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <MonthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </MonthProvider>
    </AuthProvider>
  );
}

export default App;
