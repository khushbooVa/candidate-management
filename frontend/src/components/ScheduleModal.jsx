import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStage, fetchCandidates } from '../redux/thunks/candidateThunks';
import { fetchInterviewers } from '../redux/thunks/authThunks';
import { X, Calendar, UserCircle, Loader2, Save } from 'lucide-react';

const ScheduleModal = ({ isOpen, onClose, candidate }) => {
    const dispatch = useDispatch();
    const { interviewers } = useSelector((state) => state.auth);
    const [assignedInterviewer, setAssignedInterviewer] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [interviewMode, setInterviewMode] = useState('Virtual');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (candidate && isOpen) {
            setAssignedInterviewer(candidate.assignedInterviewer?._id || '');
            setScheduledTime(candidate.scheduledTime ? new Date(candidate.scheduledTime).toISOString().slice(0, 16) : '');
            setInterviewMode(candidate.interviewMode || 'Virtual');
            dispatch(fetchInterviewers());
        }
    }, [candidate, isOpen, dispatch]);

    if (!isOpen || !candidate) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await dispatch(updateStage({
                id: candidate._id,
                stage: candidate.currentStage,
                status: candidate.status,
                feedbackText: "Updating interview schedule details.",
                assignedInterviewer,
                scheduledTime,
                interviewMode
            })).unwrap();
            onClose();
            dispatch(fetchCandidates());
        } catch (err) {
            alert(err || "Failed to update schedule");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Schedule Interview</h3>
                        <p className="text-sm text-slate-500">For {candidate.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <UserCircle className="w-3.5 h-3.5" /> Assign Interviewer
                            </label>
                            <select
                                value={assignedInterviewer}
                                onChange={(e) => setAssignedInterviewer(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm font-bold text-slate-700"
                            >
                                <option value="">Select Interviewer</option>
                                {interviewers.map(i => (
                                    <option key={i._id} value={i._id}>{i.email}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" /> Time Slot
                            </label>
                            <input
                                type="datetime-local"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm font-bold text-slate-700 font-mono"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5" /> Interview Mode
                            </label>
                            <select
                                value={interviewMode}
                                onChange={(e) => setInterviewMode(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm font-bold text-slate-700"
                            >
                                <option value="Virtual">Virtual (Zoom/Meet)</option>
                                <option value="In-person">In-person (Office)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Schedule
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ScheduleModal;
