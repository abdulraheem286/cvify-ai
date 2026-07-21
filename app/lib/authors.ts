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
    // TODO: replace this placeholder bio with your own, and add linkedin/email.
    bio: "Abdul builds CVify AI and writes about resumes, job hunting, and getting past applicant tracking systems.",
    avatarFile: "authors/abdul.jpg", // drop your photo here: public/authors/abdul.jpg
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
