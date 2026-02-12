'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { scheduleInterview } from '@/lib/api/services/application';
import { toast } from 'sonner';

interface ScheduleInterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicationId: string | null;
    onSuccess: () => void;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({ isOpen, onClose, applicationId, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        interviewType: '',
        interviewDate: '',
        interviewTime: '',
        interviewLink: ''
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!applicationId) return;
        if (!formData.interviewType || !formData.interviewDate || !formData.interviewTime) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            await scheduleInterview(applicationId, formData);
            toast.success("Interview scheduled successfully");
            setFormData({
                interviewType: '',
                interviewDate: '',
                interviewTime: '',
                interviewLink: ''
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error scheduling interview:", error);
            toast.error("Failed to schedule interview");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Schedule Interview</DialogTitle>
                    <DialogDescription>
                        Set up an interview with the candidate.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="interviewType">Interview Type *</Label>
                        <Select
                            value={formData.interviewType}
                            onValueChange={(val) => handleChange('interviewType', val)}
                        >
                            <SelectTrigger id="interviewType">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="videoInterview">Video Interview</SelectItem>
                                <SelectItem value="phoneInterview">Phone Interview</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="interviewDate">Date *</Label>
                        <Input
                            id="interviewDate"
                            type="date"
                            value={formData.interviewDate}
                            onChange={(e) => handleChange('interviewDate', e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="interviewTime">Time *</Label>
                        <Input
                            id="interviewTime"
                            type="time"
                            value={formData.interviewTime}
                            onChange={(e) => handleChange('interviewTime', e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="interviewLink">Link (Optional)</Label>
                        <Input
                            id="interviewLink"
                            type="text"
                            placeholder="e.g. Zoom/Meet link or Phone Number"
                            value={formData.interviewLink}
                            onChange={(e) => handleChange('interviewLink', e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                            {loading ? "Scheduling..." : "Schedule"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ScheduleInterviewModal;
