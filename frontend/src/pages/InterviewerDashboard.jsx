import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCandidates, nlpSearch, updateStage } from '../redux/thunks/candidateThunks';
import { logout } from '../redux/slices/authSlice';
import { Users, UserCheck, Clock, Search, Loader2, ArrowRight, History, ExternalLink, Eye, LogOut } from 'lucide-react';
import API from '../api/axiosInstance';
import MoveStageModal from '../components/MoveStageModal';
import CandidateDetailsModal from '../components/CandidateDetailsModal';

const InterviewerDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { list: allCandidates, loading } = useSelector((state) => state.candidates);
    const candidates = allCandidates.filter(c =>
        c.status === 'Active' &&
        c.currentStage !== 'Screening' &&
        c.assignedInterviewer === userInfo?._id
    );
    const [stats, setStats] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state for evaluation (adding feedback)
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const refreshDashboard = async () => {
        dispatch(fetchCandidates());
        try {
            const { data } = await API.get('/candidates/stats/summary');
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch Interviewer stats");
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

    const handleOpenDetailsModal = async (c) => {
        try {
            const { data } = await API.get(`/candidates/${c._id}`);
            setSelectedCandidate(data);
            setIsDetailsModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch details");
        }
    };

    const handleUpdateInterviewStatus = async (candidateId, status) => {
        try {
            await dispatch(updateStage({
                id: candidateId,
                interviewStatus: status,
                feedbackText: `Interviewer marked the interview as ${status}.`
            })).unwrap();
            refreshDashboard();
        } catch (error) {
            console.error("Interview Status Update Failed:", error);
            alert("Failed to update interview status");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Interviewer Evaluation Portal</h1>
                    <p className="text-slate-500 font-medium">Evaluate candidates and provide feedback for your assigned rounds.</p>
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
                </div>
            </div>

            {/* Simplified Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Pipeline</p>
                            <h3 className="text-3xl font-black text-slate-900 mt-2">{candidates.length}</h3>
                        </div>
                        <div className="bg-primary-50 p-4 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                            <Users className="w-7 h-7 text-primary-600" />
                        </div>
                    </div>
                </div>
                {stats?.statsPerStage?.sort((a, b) => b.count - a.count).slice(0, 2).map((stage, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stage._id}</p>
                                <h3 className="text-3xl font-black text-slate-800 mt-2">{stage.count}</h3>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl text-slate-300">
                                <UserCheck className="w-7 h-7" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Candidate List for Evaluation */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-xl font-black text-slate-900">Candidates Awaiting Review</h3>
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
                                        <p className="mt-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Fetching candidates...</p>
                                    </td>
                                </tr>
                            ) : candidates.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-24 text-center">
                                        <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No candidates to evaluate.</p>
                                    </td>
                                </tr>
                            ) : candidates.map((candidate) => (
                                <tr key={candidate._id} className="hover:bg-primary-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-500 group-hover:bg-primary-500 group-hover:text-white transition-all">
                                                {candidate.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 group-hover:text-primary-600 transition-colors">{candidate.name}</p>
                                                <p className="text-xs font-bold text-slate-400">{candidate.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border w-fit ${candidate.currentStage === 'Offer' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-primary-50 text-primary-600 border-primary-100'}`}>
                                                {candidate.currentStage}
                                            </span>
                                            {candidate.assignedInterviewer === userInfo?._id && candidate.scheduledTime && (
                                                <div className="flex flex-col gap-1">
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(candidate.scheduledTime).toLocaleString()}
                                                    </span>
                                                    {candidate.interviewMode && (
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                                            Mode: {candidate.interviewMode}
                                                        </span>
                                                    )}
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ml-1 ${candidate.interviewStatus === 'Accepted' ? 'text-emerald-500' :
                                                        candidate.interviewStatus === 'Rejected' ? 'text-rose-500' : 'text-amber-500'
                                                        }`}>
                                                        Status: {candidate.interviewStatus === 'Accepted' ? 'Scheduled' :
                                                            candidate.interviewStatus === 'Rejected' ? 'Rejected' : 'Pending'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-2 flex-wrap">
                                            {candidate.skills.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-white text-slate-600 rounded-lg text-[10px] font-black border border-slate-200 uppercase tracking-tighter">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 transition-all duration-300">
                                            <button
                                                onClick={() => handleOpenDetailsModal(candidate)}
                                                className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-600 hover:text-primary-600 rounded-xl transition-all border border-slate-100 hover:border-primary-100 shadow-sm font-bold text-xs"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>Details</span>
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
                                            {candidate.interviewStatus === 'Pending' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateInterviewStatus(candidate._id, 'Accepted')}
                                                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateInterviewStatus(candidate._id, 'Rejected')}
                                                        className="px-4 py-2 bg-white text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleOpenMoveModal(candidate)}
                                                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200 flex items-center gap-2 active:scale-95 ${candidate.interviewStatus === 'Rejected'
                                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                                        : 'bg-slate-900 text-white hover:bg-black'
                                                        }`}
                                                    disabled={candidate.interviewStatus === 'Rejected'}
                                                >
                                                    <History className="w-3.5 h-3.5" />
                                                    {candidate.interviewStatus === 'Rejected' ? 'Slot Rejected' : 'Feedback'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Evaluation Modal */}
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
        </div>
    );
};

export default InterviewerDashboard;
