import { Link } from 'react-router-dom';
import { useMonth } from '../context/MonthContext';
import { Sun, Moon, Calendar, Menu } from 'lucide-react';
import { useState } from 'react';

export const Layout = ({ children }) => {
    const { activeMonthId, months, setActiveMonthId, isAdmin, setIsAdmin } = useMonth();
    const activeMonth = months.find(m => m.id === activeMonthId) || {};
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cream-100 font-sans text-brown-800">

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-pink-100">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center relative">
                    <Link to="/" className="text-3xl font-heading font-bold text-pink-500 tracking-wide hover:text-pink-600 transition-colors">
                        Yakawa’s Kitchen
                        <span className="text-sm font-body text-brown-400 ml-2 font-normal hidden sm:inline-block">Monthly Food Experience</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-6">
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-full text-sm font-medium transition-colors">
                                <Calendar size={16} />
                                {activeMonth.name}
                            </button>
                            {/* Simplified Dropdown */}
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-pink-100 overflow-hidden hidden group-hover:block animate-fade-in z-50">
                                {months.map(month => (
                                    <button
                                        key={month.id}
                                        onClick={() => setActiveMonthId(month.id)}
                                        className={`block w-full text-left px-4 py-3 text-sm hover:bg-pink-50 transition-colors ${activeMonthId === month.id ? 'bg-pink-50 text-pink-600 font-bold' : 'text-brown-600'}`}
                                    >
                                        {month.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsAdmin(!isAdmin)}
                            className={`text-sm font-medium transition-colors ${isAdmin ? 'text-pink-600 font-bold' : 'text-brown-400 hover:text-brown-600'}`}
                        >
                            {isAdmin ? 'Admin Mode On' : 'Admin'}
                        </button>
                    </div>

                    <button
                        className="md:hidden p-2 text-brown-600"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-pink-100 p-4 absolute w-full shadow-lg z-40 animate-fade-in">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-brown-400 uppercase tracking-wider">Select Month</h3>
                            {months.map(month => (
                                <button
                                    key={month.id}
                                    onClick={() => { setActiveMonthId(month.id); setMobileMenuOpen(false); }}
                                    className={`block w-full text-left px-4 py-2 rounded-lg ${activeMonthId === month.id ? 'bg-pink-50 text-pink-600 font-bold' : 'text-brown-600'}`}
                                >
                                    {month.name}
                                </button>
                            ))}
                            <div className="pt-4 border-t border-dashed border-pink-100">
                                <button
                                    onClick={() => { setIsAdmin(!isAdmin); setMobileMenuOpen(false); }}
                                    className="w-full text-center py-2 text-sm text-brown-400 hover:text-pink-500"
                                >
                                    Toggle Admin
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-12 min-h-[80vh]">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-pink-100 py-8 mt-12">
                <div className="text-center">
                    <p className="font-heading text-2xl text-pink-400 mb-2">Made with a little bit of magic ♡</p>
                    <p className="text-brown-400 text-sm">© 2026 Yakawa’s Kitchen. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
