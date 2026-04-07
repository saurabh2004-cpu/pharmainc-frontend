
"use client";

import { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Trash2, X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    uploadUserImages,
    deleteUserImage,
    uploadInstituteImages,
    deleteInstituteImage,
    ImageType
} from "@/lib/api/services/imageService";
import Image from "next/image";

interface EditImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (url: string | null) => void;
    type: ImageType;
    isInstitute: boolean;
    currentImage?: string | null;
    title: string;
}

export const EditImageModal = ({
    isOpen,
    onClose,
    onUpdate,
    type,
    isInstitute,
    currentImage,
    title,
}: EditImageModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    }, [isOpen]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsLoading(true);
        try {
            const uploadFn = isInstitute ? uploadInstituteImages : uploadUserImages;
            const response = await uploadFn(selectedFile, type);

            const newUrl = type === 'profileImage' ? response.profileImage : response.coverImage;
            onUpdate(newUrl || null);
            toast.success(`${title} updated successfully`);
            onClose();
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.response?.data?.error || `Failed to upload ${title.toLowerCase()}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to remove your ${title.toLowerCase()}?`)) return;

        setIsLoading(true);
        try {
            const deleteFn = isInstitute ? deleteInstituteImage : deleteUserImage;
            await deleteFn(type);
            onUpdate(null);
            toast.success(`${title} removed successfully`);
            onClose();
        } catch (error: any) {
            console.error("Delete error:", error);
            toast.error(error.response?.data?.error || `Failed to remove ${title.toLowerCase()}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit {title}</DialogTitle>
                    <DialogDescription>
                        Upload a new {title.toLowerCase()} or remove the current one.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                    {previewUrl || currentImage ? (
                        <div className="relative w-full aspect-video sm:aspect-square max-h-64 rounded-lg overflow-hidden group">
                            <Image
                                src={previewUrl || currentImage || "/banner.png"}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera className="h-4 w-4 mr-2" />
                                    Change
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="flex flex-col items-center gap-2 cursor-pointer py-8"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="p-3 bg-white rounded-full shadow-sm">
                                <Upload className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500 font-medium">Click to upload {title.toLowerCase()}</p>
                            <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    {currentImage && (
                        <Button
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
                            onClick={handleDelete}
                            disabled={isLoading}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                        </Button>
                    )}
                    <div className="flex gap-2 flex-1 sm:justify-end">
                        <Button variant="outline" onClick={onClose} disabled={isLoading} className="hover:bg-[#233F64] hover:text-white">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={isLoading || !selectedFile}
                            className="bg-[#169BA4] hover:bg-[#169BA4] hover:text-white bg-[#233F64]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin text-white" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
