import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-pagebg text-gray-200">
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <header className="space-y-2 border-b border-gray-700 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-400">
            YearBook Portal — Alumni Cell, Indian Institute of Technology Indore
            (yearbook.iiti.ac.in &amp; alumnicell.iiti.ac.in)
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-yellow-400">
            1. Eligibility &amp; Accounts
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Access to member features of the IIT Indore YearBook Portal requires
            authentication with a valid `@iiti.ac.in` Google account. You are
            responsible for maintaining the security of your institutional
            account and providing accurate enrollment details.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-yellow-400">
            2. User Content &amp; Moderation
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Members may submit profile information, photographs, testimonials,
            poll votes, and campus memories. You retain ownership of content you
            submit while granting Alumni Cell, IIT Indore permission to display
            approved entries within the digital and printed yearbook.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Content that is abusive, harassing, defamatory, impersonating another
            person, or violating IIT Indore community standards is strictly
            prohibited. Recipients control moderation of comments and memory
            requests addressed to them, and portal administrators may remove
            violating content.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-yellow-400">
            3. Service Availability
          </h2>
          <p className="text-gray-300 leading-relaxed">
            The portal is operated on a best-effort basis by the Alumni Cell,
            IIT Indore. Features may be updated, moderated, or archived at the
            end of each graduating cycle.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-yellow-400">
            4. Contact
          </h2>
          <p className="text-gray-300 leading-relaxed">
            For support or policy questions, email{" "}
            <a
              href="mailto:alumnicell@iiti.ac.in"
              className="text-yellow-400 underline"
            >
              alumnicell@iiti.ac.in
            </a>{" "}
            or visit{" "}
            <a
              href="https://alumnicell.iiti.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 underline"
            >
              alumnicell.iiti.ac.in
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
};

export default TermsOfService;
