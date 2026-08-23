import type { ChapterDefinition } from '../../domain/chapter/types';

interface ChapterMapProps {
  chapters: ChapterDefinition[];
  getStatus: (chapter: ChapterDefinition) => string;
}

export function ChapterMap({ chapters, getStatus }: ChapterMapProps) {
  return (
    <section aria-label="Chapter Map">
      <h2>🗺️ 前端知识地图</h2>
      <div>
        {chapters.map((chapter) => (
          <article key={chapter.id}>
            <h3>
              Chapter {String(chapter.order).padStart(2, '0')} · {chapter.title}
            </h3>
            <p>{chapter.description}</p>
            <p>{getStatus(chapter)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
