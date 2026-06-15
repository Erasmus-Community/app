import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <main className="container" style={{ maxWidth: 760 }}>
      <h1>Terms and Conditions</h1>
      <p className="muted">Last updated: June 14, 2026</p>

      <section className="stack" style={{ lineHeight: 1.7, fontSize: 15 }}>
        <p>
          Welcome to Erasmus+ NGO Hub (<strong>"the Platform"</strong>). The Platform is operated by
          [COMPANY_NAME] (<strong>"we"</strong>, <strong>"us"</strong>, or <strong>"our"</strong>).
          By creating an account or using the Platform you agree to these Terms and Conditions
          (<strong>"Terms"</strong>). If you do not agree, do not use the Platform.
        </p>

        <h2>1. About the Platform</h2>
        <p>
          Erasmus+ NGO Hub is a networking tool for non-governmental organizations and individuals
          involved in Erasmus+ projects funded by the European Commission. The Platform allows users
          to discover partner organizations, post and respond to participant vacancies, coordinate
          project activities, and locate fellow participants on a shared alumni map.
        </p>
        <p>
          The Platform is not affiliated with, endorsed by, or officially connected to the European
          Commission or any European Union institution.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          You must be at least 16 years of age to create an account. By registering you confirm that
          the information you provide is accurate and that you have the authority to accept these
          Terms on your own behalf and, if you register an organization, on behalf of that
          organization.
        </p>

        <h2>3. Accounts</h2>
        <p>
          You may create a personal account with your name, email address, and a password. You are
          responsible for keeping your login credentials confidential and for all activity that
          occurs under your account. You must notify us promptly if you suspect unauthorized access.
        </p>
        <p>
          You may optionally register an organization. Organization registrations are subject to
          review and approval by our team. We reserve the right to reject or revoke an organization's
          registration at our sole discretion and without obligation to state a reason.
        </p>

        <h2>4. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul style={{ paddingLeft: 24 }}>
          <li>provide false or misleading information about yourself or your organization;</li>
          <li>use the Platform for any purpose unrelated to Erasmus+ or youth/education/sport cooperation;</li>
          <li>harass, abuse, or threaten other users;</li>
          <li>scrape, crawl, or automatically collect data from the Platform;</li>
          <li>attempt to gain unauthorized access to any part of the Platform or its infrastructure;</li>
          <li>upload malicious content, spam, or unsolicited commercial messages;</li>
          <li>impersonate another person or organization;</li>
          <li>violate any applicable law or regulation.</li>
        </ul>
        <p>
          We may suspend or terminate your account if you breach these Terms or if your conduct is
          harmful to the Platform or its community.
        </p>

        <h2>5. User content</h2>
        <p>
          You retain ownership of any content you submit (organization descriptions, bios, vacancy
          posts, project information). By submitting content you grant us a worldwide, royalty-free,
          non-exclusive licence to host, display, and distribute that content solely for the purpose
          of operating the Platform.
        </p>
        <p>
          You are solely responsible for the accuracy and legality of the content you post. We do not
          pre-screen user content but may remove or edit content that violates these Terms.
        </p>

        <h2>6. Alumni map and location data</h2>
        <p>
          The Platform offers an optional alumni map feature. If you choose to share your location,
          your city, country, and approximate coordinates will be visible to other users according to
          the visibility setting you select. You may update or remove your location at any time.
        </p>
        <p>
          The alumni map is publicly accessible. Pins set to "everyone" visibility will be visible to
          anyone who visits the map, including users who are not logged in.
        </p>

        <h2>7. Privacy and data protection</h2>
        <p>
          We collect and process personal data (name, email, location when provided, organization
          details) to operate the Platform. We process data on the following legal bases under the
          General Data Protection Regulation (GDPR):
        </p>
        <ul style={{ paddingLeft: 24 }}>
          <li><strong>Contract performance</strong> — processing necessary to provide you with the service you signed up for;</li>
          <li><strong>Legitimate interest</strong> — platform security, fraud prevention, and service improvement;</li>
          <li><strong>Consent</strong> — optional features such as location sharing on the alumni map.</li>
        </ul>
        <p>
          We do not sell your personal data to third parties. We may share data with service
          providers (hosting, email delivery) strictly for the purpose of operating the Platform.
          You have the right to access, rectify, erase, or port your personal data, and to withdraw
          consent at any time. To exercise these rights, contact us at the address below.
        </p>

        <h2>8. Cookies</h2>
        <p>
          The Platform uses session cookies that are strictly necessary to keep you logged in.
          We do not use advertising or analytics cookies.
        </p>

        <h2>9. Intellectual property</h2>
        <p>
          All Platform branding, design, and code (excluding user content) are owned by
          [COMPANY_NAME] or its licensors. You may not copy, modify, or distribute any part of the
          Platform without prior written permission.
        </p>

        <h2>10. Disclaimers</h2>
        <p>
          The Platform is provided <strong>"as is"</strong> and <strong>"as available"</strong>
          {" "}without warranties of any kind, express or implied, including but not limited to
          merchantability, fitness for a particular purpose, or non-infringement.
        </p>
        <p>
          We do not guarantee the accuracy, completeness, or reliability of any information posted by
          users, including organization details, OID numbers, vacancy listings, or project
          descriptions. You are responsible for independently verifying any information before
          relying on it.
        </p>
        <p>
          We are not a party to any agreement, partnership, or arrangement formed between users of
          the Platform.
        </p>

        <h2>11. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, [COMPANY_NAME] shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages, or any loss of data,
          revenue, or opportunities arising from your use of the Platform. Our total aggregate
          liability shall not exceed the amount you have paid us in the twelve months preceding the
          claim, or €100, whichever is greater.
        </p>

        <h2>12. Termination</h2>
        <p>
          You may delete your account at any time by contacting us. We may suspend or terminate your
          account at any time for breach of these Terms or for any reason with reasonable notice.
          Upon termination, your right to use the Platform ceases immediately. Sections that by their
          nature should survive (liability, intellectual property, disputes) will survive
          termination.
        </p>

        <h2>13. Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. We will notify registered users of material
          changes via email or an in-app notice. Continued use of the Platform after changes take
          effect constitutes acceptance of the revised Terms.
        </p>

        <h2>14. Governing law and disputes</h2>
        <p>
          These Terms are governed by the laws of Portugal. Any disputes shall be submitted to the
          competent courts of Lisbon, Portugal, without prejudice to any mandatory consumer
          protection provisions of your country of residence.
        </p>

        <h2>15. Contact</h2>
        <p>
          If you have questions about these Terms, please contact us at:{" "}
          <a href="mailto:contact@erasmusngohub.com">contact@erasmusngohub.com</a>.
        </p>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #e5e7eb" }}>
          <p className="muted">
            <Link to="/register">← Back to registration</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
