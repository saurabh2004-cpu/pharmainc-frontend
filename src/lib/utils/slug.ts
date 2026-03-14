import { Job } from "../api";


export const generateSlug = (job: Job) => {

    const slugify = (value?: string | number | null) => {
        if (!value) return "";
        return value
            .toString()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    };


    const parts = [
        slugify(job.title),
        slugify(job.jobType),
        slugify(job.role),
        slugify(job.speciality),
        slugify(job.subSpeciality),
        slugify(job.city),
        slugify(job.country),

    ];

    const slug = parts.filter(Boolean).join("-");
    return `${slug}-${job.id}`;
};