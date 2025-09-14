import Footer from "../Footer/page";
import Header from "../Header/page";
import logo from "@/assets/cleitVips.png";
import Image from "next/image";

export default function About() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
        <div className="flex justify-center mb-8">
          <Image src={logo} width={280} alt="Cleit x VIPS" priority />
        </div>

        <p className="text-lg leading-relaxed mb-6">
          Cleit began its journey as the official, college-recognized platform
          of&nbsp;
          <span className="font-semibold">
            Vivekananda Institute of Professional Studies
          </span>
          , in collaboration with the Career Development Centre (CDC). Our first
          step was clear: organize and simplify every career opportunity —
          placements, internships, assessments, and job openings — so students
          could focus on growth instead of chasing scattered information.
        </p>

        <p className="text-lg leading-relaxed mb-6">
          But careers are just one part of student life. College is also about
          finding your community, exploring passions, and creating memories.
          That&apos;s why&nbsp;
          <span className="font-medium text-indigo-600">
            Cleit has grown beyond its original scope.
          </span>
        </p>

        <p className="text-lg leading-relaxed mb-6">
          Today, Cleit goes further — it connects you to every society and event
          at VIPS. From auditions and workshops to cultural fests and seminars,
          all the opportunities to participate, perform, and engage are now
          brought into one organized space.
        </p>

        <p className="text-lg leading-relaxed mb-6">
          This is our way forward: with every step,&nbsp;
          <span className="font-medium text-indigo-600">
            Cleit widens its reach&nbsp;
          </span>
          to cover more of what matters to students. From careers, to campus
          life, and soon, to a nationwide network that makes student life — in
          all its dimensions — more connected, engaging, and empowering.
        </p>

        <p className="text-lg leading-relaxed">
          Cleit isn&apos;t just a platform. It&apos;s&nbsp;
          <span className="font-medium text-indigo-600">
            the evolving ecosystem of opportunities
          </span>
          that grows with you.
        </p>
      </main>
      <Footer />
    </>
  );
}
