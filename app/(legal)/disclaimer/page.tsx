import { Metadata } from 'next';
import classes from '../legal.module.css';
import { liveSiteUrl } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Read the disclaimer for using Becoming Matthew.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${liveSiteUrl}/disclaimer`,
  },
};

export default function Disclaimer() {
  return (
    <main className="standard-page-format">
      <section className={classes.legalSection}>
        <h2
          className={classes.legalHeader}
          data-testid="header-disclaimer-page"
        >
          GENERAL INFORMATION
        </h2>
        <p className={classes.legalParagraph}>
          Becoming Matthew (“company”, “I”, “we” or “us”) provides general
          educational information on various topics on this website as a public
          service, which should not be construed as professional, financial,
          real-estate, tax advice. These are my personal opinions only.
        </p>

        <p className={classes.legalParagraph}>
          The term “you” refers to anyone who uses, visits, and/or views the
          website.
        </p>

        <p className={classes.legalParagraph}>
          You agree to accept all parts of this Disclaimer by viewing this
          website or anything made available on or through this website,
          including but not limited to programs, products, services, opt-in
          gifts, e-books, videos, webinars, blog posts, e-newsletters,
          consultations, e-mails, social media, and/or other communication
          (collectively referred to as “Website”).
        </p>

        <p className={classes.legalParagraph}>
          Please read this Disclaimer carefully, and I reserve the right to
          modify it at any time without notice.
        </p>
        <p className={classes.legalParagraph}>
          <strong>
            By visiting and using this website, you accept and agree to be bound
            by this Disclaimer along with our Terms and Conditions and Privacy
            Policy. Your continued use of our website, programs, products,
            and/or services constitutes your acceptance of future changes and
            updates to this Disclaimer. You must not access or use our website
            if you do not wish to be bound by this Disclaimer.
          </strong>
        </p>
      </section>
      <section className={classes.legalSection}>
        <h2 className={classes.legalHeader}>GENERAL DISCLAIMER</h2>

        <p className={classes.legalParagraph}>
          <em>
            All content and information on this website including our programs,
            products and/or services is for informational and educational
            purposes only, does not constitute professional advice of any kind
            and does not establish any kind of professional-client relationship
            by your use of this website. A professional-client relationship with
            you is only formed after we have expressly entered into a written
            agreement with you that you have signed including our fee structure
            and other terms to work with you in a specific matter. Although we
            strive to provide accurate general information, the information
            presented here is not a substitute for any kind of professional
            advice, and you should not rely solely on this information. Always
            consult a professional in the area for your particular needs and
            circumstances before making any professional, legal, financial or
            tax-related decisions.
          </em>
        </p>

        <p className={classes.legalParagraph}>
          All content and information on this website including our programs,
          products, and/or services<em> </em>is for informational and
          educational purposes only, does not constitute professional advice,
          and does not establish any kind of professional-client relationship by
          your use of this website. A professional-client relationship with you
          is only formed after we have expressly entered into a written
          agreement with you that you have signed including our fee structure
          and other terms to represent you in a specific matter. Although we
          strive to provide accurate general information, the information
          presented here is not a substitute for any kind of professional
          advice, and you should not rely solely on this information. Always
          consult a professional in the area for your particular needs and
          circumstances before making any professional, legal, and financial or
          tax-related decisions.
        </p>
      </section>
      <section className={classes.legalSection}>
        <h2 className={classes.legalHeader}>
          AFFILIATE / THIRD-PARTY LINKS DISCLOSURE AND DISCLAIMER
        </h2>

        <p className={classes.legalParagraph}>
          We may partner with other businesses or become part of different
          affiliate marketing programs whose products or services may be
          promoted or advertised on the website in exchange for commissions
          and/or financial rewards when you click and/or purchase those products
          or services through our affiliate links.We will receive a commission
          if you purchase through our affiliate link at no extra cost to you.
        </p>

        <p className={classes.legalParagraph}>
          We may also recommend other products, services, coaches, and
          consultants but no such reference is intended to be an endorsement or
          statement that such information provided is accurate. We recommend
          these based on our personal experiences but it is still your
          responsibility to conduct your own due diligence to ensure you have
          obtained complete accurate information about such products, services,
          coaches, and consultants.
        </p>

        <p className={classes.legalParagraph}>
          These affiliate or third-party relationships in no way compromise the
          integrity of the content, information, services, and materials being
          presented to you here, and you are under no obligation to click on
          these affiliate links to purchase those products or services being
          offered. These affiliate programs are selected based on personal
          experiences and preferences.
        </p>

        <p className={classes.legalParagraph}>
          Although we provide these affiliate links on the website for your
          convenience, we have no control over these external websites and they
          are solely responsible for their own content and information
          presented. Therefore, Becoming Matthew and/or its officers, employees,
          successors, shareholders, joint venture partners, or anyone else
          working with us cannot be held liable or responsible for any content
          presented on these external websites and for any damages resulting
          from them.
        </p>

        <p className={classes.legalParagraph}>
          This disclosure policy applies to all affiliate links we share on our
          website, social media, emails, programs, products such as courses,
          ebooks, services, and any other means of communication with you.
        </p>
      </section>
      <section className={classes.legalSection}>
        <h2 className={classes.legalHeader}>
          EARNINGS DISCLAIMER, TESTIMONIALS AND OTHER DISCLAIMERS
        </h2>

        <p className={classes.legalParagraph}>
          We may disclose our income reports and success results of our current
          or former customers including product reviews and testimonials on the
          website from time to time. These income reports, product reviews, and
          testimonials are accurate and strictly for informational purposes
          only.
        </p>

        <p className={classes.legalParagraph}>
          We share this information asexamples withyou but it does not serve as
          a guarantee or promise of any kind for your results and successes if
          you decide to use the same information, reviews, products, services,
          tips, and techniques offered here.
        </p>

        <p className={classes.legalParagraph}>
          All the testimonials included on our websites, programs, products
          and/or services are real-world examples and stories of other people’s
          experiences with our programs, products and/or services. But they are
          not intended to serve as a guarantee that you will achieve the same or
          similar results. Each individual’s performance is different and your
          results will vary accordingly.
        </p>

        <p className={classes.legalParagraph}>
          You are encouraged to perform your own due diligence and research and
          are solely responsible for your earnings and results. Your earning
          potential and results are contingent upon your personal circumstances,
          abilities, experience, and skills. Therefore, you agree not to hold us
          and/or our officers, employees, successors, shareholders, joint
          venture partners or anyone else working with us liable for any of your
          successes or failures directly or indirectly related to the
          information, reports, reviews, products and/or services presented to
          you here.
        </p>
      </section>
      <section className={classes.legalSection}>
        <h2 className={classes.legalHeader}>
          SPONSORED POSTS / REVIEWS DISCLAIMER
        </h2>

        <p className={classes.legalParagraph}>
          We may include sponsored blog posts on our website from time to time
          for products or services we recommend or those that have been valuable
          in our personal experience or use.
        </p>

        <p className={classes.legalParagraph}>
          We may review different products, services, and other resources to
          provide reviews of books, services, and any other recommendations to
          you. We may receive incentives, discounts, compensation, or free
          products in exchange for our reviews and sponsored content. All such
          reviews and sponsored posts are solely our honest opinions made in
          good faith. You are always encouraged to perform your own due
          diligence before relying on them.
        </p>

        <p className={classes.legalParagraph}>
          We share this information asexamples withyou but it does not serve as
          a guarantee or promise of any kind for your results and successes if
          you decide to use the same information, reviews, products, services,
          tips, and techniques offered here.
        </p>

        <p className={classes.legalParagraph}>
          You are encouraged to perform your own due diligence and research and
          are solely responsible for your decisions, purchases from our
          affiliate links, sponsored content, and results. Your earning
          potential and results are contingent upon your personal circumstances,
          abilities, experience, and skills. Therefore, you agree not to hold us
          and/or our officers, employees, successors, shareholders, joint
          venture partners or anyone else working with us liable for any of your
          successes or failures directly or indirectly related to the
          information, reports, reviews, products and/or services presented to
          you here.
        </p>
      </section>
      <section className={classes.legalSection}>
        <h2 className={classes.legalHeader}>FAIRUSE DISCLAIMER</h2>

        <p className={classes.legalParagraph}>
          This website summarises written content including but not limited to
          posting product images from other websites, and logos of
          manufacturers. In doing so, no copyright is claimed for this kind of
          content on the website, and to the extent that such material may
          appear to be infringed, we assert that such alleged infringement is
          permissible under thefairuse principles of the New Zealand copyright
          laws. If you believe any material has been used in an unauthorized
          manner, please contact us at support@becomingmatthew.com
          <em>.</em>
        </p>
      </section>
      <section className={classes.legalSection}>
        <h2 className={classes.legalHeader}>NO WARRANTIES</h2>

        <p className={classes.legalParagraph}>
          ALL CONTENT, INFORMATION, PRODUCTS AND/OR SERVICES ON THE WEBSITE ARE
          “AS IS” AND “AS AVAILABLE” BASIS WITHOUT ANY REPRESENTATIONS OR
          WARRANTIES OF ANY KIND INCLUDING THE WARRANTIES OF MERCHANTABILITY OR
          FITNESS FOR ANY PURPOSE, EXPRESS OR IMPLIED TO THE FULL EXTENT
          PERMISSIBLE BY LAW. COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES AS
          TO THE CONTENT, INFORMATION, MATERIALS, PRODUCTS, AND/OR SERVICES
          PROVIDED ON THIS WEBSITE. COMPANY MAKES NO WARRANTIES THAT THE WEBSITE
          WILL PERFORM OR OPERATE TO MEET YOUR REQUIREMENTS OR THAT THE
          INFORMATION PRESENTED HERE WILL BE COMPLETE, CURRENT, OR ERROR-FREE.
          COMPANY DISCLAIMS ALL WARRANTIES, IMPLIED AND EXPRESS FOR ANY PURPOSE
          TO THE FULL EXTENT PERMITTED BY LAW.
        </p>
      </section>
      <section className={classes.legalSection}>
        <h2 className={classes.legalHeader}>LIMITATION OF LIABILITY</h2>

        <p className={classes.legalParagraph}>
          You agree that under no circumstances, we and/or our officers,
          employees, successors, shareholders, joint venture partners, or anyone
          else working with us shall be liable for any direct, indirect,
          incidental, consequential, equitable, special, punitive, exemplary or
          any other damages resulting from your use of this website including
          but not limited to all the content, information, products, services
          and graphics presented here.
        </p>

        <p className={classes.legalParagraph}>
          You expressly agree that your use of the website is at your sole risk
          and that you are solely responsible for the accuracy of the personal
          and any information you provide, the outcome of your actions, personal
          and business results, and for all other use in connection with the
          website.
        </p>

        <p className={classes.legalParagraph}>
          You also expressly agree that we and/or our officers, employees,
          successors, shareholders, joint venture partners, or anyone else
          working with us shall not be liable to you for any damages resulting
          from 1) any errors or omissions on the website, delay or denial of any
          products or services, failure of performance of any kind, interruption
          in the operation and your use of the website, website attacks
          including computer virus, hacking of information, and any other system
          failures; 2) any loss of income, use, data, revenue, profits, business
          or any goodwill related to the website; 3) any theft or unauthorized
          access by the third party of your information from the website
          regardless of our negligence; and 4) any use or misuse of the
          information, products and/or services offered here.
        </p>

        <p className={classes.legalParagraph}>
          This limitation of liability shall apply whether such liability arises
          from negligence, breach of contract, tort or any other legal theory of
          liability. You agree that we provide no express or implied guarantees
          to you for the content presented here, and you accept that no
          particular results are being promised to you here.
        </p>
      </section>
      <section className={classes.legalSection}>
        <h2 className={classes.legalHeader}>INDEMNIFICATION</h2>

        <p className={classes.legalParagraph}>
          You agree to indemnify and hold the Company and/or its officers,
          employees, successors, shareholders, joint venture partners, or anyone
          else working with us harmless from all losses, claims, damages,
          demands, actions, suits, proceedings, or judgments, including costs,
          expenses and reasonable attorneys’ fees (“Liabilities”) assessed
          against or otherwise incurred by you arising, in whole or in part,
          from: (a) actions or omissions, whether done negligently or otherwise,
          by you, your agents, directors, officers, employees or
          representatives; (b) all your actions and use of our websites
          including purchasing programs, products and services; (c) violation of
          any laws, rules, regulations or ordinances by you; or (d) violation of
          any terms and conditions of this website by you or anyone related to
          you; e) infringement by you or any other user of your account of any
          intellectual property or other rights of anyone. The company will
          notify you promptly of any such claims or liability and reserves the
          right to defend such claim, liability, or damage at your expense. You
          shall fully cooperate and assist us if requested, without any cost, to
          defend any such claims.
        </p>
      </section>
    </main>
  );
}
