import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateCandidate, fetchCandidates } from '../redux/thunks/candidateThunks';
import { X, Save, Loader2, User, Mail, Tag, AlignLeft, FileText } from 'lucide-react';

const EditCandidateModal = ({ isOpen, onClose, candidate }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        skills: '',
        notes: ''
    });
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (candidate) {
            setFormData({
                name: candidate.name || '',
                email: candidate.email || '',
                skills: candidate.skills ? candidate.skills.join(', ') : '',
                notes: candidate.notes || ''
            });
        }
    }, [candidate]);

    if (!isOpen || !candidate) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('skills', formData.skills);
        data.append('notes', formData.notes);
        if (resume) {
            data.append('resume', resume);
        }

        try {
            await dispatch(updateCandidate({
                id: candidate._id,
                formData: data
            })).unwrap();
            onClose();
            dispatch(fetchCandidates()); // Refresh list
        } catch (err) {
            alert(err || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">Edit Profile</h3>
                        <p className="text-sm text-slate-500 font-bold">Updating {candidate.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                <User className="w-3 h-3" /> Full Name
                            </label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-bold text-slate-900 transition-all"
                                placeholder="Enter candidate name"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                <Mail className="w-3 h-3" /> Email Address
                            </label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-bold text-slate-900 transition-all"
                                placeholder="candidate@example.com"
                            />
                        </div>

                        {/* Skills */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                <Tag className="w-3 h-3" /> Skills (Comma separated)
                            </label>
                            <input
                                type="text"
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-bold text-slate-900 transition-all"
                                placeholder="React, Node.js, Python..."
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                <AlignLeft className="w-3 h-3" /> Internal Notes
                            </label>
                            <textarea
                                rows="3"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-bold text-slate-900 transition-all resize-none"
                                placeholder="Any internal notes or observations..."
                            ></textarea>
                        </div>

                        {/* Resume Update */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Update Resume (Optional)
                            </label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    onChange={(e) => setResume(e.target.files[0])}
                                    className="hidden"
                                    id="edit-resume"
                                    accept=".pdf,.doc,.docx"
                                />
                                <label
                                    htmlFor="edit-resume"
                                    className="flex items-center justify-between w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-5 cursor-pointer group-hover:border-primary-500 transition-all"
                                >
                                    <span className="text-sm font-bold text-slate-500">
                                        {resume ? resume.name : 'Select new resume file...'}
                                    </span>
                                    <FileText className="w-5 h-5 text-slate-400 group-hover:text-primary-500" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white rounded-2xl py-4 font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> Update Profile</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditCandidateModal;
