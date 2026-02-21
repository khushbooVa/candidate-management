import React from 'react';
import { UserPlus, Users, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Users className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            TalentHub
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/" className="text-slate-600 hover:text-blue-600 flex items-center space-x-1 transition-colors">
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                        </a>
                        <a href="/candidates" className="text-slate-600 hover:text-blue-600 flex items-center space-x-1 transition-colors">
                            <Users className="w-4 h-4" />
                            <span>Candidates</span>
                        </a>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center space-x-2">
                            <UserPlus className="w-4 h-4" />
                            <span>Add Candidate</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
