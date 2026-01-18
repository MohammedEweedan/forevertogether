import BackgroundLogo from "@/components/BackgroundLogo";
import FadeIn from "@/components/FadeIn";
import FloatingHearts from "@/components/FloatingHearts";
import Header from "@/components/Header";
import ScrollTo from "@/components/ScrollTo";
import YouTubeAudio from "@/components/YouTubeAudio";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative">
      <FloatingHearts />
      <BackgroundLogo />

      <Header />

      <div className="snap-y-container relative z-20">
        <section
          id="top"
          className="snap-section flex items-center justify-center px-6 py-16"
        >
          <div className="w-full max-w-5xl">
            <FadeIn>
              <div className="glass shadow-soft rounded-3xl p-6 sm:p-12">
                <div className="grid gap-8 items-center sm:grid-cols-2">
                  <div>
                    <h1 className="mt-3 text-4xl sm:text-6xl font-semibold leading-[1.05]">
                      For{" "}
                      <span className="title-gradient">my ray of sunshine</span>{" "}
                      🥰
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-8 opacity-90">
                      To the love of my life, I made this little place on the
                      internet to remind you (always) how madly I love you.
                    </p>

                    <div className="mt-8">
                      <YouTubeAudio videoId="s6IQIc98wIg" />
                    </div>
                  </div>

                  <div>
                    <Image
                      src="/forevertogether/4.jpg"
                      alt="Memory 4"
                      width={1000}
                      height={1600}
                      className="w-full h-auto"
                      sizes="(max-width: 640px) 100vw, 50vw"
                      priority
                    />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="snap-section flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-5xl">
            <FadeIn>
              <div className="glass shadow-soft rounded-3xl p-8 sm:p-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-semibold">
                  A collection of<span className="accent"> notes </span>
                </h2>
                <p className="mt-4 max-w-3xl leading-8 opacity-90">
                  Like turning pages in our story. Swipe left/right — it snaps
                  into place. ❤️🫶🏼
                </p>

                <div className="mt-8 overflow-x-auto snap-x h-swipe">
                  <div className="flex gap-5 min-w-max pb-2">
                    {[
                      {
                        label: "A note",
                        text: "I feel so blessed to have you in my life 🥰",
                      },
                      {
                        label: "A promise",
                        text: "I’ll always choose you, always 🫶🏼",
                      },
                      {
                        label: "A memory",
                        text: "Every day with you is one of my favorites 💕",
                      },
                      {
                        label: "A forever",
                        text: "Eternity with you is my goal 💖",
                      },
                    ].map((c) => (
                      <div
                        key={c.label}
                        className="w-[86vw] max-w-[760px] shrink-0 snap-center"
                      >
                        <div className="glass shadow-soft rounded-3xl p-8 sm:p-12">
                          <p className="text-sm tracking-widest uppercase opacity-70">
                            {c.label}
                          </p>
                          <p className="mt-4 text-2xl sm:text-3xl font-semibold leading-tight">
                            {c.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="snap-section flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-5xl">
            <FadeIn>
              <div className="glass shadow-soft rounded-3xl p-6 sm:p-12">
                <div className="grid gap-8 items-center sm:grid-cols-2">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-semibold">
                      Things I <span className="accent">love</span> about you
                    </h2>
                    <p className="mt-4 max-w-3xl leading-8 opacity-90">
                      You’re the most beautiful human to ever exist ❤️. You make
                      ordinary days feel softer. I love your laugh, your
                      kindness, and the way you care so deeply. You’re more
                      perfect than the “wife” I made up in my head as a kid —
                      and somehow, I still got blessed with you.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      {[
                        "Your smile (it’s my fav) 🥰",
                        "How you make me feel loved 🫶🏼",
                        "Your heart and your mind ❤️",
                        "How you treat me and how you care 💕",
                      ].map((t) => (
                        <div key={t} className="glass rounded-2xl p-5">
                          <p className="font-medium">{t}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 shadow-soft">
                    <Image
                      src="/forevertogether/3.jpg"
                      alt="Memory 3"
                      width={1400}
                      height={1000}
                      className="w-full h-auto"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section
          id="video"
          className="snap-section flex items-center justify-center px-6 py-16"
        >
          <div className="w-full max-w-5xl">
            <FadeIn>
              <div className="glass shadow-soft rounded-3xl p-6 sm:p-12">
                <div className="grid gap-8 items-center sm:grid-cols-2">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-semibold">
                      A little break 💋
                    </h2>
                    <p className="mt-4 max-w-3xl leading-8 opacity-90">
                      Just a little pause in the middle of our story so u can
                      catch your breath. ❤️
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 shadow-soft">
                    <Image
                      src="/forevertogether/1.jpg"
                      alt="Memory 1"
                      width={1400}
                      height={1000}
                      className="w-full h-auto"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="snap-section flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-5xl">
            <FadeIn>
              <div className="glass shadow-soft rounded-3xl p-6 sm:p-12">
                <div className="grid gap-8 items-center sm:grid-cols-2">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-semibold">
                      Little moments I keep{" "}
                      <span className="accent">forever</span>
                    </h2>
                    <p className="mt-4 max-w-3xl leading-8 opacity-90">
                      The kind of memories that make me smile for no reason… and
                      then I remember it’s you. 🥰💕
                    </p>
                    <p className="mt-4 max-w-3xl leading-8 opacity-90">
                      My ray of sunshine — I love you more than words, and I’ll
                      keep loving you in every lifetime. ❤️🫶🏼
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 shadow-soft">
                    <Image
                      src="/forevertogether/6.jpg"
                      alt="Memory 6"
                      width={1400}
                      height={1000}
                      className="w-full h-auto"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="snap-section flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-5xl">
            <FadeIn>
              <div className="glass shadow-soft rounded-3xl p-6 sm:p-12">
                <div className="grid gap-8 items-center sm:grid-cols-2">
                  <div className="order-2 sm:order-1">
                    <h2 className="text-3xl sm:text-4xl font-semibold">
                      A few paragraphs, just for you
                    </h2>
                    <div className="mt-6 space-y-4 max-w-3xl leading-8 opacity-90">
                      <p>
                        You are my ray of sunshine 🥰 — the kind of love that
                        makes my whole life feel warmer. I love you in the big
                        ways, and I love you in the quiet ones too.
                      </p>
                      <p>
                        I want to spend eternity with you in this life and the
                        next 💖. I want every version of “forever” with you — my
                        wife, my love, my hayati, روحي.
                      </p>
                      <p>
                        If you ever forget how loved you are, come back here.
                        I’ll leave the hearts floating 💕 and I’ll be right here
                        loving you. ❤️🫶🏼💋
                      </p>
                    </div>
                  </div>

                  <div className="order-1 sm:order-2 overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 shadow-soft">
                    <Image
                      src="/forevertogether/7.jpg"
                      alt="Memory 7"
                      width={1400}
                      height={1000}
                      className="w-full h-auto"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section
          id="us"
          className="snap-section flex items-center justify-center px-6 py-16"
        >
          <div className="w-full max-w-5xl">
            <FadeIn>
              <div className="glass shadow-soft rounded-3xl p-8 sm:p-12">
                <h2 className="text-3xl sm:text-4xl font-semibold text-center">
                  Us <span className="accent">forever ❤️ 💍</span>
                </h2>

                <div className="mt-8 grid gap-4 sm:grid-cols-1">
                  <div className="overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 shadow-soft">
                    <Image
                      src="/forevertogether/8.jpg"
                      alt="Us 1"
                      width={500}
                      height={900}
                      className="w-full h-auto"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="opacity-80">Made with love for my bobo 🫶🏼</p>
                  <ScrollTo
                    targetId="top"
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white accent-bg shadow-soft"
                  >
                    Back to the top
                  </ScrollTo>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    </div>
  );
}
