import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCandidates, nlpSearch } from '../redux/thunks/candidateThunks';
import { logout } from '../redux/slices/authSlice';
import { Users, UserCheck, Clock, Search, Loader2, ArrowRight, UserPlus, History, ExternalLink, Eye, Pencil, LogOut, Calendar } from 'lucide-react';
import API from '../api/axiosInstance';
import AddCandidateModal from '../components/AddCandidateModal';
import MoveStageModal from '../components/MoveStageModal';
import CandidateDetailsModal from '../components/CandidateDetailsModal';
import EditCandidateModal from '../components/EditCandidateModal';
import ScheduleModal from '../components/ScheduleModal';

const HRDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { list: allCandidates, loading } = useSelector((state) => state.candidates);
    const candidates = allCandidates.filter(c => c.status === 'Active');
    const [stats, setStats] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('Active'); // 'Active', 'Total', or specific stage name

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const refreshDashboard = async () => {
        dispatch(fetchCandidates());
        try {
            const { data } = await API.get('/candidates/stats/summary');
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch HR stats");
        }
    };

    useEffect(() => {
        refreshDashboard();
    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            dispatch(nlpSearch(searchQuery));
        } else {
            dispatch(fetchCandidates());
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleOpenMoveModal = (c) => {
        setSelectedCandidate(c);
        setIsMoveModalOpen(true);
    };

    const handleOpenScheduleModal = (c) => {
        setSelectedCandidate(c);
        setIsScheduleModalOpen(true);
    };

    const handleOpenEditModal = (c) => {
        setSelectedCandidate(c);
        setIsEditModalOpen(true);
    };

    const handleOpenDetailsModal = async (c) => {
        try {
            const { data } = await API.get(`/candidates/${c._id}`);
            setSelectedCandidate(data);
            setIsDetailsModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch details");
        }
    };

    const statsConfig = [
        { label: 'Total Candidates', value: stats?.totalCandidates || '0', icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Recently Updated', value: stats?.recentlyUpdated?.length || '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">HR Management Portal</h1>
                    <p className="text-slate-500 font-medium">Complete control over the hiring pipeline and candidate lifecycle.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <form onSubmit={handleSearch} className="relative group w-full lg:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search candidates via AI..."
                                className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm font-medium"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-1.5 rounded-xl hover:bg-black transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all border border-slate-200 shadow-sm font-bold text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full sm:w-auto bg-primary-600 text-white rounded-2xl py-3.5 px-6 font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <UserPlus className="w-5 h-5" />
                        Add Candidate
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                    onClick={() => setFilterType('Total')}
                    className={`p-6 rounded-3xl border shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${filterType === 'Total' ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-slate-100'}`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-bold uppercase tracking-widest ${filterType === 'Total' ? 'text-primary-100' : 'text-slate-400'}`}>Total Candidates</p>
                            <h3 className={`text-3xl font-black mt-2 ${filterType === 'Total' ? 'text-white' : 'text-slate-900'}`}>{stats?.totalCandidates || '0'}</h3>
                        </div>
                        <div className={`p-4 rounded-2xl group-hover:rotate-12 transition-transform duration-300 ${filterType === 'Total' ? 'bg-primary-500/50' : 'bg-primary-50'}`}>
                            <Users className={`w-7 h-7 ${filterType === 'Total' ? 'text-white' : 'text-primary-600'}`} />
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => setFilterType('Active')}
                    className={`p-6 rounded-3xl border shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${filterType === 'Active' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-100'}`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-bold uppercase tracking-widest ${filterType === 'Active' ? 'text-emerald-100' : 'text-slate-400'}`}>Active Pipeline</p>
                            <h3 className={`text-3xl font-black mt-2 ${filterType === 'Active' ? 'text-white' : 'text-slate-900'}`}>{allCandidates.filter(c => c.status === 'Active').length}</h3>
                        </div>
                        <div className={`p-4 rounded-2xl group-hover:rotate-12 transition-transform duration-300 ${filterType === 'Active' ? 'bg-emerald-500/50' : 'bg-emerald-50'}`}>
                            <UserCheck className={`w-7 h-7 ${filterType === 'Active' ? 'text-white' : 'text-emerald-600'}`} />
                        </div>
                    </div>
                </div>

                {stats?.statsPerStage?.sort((a, b) => b.count - a.count).slice(0, 1).map((stage, idx) => (
                    <div
                        key={idx}
                        onClick={() => setFilterType(stage._id)}
                        className={`p-6 rounded-3xl border shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${filterType === stage._id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-bold uppercase tracking-widest ${filterType === stage._id ? 'text-indigo-100' : 'text-slate-400'}`}>{stage._id}</p>
                                <h3 className={`text-3xl font-black mt-2 ${filterType === stage._id ? 'text-white' : 'text-slate-800'}`}>{stage.count}</h3>
                            </div>
                            <div className={`p-4 rounded-2xl group-hover:rotate-12 transition-transform duration-300 ${filterType === stage._id ? 'bg-indigo-500/50' : 'bg-slate-50'}`}>
                                <Clock className={`w-7 h-7 ${filterType === stage._id ? 'text-white' : 'text-slate-400'}`} />
                            </div>
                        </div>
                    </div>
                ))}

                <div
                    onClick={() => setFilterType('Rejected')}
                    className={`p-6 rounded-3xl border shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${filterType === 'Rejected' ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white border-slate-100'}`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-bold uppercase tracking-widest ${filterType === 'Rejected' ? 'text-rose-100' : 'text-slate-400'}`}>Rejected</p>
                            <h3 className={`text-3xl font-black mt-2 ${filterType === 'Rejected' ? 'text-white' : 'text-slate-900'}`}>{allCandidates.filter(c => c.status === 'Rejected').length}</h3>
                        </div>
                        <div className={`p-4 rounded-2xl group-hover:rotate-12 transition-transform duration-300 ${filterType === 'Rejected' ? 'bg-rose-500/50' : 'bg-rose-50'}`}>
                            <History className={`w-7 h-7 ${filterType === 'Rejected' ? 'text-white' : 'text-rose-600'}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Candidate Pipeline Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl font-black text-slate-900">
                            {filterType === 'Total' ? 'Global Pipeline' :
                                filterType === 'Active' ? 'Active Pipeline' :
                                    `Candidates in ${filterType}`}
                        </h3>
                        {filterType !== 'Active' && (
                            <button
                                onClick={() => setFilterType('Active')}
                                className="text-[10px] font-black uppercase text-primary-600 bg-primary-50 px-3 py-1 rounded-lg hover:bg-primary-100 transition-colors"
                            >
                                Reset to Active
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Live Flow</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Candidate</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Stage</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Key Skills</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-24 text-center">
                                        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto" />
                                        <p className="mt-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Syncing Pipeline...</p>
                                    </td>
                                </tr>
                            ) : allCandidates
                                .filter(c => {
                                    if (filterType === 'Total') return true;
                                    if (filterType === 'Active') return c.status === 'Active';
                                    if (filterType === 'Rejected') return c.status === 'Rejected';
                                    return c.currentStage === filterType;
                                })
                                .map((candidate) => (
                                    <tr key={candidate._id} className="hover:bg-primary-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-500 shadow-inner group-hover:from-primary-500 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300">
                                                    {candidate.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 group-hover:text-primary-600 transition-colors">{candidate.name}</p>
                                                    <p className="text-xs font-bold text-slate-400">{candidate.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border w-fit ${candidate.currentStage === 'Offer' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    candidate.currentStage === 'Screening' ? 'bg-slate-100 text-slate-500 border-slate-100' :
                                                        'bg-primary-50 text-primary-600 border-primary-100'
                                                    }`}>
                                                    {candidate.currentStage}
                                                </span>
                                                {/* Stuck Detection (2 days logic) */}
                                                {Math.abs(new Date() - new Date(candidate.lastUpdated)) / (1000 * 60 * 60 * 24) > 2 && (
                                                    <div className="flex items-center gap-1.5 text-[9px] font-black text-rose-500 uppercase tracking-tight bg-rose-50 px-2 py-0.5 rounded-md w-fit border border-rose-100 animate-pulse">
                                                        <Clock className="w-2.5 h-2.5" />
                                                        Stuck {'>'} 2 Days
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-2 flex-wrap">
                                                {candidate.skills.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="px-2.5 py-1 bg-white text-slate-600 rounded-lg text-[10px] font-black border border-slate-200 shadow-sm uppercase tracking-tighter">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3 transition-all duration-300">
                                                <button
                                                    onClick={() => handleOpenDetailsModal(candidate)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 hover:text-primary-600 rounded-xl transition-all border border-slate-100 hover:border-primary-100 shadow-sm font-bold text-[10px] uppercase tracking-tighter"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Details</span>
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEditModal(candidate)}
                                                    className="flex items-center gap-2 px-3 py-2 bg-white text-slate-600 hover:text-amber-600 rounded-xl transition-all border border-slate-100 hover:border-amber-100 shadow-sm font-bold text-[10px] uppercase tracking-tighter"
                                                    title="Edit Profile"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                    <span>Edit</span>
                                                </button>
                                                <a
                                                    href={`http://localhost:5000/${candidate.resumeUrl}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all border border-transparent hover:border-primary-100 shadow-sm"
                                                    title="View Resume"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                                {candidate.currentStage === 'Screening' ? (
                                                    <button
                                                        onClick={() => handleOpenMoveModal(candidate)}
                                                        className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200 flex items-center gap-2 active:scale-95"
                                                    >
                                                        <History className="w-3.5 h-3.5" />
                                                        Feedback
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleOpenScheduleModal(candidate)}
                                                            className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all border border-emerald-100 shadow-sm"
                                                            title="Assign Interviewer"
                                                        >
                                                            <Calendar className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenMoveModal(candidate)}
                                                            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200 flex items-center gap-2 active:scale-95"
                                                        >
                                                            <History className="w-3.5 h-3.5" />
                                                            Feedback
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <AddCandidateModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    refreshDashboard();
                }}
            />
            <MoveStageModal
                isOpen={isMoveModalOpen}
                onClose={() => {
                    setIsMoveModalOpen(false);
                    refreshDashboard();
                }}
                candidate={selectedCandidate}
            />
            <CandidateDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                candidate={selectedCandidate}
            />
            <EditCandidateModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    refreshDashboard();
                }}
                candidate={selectedCandidate}
            />
            <ScheduleModal
                isOpen={isScheduleModalOpen}
                onClose={() => {
                    setIsScheduleModalOpen(false);
                    refreshDashboard();
                }}
                candidate={selectedCandidate}
            />
        </div>
    );
};

export default HRDashboard;
