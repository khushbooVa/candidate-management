import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateStage, fetchCandidates } from '../redux/thunks/candidateThunks';
import { X, Send, Loader2, UserCircle, Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';
import { fetchInterviewers } from '../redux/thunks/authThunks';

const STAGES = [
    "Screening", "L1", "L2", "Director", "HR", "Compensation", "BG Check", "Offer"
];

const MoveStageModal = ({ isOpen, onClose, candidate }) => {
    const dispatch = useDispatch();
    const { userInfo, interviewers } = useSelector((state) => state.auth);
    const [targetStage, setTargetStage] = useState('');
    const [statusAction, setStatusAction] = useState('Pass'); // 'Pass' or 'Reject'
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (candidate) {
            const currentIndex = STAGES.indexOf(candidate.currentStage);
            const nextStage = STAGES[currentIndex + 1] || candidate.currentStage;
            setTargetStage(nextStage);
            setStatusAction('Pass');
        }
    }, [candidate, userInfo, dispatch]);

    if (!isOpen || !candidate) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        setLoading(true);

        try {
            await dispatch(updateStage({
                id: candidate._id,
                stage: statusAction === 'Reject' ? candidate.currentStage : targetStage,
                status: statusAction === 'Reject' ? 'Rejected' : 'Active',
                feedbackText: feedback,
            })).unwrap();
            onClose();
            setFeedback('');
            dispatch(fetchCandidates()); // Refresh list
        } catch (err) {
            alert(err || "Failed to update candidate");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Transition Stage</h3>
                        <p className="text-sm text-slate-500">Updating for {candidate.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Assessment Result Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Assessment Result</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setStatusAction('Pass')}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border-2 transition-all flex items-center justify-center gap-2 ${statusAction === 'Pass'
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                                    }`}
                            >
                                <div className={`w-2 h-2 rounded-full ${statusAction === 'Pass' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                Qualified / Pass
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusAction('Reject')}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border-2 transition-all flex items-center justify-center gap-2 ${statusAction === 'Reject'
                                    ? 'border-rose-500 bg-rose-50 text-rose-600'
                                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                                    }`}
                            >
                                <div className={`w-2 h-2 rounded-full ${statusAction === 'Reject' ? 'bg-rose-500' : 'bg-slate-300'}`} />
                                Rejected
                            </button>
                        </div>
                    </div>

                    {statusAction === 'Pass' && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Move To Stage</label>
                            <div className="grid grid-cols-2 gap-2">
                                {STAGES.map((s, idx) => {
                                    const currentIndex = STAGES.indexOf(candidate.currentStage);
                                    const isNext = idx === currentIndex + 1;
                                    const isCurrent = idx === currentIndex;
                                    const isPast = idx < currentIndex;

                                    return (
                                        <button
                                            key={s}
                                            type="button"
                                            disabled={!isNext}
                                            onClick={() => setTargetStage(s)}
                                            className={`relative py-3 px-4 rounded-xl text-xs font-bold border-2 transition-all 
                                                ${targetStage === s
                                                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                                                    : isNext
                                                        ? 'border-slate-100 bg-slate-50 text-slate-500 hover:border-primary-200'
                                                        : 'border-slate-50 bg-slate-50/50 text-slate-300 cursor-not-allowed'
                                                }`}
                                        >
                                            {s}
                                            {isCurrent && (
                                                <span className="absolute -top-2 -right-1 px-1.5 py-0.5 bg-slate-900 text-[8px] text-white rounded-md font-black uppercase tracking-tighter shadow-lg">
                                                    Current
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}


                    <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">
                            {statusAction === 'Reject' ? 'Rejection Reason (Mandatory)' : 'Feedback / Selection Notes'}
                        </label>
                        <textarea
                            required
                            rows="4"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className={`w-full bg-slate-50 border rounded-2xl py-3 px-4 focus:ring-4 outline-none resize-none transition-all ${statusAction === 'Reject' ? 'border-rose-200 focus:ring-rose-500/10' : 'border-slate-200 focus:ring-primary-500/10'}`}
                            placeholder={statusAction === 'Reject' ? "Please explain why the candidate is being rejected..." : "Why are you moving this candidate to the next stage?"}
                        ></textarea>
                    </div>


                    <button
                        type="submit"
                        disabled={loading || !feedback.trim()}
                        className={`w-full rounded-2xl py-4 font-bold shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${statusAction === 'Reject' ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200' : 'bg-slate-900 hover:bg-black text-white shadow-slate-200'}`}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <Send className="w-4 h-4" />
                                {statusAction === 'Reject' ? 'Confirm Rejection' : 'Complete Evaluation'}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MoveStageModal;
