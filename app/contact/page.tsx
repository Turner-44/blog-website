import { liveSiteUrl, siteName } from '@/utils/seo';
import { Metadata } from 'next';

const description =
  'Get in touch with Matthew — for questions, collaborations, or conversations about personal growth.';
const pageTitle = 'Contact';

export const metadata: Metadata = {
  title: pageTitle,
  description,
  alternates: {
    canonical: `${liveSiteUrl}/contact`,
  },
  openGraph: {
    title: `${siteName} | ${pageTitle}`,
    description: description,
    url: `${liveSiteUrl}/contact`,
  },
};

export default function Contact() {
  return (
    <main className="narrow-page-format">
      <header>
        <h1
          className="text-3xl font-bold tracking-tight text-center p-5"
          data-testid="header-contact-page"
        >
          Contact Details
          <div className="mx-auto w-1/4 mt-0.5 duration-500 border-b-2 border-black rounded" />
        </h1>
      </header>
      <section aria-labelledby="contact-instructions">
        <p>
          I am always looking for opportunities to connect and collaborate with
          others.
        </p>
        <p>
          <br />
          Flick me a message if you would like to work together.
        </p>
        <p>
          <br />
          If you are looking for a slightly less formal connection, head over to
          the{' '}
          <a href="https://www.instagram.com/becomingmatthew/">
            Instagram page
          </a>
          . <br />I would love to connect with you there.
        </p>
      </section>
    </main>
  );
}

// TODO: Add ability to email
