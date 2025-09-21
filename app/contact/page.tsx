export default function Contact() {
    return (
        <main className="mx-auto max-w-3xl px-4">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-center p-5">
                    Contact Details
                </h1>
            </header>
            <section aria-labelledby="contact-instructions">
                <p>
                    I am always looking for opportunities to connect and
                    collaborate with others.
                </p>
                <p>
                    <br />
                    Flick me a message if you would like to work together.
                </p>
                <p>
                    <br />
                    If you are looking for a slightly less formal connection,
                    head over to the{' '}
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
