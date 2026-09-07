import { getProjects, getExperiences, getCertifications, getPublishedArticles, getExpertise } from '@/lib/content';
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import ExpertiseSection from "@/components/portfolio/ExpertiseSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import CertificationsSection from "@/components/portfolio/CertificationsSection";
import BlogSection from "@/components/portfolio/BlogSection";
import ContactSection from "@/components/portfolio/ContactSection";
import FloatingNav from "@/components/portfolio/FloatingNav";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function Home() {
  // Fetch all content from database in parallel
  const [projects, experiences, certifications, articles, expertise] = await Promise.all([
    getProjects(),
    getExperiences(),
    getCertifications(),
    getPublishedArticles(),
    getExpertise(),
  ]);

  return (
    <div className="relative min-h-screen bg-background text-ink antialiased transition-colors duration-500 overflow-x-hidden">
      {/* Floating nav */}
      <FloatingNav />

      {/* Theme toggle - fixed top right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Main scroll content */}
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection experiences={experiences} />
        <ExpertiseSection expertise={expertise} />
        <ProjectsSection projects={projects} />
        <CertificationsSection certifications={certifications} />
        <BlogSection articles={articles} />
        <ContactSection />

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 py-12 px-6 transition-colors duration-500">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-gray-400">
              &copy; {new Date().getFullYear()} Arandelle Paguinto
            </p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-gray-400">
              Built with passion
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
