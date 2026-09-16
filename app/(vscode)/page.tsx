import {
  getProjects,
  getExperiences,
  getPublishedArticles,
  getExpertise,
  getCertifications,
} from "@/lib/content";
import {
  profile,
  timeline,
  socials,
  projects as staticProjects,
  articles as staticArticles,
  experiences as staticExperiences,
  expertise as staticExpertise,
  certifications as staticCertifications,
} from "@/lib/data";
import { IDE } from "./components/ide";
import type { PortfolioData } from "./types";

export const revalidate = 60;

export default async function V1Page() {
  let data: PortfolioData;

  try {
    const [projects, experiences, articles, expertiseData, certs] =
      await Promise.all([
        getProjects(),
        getExperiences(),
        getPublishedArticles(),
        getExpertise(),
        getCertifications(),
      ]);

    data = {
      projects: (projects.length > 0 ? projects : staticProjects) as PortfolioData["projects"],
      experiences: (experiences.length > 0 ? experiences : staticExperiences) as PortfolioData["experiences"],
      articles: (articles.length > 0 ? articles : staticArticles) as PortfolioData["articles"],
      expertise: (expertiseData.length > 0 ? expertiseData : staticExpertise) as PortfolioData["expertise"],
      certifications: (certs.length > 0 ? certs : staticCertifications) as PortfolioData["certifications"],
      profile,
      timeline,
      socials,
    };
  } catch {
    data = {
      projects: staticProjects,
      experiences: staticExperiences,
      articles: staticArticles,
      expertise: staticExpertise,
      certifications: staticCertifications,
      profile,
      timeline,
      socials,
    };
  }

  return <IDE data={data} />;
}
