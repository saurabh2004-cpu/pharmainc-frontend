"use client";

import React, { useEffect, useState } from 'react';
import { X, MapPin, Building2, Calendar, Award, Globe, Phone, Mail, Users, CheckCircle, Loader2 } from 'lucide-react';
import { Institution } from '@/lib/api/types';
import { getInstitutionById } from '@/lib/api/services/institute';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface InstituteProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    instituteId: string;
}

const InstituteProfileModal: React.FC<InstituteProfileModalProps> = ({
    isOpen,
    onClose,
    instituteId,
}) => {
    const [institute, setInstitute] = useState<Institution | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && instituteId) {
            fetchInstituteProfile();
        }
    }, [isOpen, instituteId]);

    const fetchInstituteProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getInstitutionById(instituteId);
            setInstitute(data);
        } catch (err: any) {
            console.error('Error fetching institute profile:', err);
            setError(err.message || 'Failed to load institute profile');
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Institute Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                            <p className="text-gray-600">Loading institute profile...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="text-red-500 mb-4">
                                <Building2 className="h-12 w-12" />
                            </div>
                            <p className="text-gray-900 font-semibold mb-2">Failed to Load Profile</p>
                            <p className="text-gray-600 text-sm mb-4">{error}</p>
                            <button
                                onClick={fetchInstituteProfile}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : institute ? (
                        <div className="space-y-6">
                            {/* Institute Header */}
                            <div className="flex items-start gap-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                    {institute.profile_picture ? (
                                        <img
                                            src={institute.profile_picture}
                                            alt={institute.name}
                                            className="w-full h-full object-cover rounded-2xl"
                                        />
                                    ) : (
                                        <span className="text-white text-3xl font-bold">
                                            {getInitials(institute.name)}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-2xl font-bold text-gray-900 break-words">
                                            {institute.name}
                                        </h3>
                                        {institute.verified && (
                                            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-lg text-gray-600 mb-2">{institute.type}</p>
                                    {institute.headline && (
                                        <p className="text-sm text-gray-700 italic">{institute.headline}</p>
                                    )}
                                </div>
                            </div>

                            {/* About Section */}
                            {institute.about && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-blue-600" />
                                            About
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                            {institute.about}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Details Grid */}
                            <Card>
                                <CardContent className="pt-6">
                                    <h4 className="font-semibold text-gray-900 mb-4">Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {institute.location && (
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</p>
                                                    <p className="text-sm text-gray-900 font-medium break-words">{institute.location}</p>
                                                </div>
                                            </div>
                                        )}

                                        {institute.yearEstablished && (
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Established</p>
                                                    <p className="text-sm text-gray-900 font-medium">{institute.yearEstablished}</p>
                                                </div>
                                            </div>
                                        )}

                                        {institute.ownership && (
                                            <div className="flex items-start gap-3">
                                                <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Ownership</p>
                                                    <p className="text-sm text-gray-900 font-medium">{institute.ownership}</p>
                                                </div>
                                            </div>
                                        )}

                                        {institute.affiliatedUniversity && (
                                            <div className="flex items-start gap-3">
                                                <Award className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Affiliated University</p>
                                                    <p className="text-sm text-gray-900 font-medium break-words">{institute.affiliatedUniversity}</p>
                                                </div>
                                            </div>
                                        )}

                                        {institute.bedsCount && (
                                            <div className="flex items-start gap-3">
                                                <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Beds</p>
                                                    <p className="text-sm text-gray-900 font-medium">{institute.bedsCount}</p>
                                                </div>
                                            </div>
                                        )}

                                        {institute.staffCount && (
                                            <div className="flex items-start gap-3">
                                                <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Staff</p>
                                                    <p className="text-sm text-gray-900 font-medium">{institute.staffCount}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            {(institute.contactEmail || institute.contactNumber || institute.telephone) && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
                                        <div className="space-y-3">
                                            {institute.contactEmail && (
                                                <div className="flex items-start gap-3">
                                                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                                                        <a
                                                            href={`mailto:${institute.contactEmail}`}
                                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium break-words"
                                                        >
                                                            {institute.contactEmail}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            {(institute.contactNumber || institute.telephone) && (
                                                <div className="flex items-start gap-3">
                                                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                                                        <a
                                                            href={`tel:${institute.contactNumber || institute.telephone}`}
                                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                        >
                                                            {institute.contactNumber || institute.telephone}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Services */}
                            {institute.services && institute.services.length > 0 && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <h4 className="font-semibold text-gray-900 mb-3">Services</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {institute.services.map((service, index) => (
                                                <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                                                    {service}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Specialties */}
                            {institute.specialties && institute.specialties.length > 0 && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <h4 className="font-semibold text-gray-900 mb-3">Specialties</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {institute.specialties.map((specialty: any, index: number) => (
                                                <Badge key={index} variant="outline" className="border-purple-300 text-purple-700 bg-purple-50">
                                                    {typeof specialty === 'object' && specialty !== null ? (specialty.name || specialty.id) : specialty}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-[#233F64] hover:bg-[#169BA4] text-white rounded-lg transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstituteProfileModal;
