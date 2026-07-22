import fs from "node:fs";
import path from "node:path";

// Author registry. A post's frontmatter `author` name is looked up here to get
// the photo, bio, and links shown in the meta line and the author bio box.
// The avatar is used only if the file actually exists in /public, so there is
// never a broken image before the photo is added.

export type Author = {
  name: string;
  role?: string;
  bio?: string;
  avatar?: string;
  linkedin?: string;
  email?: string;
};

type Entry = Omit<Author, "avatar"> & { avatarFile?: string };

const REGISTRY: Record<string, Entry> = {
  "Abdul Rahim": {
    name: "Abdul Rahim",
    role: "Founder, CVify AI",
    bio: "Abdul is the founder of CVify AI. He builds tools that help people write stronger CVs, and writes practical guides on resumes, applicant tracking systems (ATS), and landing more interviews.",
    email: "abdulrahim.majid5@gmail.com",
    linkedin: "https://www.linkedin.com/company/cvifyai",
    avatarFile: "authors/abdul.jpg",
  },
};

export function getAuthor(name: string): Author {
  const e = REGISTRY[name];
  if (!e) return { name };
  let avatar: string | undefined;
  if (e.avatarFile && fs.existsSync(path.join(process.cwd(), "public", e.avatarFile))) {
    avatar = `/${e.avatarFile}`;
  }
  return { name: e.name, role: e.role, bio: e.bio, linkedin: e.linkedin, email: e.email, avatar };
}
