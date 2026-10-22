const image = `{ "id": _key, label, "src": asset->url, alt, caption, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;
const published = `!(_id match "*.*") && !(_id in path("drafts.**")) && !(_id in path("versions.**"))`;

export const portfolioQuery = `{
  "profile": *[_type == "profile" && _id == "profile" && ${published}][0]{_id, displayName, professionalHeadline, shortIntroduction, aboutIntroduction, "about": about[].body, location, resumeUrl, contactEmail, socialLinks[]{label, url}, "portrait": portrait${image}},
  "homepage": *[_type == "homepage" && _id == "homepage" && ${published}][0]{_id, heroHeadline, heroEmphasis, heroSupportingText, workTitle, workDescription, aboutTitle, skillsTitle, skillsDescription, connectHeadline, connectEmphasis, connectMessage},
  "projects": *[_type == "project" && ${published}] | order(displayOrder asc, _id asc){_id, "slug": slug.current, title, description, status, collaboration, role, teamSize, technologies, liveUrl, liveUrlVerified, githubUrl, featured, displayOrder, caseStudy, "screenshots": screenshots[]${image}},
  "skills": *[_type == "skill" && ${published}] | order(displayOrder asc, _id asc){_id, category, name, icon, displayOrder, visible},
  "education": *[_type == "education" && ${published}] | order(displayOrder asc, _id asc){_id, institution, program, status, startDate, endDate, description, displayOrder}
}`;
