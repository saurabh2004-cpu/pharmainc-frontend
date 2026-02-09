"use client";

import { useParams } from 'next/navigation';
import JobPostingForm from '@/app/(home)/dashboard/_components/JobPostingFormStepWise';

export default function EditJobPage() {
    const params = useParams();
    const id = params?.id as string;

    return (
        <div className=" mx-auto ">
            <JobPostingForm jobId={id} />
        </div>
    );
}
