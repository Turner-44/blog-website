import Image from 'next/image';

export default function About() {
    return (
        <main className="mx-auto max-w-3xl px-4 space-y-5">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-center p-5">
                    About Me
                </h1>
                <div className="relative h-100 aspect-w-1 aspect-h-1">
                    <Image
                        src={`/images/about.png`}
                        alt={'About Me Image'}
                        className="object-cover object-center rounded-2xl"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        fill
                    />
                </div>
            </header>

            <section aria-labelledby="intro">
                <p className="text-center">
                    Hey, I’m Matthew and welcome to Becoming Matthew.
                </p>
                <br />

                <p>
                    After years in IT, I walked away from the comfort of the
                    career I knew in pursuit of something more meaningful.
                </p>
                <br />

                <p>
                    Over the past year, I’ve lived in multiple countries,
                    eventually settling in Quebec with barely any French — and
                    ran full speed toward a future full of uncertainty.
                </p>
                <br />

                <p>
                    Not because I had it all figured out… but because I believe
                    there’s more of me to discover.
                </p>
                <br />

                <p>
                    Becoming Matthew is where I document the messy, honest, and
                    often humorous reality of my personal growth journey.
                </p>
                <br />

                <p>
                    It’s a space to explore, unlearn, rebuild, and redefine what
                    a good life looks like, on our own terms.
                </p>
            </section>

            <section aria-labelledby="purpose">
                <h2 id="purpose" className="text-xl font-semibold mb-4">
                    What Becoming Matthew Is Really About
                </h2>

                <p>This isn’t a “how-to” guide.</p>
                <br />

                <p>
                    It’s more of a “here’s what I’ve learned while trying to
                    figure it out” kind of blog.
                </p>
                <br />

                <p>
                    It’s built on the belief that self-improvement doesn’t have
                    to be preachy, overwhelming, or perfect — it just needs to
                    be real.
                </p>
                <br />

                <p>
                    If you’re tired of personal development that feels like a
                    performance… this is for you.
                </p>
            </section>

            <section aria-labelledby="values">
                <h2
                    id="values"
                    className="text-xl font-semibold text-center mb-4"
                >
                    Becoming Matthew is grounded in the values of:
                </h2>

                <div className="space-y-4">
                    <div className="text-center">
                        <strong>Curiosity</strong>
                        <br />
                        Questioning what’s known and staying open to what’s not
                    </div>

                    <div className="text-center">
                        <strong>Persistence </strong>
                        <br />
                        Failure is temporary, but our commitment to growth is
                        not
                    </div>
                    <div className="text-center">
                        <strong>Open-mindedness</strong>
                        <br />
                        Challenging norms and embracing change
                    </div>

                    <div className="text-center">
                        <strong>Humour</strong>
                        <br />
                        Easing the discomfort of growth with laughter
                    </div>

                    <div className="text-center">
                        <strong>Humility</strong>
                        <br />
                        Never losing sight of our shared humanity
                    </div>

                    <div className="text-center">
                        <strong>Compassion</strong>
                        <br />
                        Showing ourselves and others the compassion we deserve
                    </div>
                </div>
            </section>

            <section aria-labelledby="contact">
                <h2 id="contact" className="text-xl font-semibold mb-4">
                    Find Me Elsewhere
                </h2>

                <p>
                    I post more daily reflections, mini mindset shifts, and
                    behind-the-scenes experiments
                    <a
                        href="https://www.instagram.com/becomingmatthew/"
                        data-type="link"
                        data-id="https://www.instagram.com/becomingmatthew/"
                    >
                        on Instagram
                    </a>
                    .
                </p>
                <br />

                <p>
                    It’s where I show the reel side of the journey — testing
                    habits, sharing life lessons, and laughing at myself along
                    the way.
                </p>
                <br />

                <p>
                    Want to collaborate or just say hey?{' '}
                    <a href="https://becomingmatthew.com/contact">
                        Reach out here
                    </a>
                    .
                </p>
            </section>
        </main>
    );
}
