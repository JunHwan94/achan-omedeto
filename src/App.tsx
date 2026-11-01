import { useState } from "react";
import "./App.css";

type Photo = {
  src: string;
  alt: string;
  caption: string;
};

const photos: Photo[] = [];

function App() {
  const [activePhoto, setActivePhoto] = useState(0);
  const hasPhotos = photos.length > 0;
  const photo = photos[activePhoto];

  const showPreviousPhoto = () => {
    setActivePhoto((current) => (current - 1 + photos.length) % photos.length);
  };

  const showNextPhoto = () => {
    setActivePhoto((current) => (current + 1) % photos.length);
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

        <div className={`gallery-card${hasPhotos ? " has-photo" : ""}`}>
          <button
            className="gallery-arrow gallery-arrow-previous"
            type="button"
            onClick={showPreviousPhoto}
            disabled={!hasPhotos}
            aria-label="이전 사진"
          >
            ‹
          </button>

          {hasPhotos ? (
            <img className="gallery-image" src={photo.src} alt={photo.alt} />
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
            disabled={!hasPhotos}
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
                  onClick={() => setActivePhoto(index)}
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
