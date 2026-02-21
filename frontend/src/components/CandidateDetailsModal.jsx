import React from 'react';
import { X, CheckCircle2, User, Clock, FileText, History, UserCircle, Calendar } from 'lucide-react';

const CandidateDetailsModal = ({ isOpen, onClose, candidate }) => {
    if (!isOpen || !candidate) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">{candidate.name}</h3>
                        <p className="text-sm text-slate-500 font-bold">{candidate.email}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                    {/* Status & Assignment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Current Stage</label>
                                <span className="text-primary-600 font-black uppercase text-xs px-3 py-1 bg-white border border-primary-100 rounded-lg inline-block">
                                    {candidate.currentStage}
                                </span>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Status</label>
                                <span className={`font-black uppercase text-xs px-3 py-1 border rounded-lg inline-block ${candidate.status === 'Active' ? 'text-emerald-600 bg-white border-emerald-100' : 'text-rose-600 bg-white border-rose-100'}`}>
                                    {candidate.status}
                                </span>
                            </div>
                        </div>

                        {candidate.assignedInterviewer && (
                            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 animate-in fade-in slide-in-from-right-2">
                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Next Round Assignment</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        <UserCircle className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-indigo-900 leading-tight">{candidate.assignedInterviewer.email}</p>
                                        <p className="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {candidate.scheduledTime ? new Date(candidate.scheduledTime).toLocaleString() : 'Time TBD'}
                                        </p>
                                        {(candidate.interviewMode || candidate.interviewStatus) && (
                                            <p className="text-[9px] font-black uppercase tracking-tighter mt-1 flex gap-2">
                                                <span className="text-indigo-300">Mode: {candidate.interviewMode || 'TBD'}</span>
                                                <span className={candidate.interviewStatus === 'Accepted' ? 'text-emerald-500' : candidate.interviewStatus === 'Rejected' ? 'text-rose-500' : 'text-amber-500'}>
                                                    Status: {candidate.interviewStatus || 'Pending'}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Key Expertise</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {candidate.skills && candidate.skills.length > 0 ? (
                                candidate.skills.map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[11px] font-black border border-slate-100 uppercase tracking-tight">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-slate-400 text-xs font-bold italic">No skills recorded</span>
                            )}
                        </div>
                    </div>

                    {/* Bio / Notes */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <UserCircle className="w-4 h-4 text-slate-400" />
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Candidate Bio / Notes</h4>
                        </div>
                        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                            <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                {candidate.notes || "No additional notes provided for this candidate."}
                            </p>
                        </div>
                    </div>

                    {/* Timeline / Rounds Cleared */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-slate-400" />
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Hiring Timeline</h4>
                        </div>
                        <div className="relative space-y-6 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            {candidate.feedbackHistory && candidate.feedbackHistory.length > 0 ? (
                                candidate.feedbackHistory.map((item, idx) => (
                                    <div key={idx} className="relative pl-10 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className="absolute left-0 w-9 h-9 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:border-primary-100 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-black text-primary-600 uppercase tracking-tight bg-primary-50 px-2 py-0.5 rounded-md">
                                                    {item.stage} Round
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(item.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed mb-3 font-medium italic">
                                                "{item.feedbackText}"
                                            </p>
                                            <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                                                <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
                                                    <User className="w-3 h-3 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-900 uppercase">Interviewed By</p>
                                                    <p className="text-[11px] font-bold text-slate-500">{item.interviewerId?.email || 'System'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="pl-10 text-slate-400 text-xs font-bold italic">
                                    No interview rounds recorded yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                    >
                        Close Portal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CandidateDetailsModal;
