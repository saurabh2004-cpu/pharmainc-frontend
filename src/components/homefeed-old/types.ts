export interface User {
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  specialization?: string;
  profilePicture?: string;
  location?: string;
  speciality?: string;
  roles?: string[];
}

export interface Post {
  id: number | string;
  author: string;
  avatar: string;
  role: string;
  time: string;
  title?: string;
  content: string;
  image?: string;
  tags?: string[];
  type: "Research Paper" | "Case Study";
  likes: number;
  comments: number;
  shares: number;
}
