import { Compass, Coins, Flame } from 'lucide-react';

const stories = [
  {
    icon: Compass,
    title: '遶境守護',
    description: '每年大甲媽遶境，數十萬信眾虔誠隨行。我們將這份信仰力量，濃縮於每一件隨身小物，讓媽祖的守護不分時空。',
  },
  {
    icon: Coins,
    title: '財庫開運',
    description: '鎮瀾宮香火鼎盛，財運加持尤其靈驗。開運系列商品皆經財神殿加持，助您財源廣進、事業亨通。',
  },
  {
    icon: Flame,
    title: '香火日常',
    description: '將廟宇的馨香與祝福帶入日常生活，讓每一天都有信仰相伴。從辦公桌到居家角落，處處皆是修行。',
  },
];

export function StorySection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
            系列故事
          </h2>
          <p className="mt-3 text-muted-foreground">
            三百年信仰傳承，現代工藝演繹
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {stories.map((story, index) => (
            <div
              key={story.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 md:p-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <story.icon className="h-6 w-6" />
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl font-semibold text-foreground">
                {story.title}
              </h3>

              {/* Description */}
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {story.description}
              </p>

              {/* Decorative line */}
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
