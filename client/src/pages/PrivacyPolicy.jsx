import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-pagebg text-gray-200">
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <header className="space-y-2 border-b border-gray-700 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400">
            YearBook Portal — Alumni Cell, Indian Institute of Technology Indore
            (yearbook.iiti.ac.in &amp; alumnicell.iiti.ac.in)
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-yellow-400">
            1. Information We Collect
          </h2>
          <p className="text-gray-300 leading-relaxed">
            When you sign in with your official IIT Indore Google account
            (`@iiti.ac.in`), we verify your Google identity token and collect
            your name, institutional email address, and Google profile picture
            solely to authenticate your portal account and determine student or
            graduating-batch eligibility.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Graduating members completing a yearbook profile voluntarily
            provide academic details (roll number, department, program), contact
            details (phone number and personal email verified by one-time
            passcode), yearbook biography/answers, profile photograph, peer
            testimonials, poll votes, and campus memory map submissions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-yellow-400">
            2. How We Use Information
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>
              Authenticate portal sessions using secure HTTP-only cookies and
              server-side session digests.
            </li>
            <li>
              Verify ownership before profile creation or profile edits using
              one-time passcodes (via SMS and SMTP email delivery).
            </li>
            <li>
              Display member-approved yearbook profiles, comments, poll results,
              and campus memories to authenticated IIT Indore community
              members.
            </li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            We do not sell, rent, or trade personal data or Google user data to
            third parties, and we do not use Google data for advertising.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-yellow-400">
            3. Data Protection &amp; Access Controls
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Personal contact fields (personal email address, phone numbers, and
            mailing address) are restricted to your own account view and
            excluded from general member directory listings. Uploaded media
            assets are stored using non-identifying timestamped keys.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-yellow-400">
            4. Contact &amp; Data Requests
          </h2>
          <p className="text-gray-300 leading-relaxed">
            For questions, corrections, or removal requests regarding your
            yearbook record, contact Alumni Cell, IIT Indore at{" "}
            <a
              href="mailto:alumnicell@iiti.ac.in"
              className="text-yellow-400 underline"
            >
              alumnicell@iiti.ac.in
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
