import { useEffect, useState, type AnimationEvent } from "react";
import "./App.css";

type Photo = {
  src: string;
  alt: string;
  caption: string;
};

const photos: Photo[] = [
  { src: "/images/IMG_6051.JPG", alt: "아논쨩의 사진", caption: "2025년 11월 8일" },
  { src: "/images/IMG_6336.JPG", alt: "아논쨩의 사진", caption: "2025년 11월 15일" },
  { src: "/images/IMG_7349.JPG", alt: "아논쨩의 사진", caption: "2025년 12월 24일" },
  { src: "/images/IMG_7361.JPG", alt: "아논쨩의 사진", caption: "2025년 12월 24일" },
  { src: "/images/IMG_8233.JPG", alt: "아논쨩의 사진", caption: "2026년 2월 6일" },
  { src: "/images/IMG_8616.JPG", alt: "아논쨩의 사진", caption: "2026년 2월 14일" },
  { src: "/images/IMG_8781.JPG", alt: "아논쨩의 사진", caption: "2026년 2월 15일" },
  { src: "/images/IMG_8803.JPG", alt: "아논쨩의 사진", caption: "2026년 2월 15일" },
  { src: "/images/IMG_9615.JPG", alt: "아논쨩의 사진", caption: "2026년 3월 8일" },
  { src: "/images/IMG_9863.JPG", alt: "아논쨩의 사진", caption: "2026년 3월 20일" },
  { src: "/images/IMG_0200.jpeg", alt: "아논쨩의 사진", caption: "2026년 3월 31일" },
  { src: "/images/IMG_0220.JPG", alt: "아논쨩의 사진", caption: "2026년 4월 4일" },
  { src: "/images/IMG_0339.JPG", alt: "아논쨩의 사진", caption: "2026년 4월 5일" },
  { src: "/images/IMG_1362.JPG", alt: "아논쨩의 사진", caption: "2026년 5월 2일" },
  { src: "/images/IMG_1557.JPG", alt: "아논쨩의 사진", caption: "2026년 5월 17일" },
  { src: "/images/IMG_1568.JPG", alt: "아논쨩의 사진", caption: "2026년 5월 17일" },
  { src: "/images/IMG_2064.JPG", alt: "아논쨩의 사진", caption: "2026년 6월 6일" },
  { src: "/images/IMG_2193.JPG", alt: "아논쨩의 사진", caption: "2026년 6월 13일" },
  { src: "/images/IMG_3802.JPG", alt: "아논쨩의 사진", caption: "2026년 8월 14일" },
  { src: "/images/IMG_4150.jpeg", alt: "아논쨩의 사진", caption: "2026년 8월 29일" },
  { src: "/images/IMG_4658.jpeg", alt: "아논쨩의 사진", caption: "2026년 9월 6일" },
  { src: "/images/IMG_5031.jpeg", alt: "아논쨩의 사진", caption: "2026년 9월 24일" },
  { src: "/images/IMG_5205.jpeg", alt: "아논쨩의 사진", caption: "2026년 10월 2일" },
  { src: "/images/IMG_5318.JPG", alt: "아논쨩의 사진", caption: "2026년 10월 10일" },
];

function App() {
  const [activePhoto, setActivePhoto] = useState(0);
  const [pendingPhoto, setPendingPhoto] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<"next" | "previous">("next");
  const [autoSlide, setAutoSlide] = useState(true);
  const hasPhotos = photos.length > 0;
  const photo = photos[activePhoto];

  useEffect(() => {
    if (!autoSlide || photos.length < 2 || pendingPhoto !== null) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSlideDirection("next");
      setPendingPhoto((activePhoto + 1) % photos.length);
    }, 1300);

    return () => window.clearInterval(intervalId);
  }, [activePhoto, autoSlide, pendingPhoto]);

  const showPhoto = (index: number, direction: "next" | "previous") => {
    if (pendingPhoto === null && index !== activePhoto) {
      setSlideDirection(direction);
      setPendingPhoto(index);
    }
  };

  const finishSlide = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || pendingPhoto === null) {
      return;
    }

    setActivePhoto(pendingPhoto);
    setPendingPhoto(null);
  };

  const showPreviousPhoto = () => {
    showPhoto((activePhoto - 1 + photos.length) % photos.length, "previous");
  };

  const showNextPhoto = () => {
    showPhoto((activePhoto + 1) % photos.length, "next");
  };

  return (
    <main className="birthday-page">
      <div className="decoration decoration-star" aria-hidden="true">
        ✳
      </div>
      <div className="decoration decoration-heart" aria-hidden="true">
        ♥
      </div>

      <header className="page-header">
        <p className="eyebrow">
          <span aria-hidden="true">✷</span> A LITTLE BIRTHDAY SURPRISE{" "}
          <span aria-hidden="true">✷</span>
        </p>
        <h1>
          아논쨩,
          <br />
          <span>생일 축하해!</span>
        </h1>
        <p className="intro">오늘 하루가 반짝이는 행복으로 가득하길 바라며</p>
      </header>

      <section className="gallery-section" aria-label="아논쨩의 사진 갤러리">
        <div className="section-heading">
          <span className="section-sparkle" aria-hidden="true">
            ✦
          </span>
          <h2>우리의 반짝이는 순간</h2>
          <span className="section-sparkle" aria-hidden="true">
            ✦
          </span>
        </div>

        {hasPhotos && (
          <label className="slideshow-toggle">
            <input
              type="checkbox"
              checked={autoSlide}
              onChange={(event) => setAutoSlide(event.target.checked)}
            />
            <span>자동 슬라이드</span>
          </label>
        )}

        <div className={`gallery-card${hasPhotos ? " has-photo" : ""}`}>
          <button
            className="gallery-arrow gallery-arrow-previous"
            type="button"
            onClick={showPreviousPhoto}
            disabled={!hasPhotos || pendingPhoto !== null}
            aria-label="이전 사진"
          >
            ‹
          </button>

          {hasPhotos ? (
            <div className="gallery-image-viewport">
              <div
                className={`gallery-image-track${pendingPhoto !== null ? ` is-sliding slide-${slideDirection}` : ""}`}
                onAnimationEnd={finishSlide}
              >
                {slideDirection === "previous" && pendingPhoto !== null ? (
                  <>
                    <img
                      className="gallery-image"
                      src={photos[pendingPhoto].src}
                      alt={photos[pendingPhoto].alt}
                    />
                    <img
                      className="gallery-image"
                      src={photo.src}
                      alt={photo.alt}
                    />
                  </>
                ) : (
                  <>
                    <img
                      className="gallery-image"
                      src={photo.src}
                      alt={photo.alt}
                    />
                    <img
                      className="gallery-image"
                      src={photos[pendingPhoto ?? (activePhoto + 1) % photos.length].src}
                      alt={photos[pendingPhoto ?? (activePhoto + 1) % photos.length].alt}
                    />
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="gallery-placeholder">
              <span className="placeholder-sun" aria-hidden="true">
                ✹
              </span>
              <span className="placeholder-cake" aria-hidden="true">
                🎂
              </span>
              <p>아논쨩의 사진이 들어갈 자리</p>
              <span className="placeholder-hint">
                사진을 추가하면 좌우로 넘겨볼 수 있어요
              </span>
            </div>
          )}

          <button
            className="gallery-arrow gallery-arrow-next"
            type="button"
            onClick={showNextPhoto}
            disabled={!hasPhotos || pendingPhoto !== null}
            aria-label="다음 사진"
          >
            ›
          </button>
        </div>

        {hasPhotos && (
          <>
            <p className="photo-caption">{photo.caption}</p>
            <div className="gallery-pagination" aria-label="사진 페이지">
              {photos.map((item, index) => (
                <button
                  className={`pagination-dot${index === activePhoto ? " active" : ""}`}
                  key={item.src}
                  type="button"
                  onClick={() =>
                    showPhoto(index, index > activePhoto ? "next" : "previous")
                  }
                  disabled={pendingPhoto !== null}
                  aria-label={`${index + 1}번째 사진 보기`}
                  aria-current={index === activePhoto ? "true" : undefined}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="letter-card" aria-labelledby="letter-title">
        <div className="letter-top">
          <span className="letter-stamp" aria-hidden="true">
            ♡
          </span>
          <span className="letter-date">FOR YOUR SPECIAL DAY</span>
        </div>
        <h2 id="letter-title">Dear. 아논쨩</h2>
        <div className="letter-copy">
          <p>아논쨩, 생일 진심으로 축하해!</p>
          <p>
            네가 웃는 날이 오늘처럼 언제나 많았으면 좋겠어.
            <br />
            좋아하는 것들로 가득한, 세상에서 가장 행복한 하루 보내길 바라!
          </p>
          <p>태어나줘서 고맙고, 앞으로도 오래오래 함께하자.</p>
        </div>
        <p className="letter-signature">
          너를 아끼는 마음을 담아 <span aria-hidden="true">♡</span>
        </p>
      </section>

      <footer className="page-footer">
        made with love for anon <span aria-hidden="true">♡</span>
      </footer>
    </main>
  );
}

export default App;
