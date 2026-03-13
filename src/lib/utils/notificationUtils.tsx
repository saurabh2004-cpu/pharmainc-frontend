import Link from "next/link";
import { Notification } from "@/lib/api/types";
import Image from "next/image";

export const buildNotificationMessage = (notification: Notification) => {
  const status = notification.status;
  const jobTitle = notification.application?.job?.title || "job";
  const jobId = notification.application?.job?.id;
  const instituteName = notification.application?.job?.institute?.name || "the institute";
  const instituteId = notification.application?.job?.institute?.id;
  const applicantName = notification.application?.user?.name || notification.applicantName || "A candidate";

  const JobLink = ({ title }: { title: string }) => (
    jobId ? (
      <Link
        href={`/find-jobs/${title.split(' ').join('-')}?id=${jobId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline font-semibold"
        onClick={(e) => e.stopPropagation()}
      >
        {title}
      </Link>
    ) : <span>{title}</span>
  );

  const InstituteLink = ({ name }: { name: string }) => (
    instituteId ? (
      <Link
        href={`/institute/${instituteId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline font-semibold"
        onClick={(e) => e.stopPropagation()}
      >
        {name}
      </Link>
    ) : <span>{name}</span>
  );

  switch (status) {
    case "APPLIED":
      return (
        <span>
          {applicantName} applied for the job <JobLink title={jobTitle} />.
        </span>
      );
    case "SHORTLISTED":
      return (
        <span>
          Your application for the job <JobLink title={jobTitle} /> has been shortlisted by <InstituteLink name={instituteName} />.
        </span>
      );
    case "REJECTED":
      return (
        <span>
          Your application for the job <JobLink title={jobTitle} /> was rejected by <InstituteLink name={instituteName} />.
        </span>
      );
    case "INTERVIEW_SCHEDULED":
      return (
        <span>
          Your interview for the job <JobLink title={jobTitle} /> has been scheduled by <InstituteLink name={instituteName} />.
        </span>
      );
    case "NEXT_ROUND_REQUESTED":
      return (
        <span>
          <InstituteLink name={instituteName} /> has requested a next round for your application to <JobLink title={jobTitle} />.
        </span>
      );
    case "NEXT_ROUND_ACCEPTED":
      return (
        <span>
          {applicantName} has accepted the next round request for the job <JobLink title={jobTitle} />.
        </span>
      );
    case "NEXT_ROUND_REJECTED":
      return (
        <span>
          {applicantName} has rejected the next round request for the job <JobLink title={jobTitle} />.
        </span>
      );
    case "INTERVIEW_ACCEPTED":
      return (
        <span>
          {applicantName} has accepted the interview request for the job <JobLink title={jobTitle} />.
        </span>
      );
    case "HIRED":
      return (
        <div className="flex flex-col gap-2 pt-1">
          {/* <Image 
            src="/firework.png" 
            alt="Congratulations" 
            width={45} 
            height={45} 
            className="mb-1"
          /> */}
          <p className="text-gray-600 leading-relaxed text-[15px]">
            You have been hired for the job <JobLink title={jobTitle} /> by <InstituteLink name={instituteName} />.
          </p>
        </div>
      );
    default:
      return <span>{notification.message}</span>;
  }
};
