import { useEffect, useRef, useState } from "react";
import "./App.css";

type Photo = {
  src: string;
  alt: string;
  caption: string;
};

const createPhoto = (filename: string, caption: string): Photo => ({
  src: `${import.meta.env.BASE_URL}images/${filename}`,
  alt: "아논쨩의 사진",
  caption,
});

const photos: Photo[] = [
  createPhoto("IMG_6051.JPG", "銀杏とあちゃん"),
  createPhoto("IMG_6336.JPG", "거제 야호~ 후 아쨩"),
  createPhoto("IMG_7349.JPG", "이순신장군과 아쨩"),
  createPhoto("IMG_7361.JPG", "🎄クリスマスのあちゃん"),
  createPhoto("IMG_7644.JPG", "부산 짱짱큰 김밥 아쨩"),
  createPhoto("IMG_8616.JPG", "ギョンジュヤッホー"),
  createPhoto("IMG_8781.JPG", "해동용궁사 아쨩1"),
  createPhoto("IMG_8803.JPG", "해동용궁사 아쨩2"),
  createPhoto("IMG_9615.JPG", "이촌 카페 아쨩"),
  createPhoto("IMG_9863.JPG", "ポップコんとあちゃん"),
  createPhoto("IMG_0200.jpeg", "🌸夜桜のあちゃん"),
  createPhoto("IMG_0220.JPG", "🌸昼桜のあちゃん"),
  createPhoto("IMG_0339.JPG", "🌸ヨンサン公園のあちゃん"),
  createPhoto("IMG_1362.JPG", "🌱서울식물원 아쨩"),
  createPhoto("IMG_1557.JPG", "🌹立てるバラのあちゃん"),
  createPhoto("IMG_1568.JPG", "🌹座ってるバラのあちゃん"),
  createPhoto("IMG_2064.JPG", "1周年記念のあちゃん"),
  createPhoto("IMG_2193.JPG", "ママとあちゃん"),
  createPhoto("IMG_3802.JPG", "🐔삼계탕 아쨩"),
  createPhoto("IMG_4150.jpeg", "もぐもぐ本舗のあちゃん"),
  createPhoto("IMG_4658.jpeg", "レイちゃん追いかけるあちゃん"),
  createPhoto("IMG_5031.jpeg", "🚃ちちゃい電車のあちゃん🌊"),
  createPhoto("IMG_5205.jpeg", "🌽とうもろこしのあちゃん🌽"),
  createPhoto("IMG_5318.JPG", "비싼 호텔 뷔페에서 계란이 제일 맛있는 아쨩"),
];

const CARD_OFFSETS = [-3, -2, -1, 0, 1, 2, 3] as const;

// YouTube IFrame API 글로벌 타입 선언
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// 사용할 유튜브 영상 ID (여기에 11자리 유튜브 ID를 입력하세요)
const YOUTUBE_VIDEO_ID = "Q5aNqYkShNI";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isIntroFading, setIsIntroFading] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [lightboxPhoto, setLightboxPhoto] = useState<number | null>(null);
  const playerRef = useRef<any>(null);

  const hasPhotos = photos.length > 0;
  const photo = photos[activePhoto];

  // 1. YouTube API 초기화 (안전하게 음소거 백그라운드 자동 재생 시작)
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("hidden-youtube-player", {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          playsinline: 1,
          controls: 0,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
          },
        },
      });
    };
  }, []);

  // 2. 인트로 화면 클릭 시에만 인트로가 닫히고 소리가 켜짐 (자동 소멸 제거됨)
  const handleSkipIntro = () => {
    setIsIntroFading(true);
    window.setTimeout(() => setShowIntro(false), 500);

    // 사용자의 명시적 클릭이 발생했으므로 소리 음소거 해제 및 볼륨 설정
    if (playerRef.current && typeof playerRef.current.unMute === "function") {
      playerRef.current.unMute();
      playerRef.current.setVolume(80);
      playerRef.current.playVideo();
    }
  };

  // 3. 사진 자동 슬라이드 로직
  useEffect(() => {
    if (!autoSlide || photos.length < 2 || lightboxPhoto !== null || showIntro) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActivePhoto((prev) => (prev + 1) % photos.length);
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, [autoSlide, lightboxPhoto, showIntro]);

  // 4. 라이트박스 ESC 닫기 핸들러
  useEffect(() => {
    if (lightboxPhoto === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxPhoto(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [lightboxPhoto]);

  const showPreviousPhoto = () => {
    setActivePhoto((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const showNextPhoto = () => {
    setActivePhoto((prev) => (prev + 1) % photos.length);
  };

  return (
    <>
      {/* 화면 어디에도 전혀 보이지 않도록 인라인 스타일로 강제 숨김 처리된 플레이어 */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <div id="hidden-youtube-player" />
      </div>

      {/* 최초 접속 시 인트로 화면 (클릭해야만 닫히며 음악이 켜집니다) */}
      {showIntro && (
        <div
          onClick={handleSkipIntro}
          role="button"
          tabIndex={0}
          aria-label="화면을 터치하여 시작하기"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 252, 250, 0.96)",
            backdropFilter: "blur(6px)",
            cursor: "pointer",
            transition: "opacity 0.5s ease, visibility 0.5s ease",
            opacity: isIntroFading ? 0 : 1,
            visibility: isIntroFading ? "hidden" : "visible",
            userSelect: "none",
          }}
        >
          {/* 폴라로이드 사진 액자 */}
          <div
            style={{
              width: "240px",
              maxWidth: "75vw",
              backgroundColor: "#ffffff",
              padding: "10px 10px 16px 10px",
              borderRadius: "16px",
              boxShadow: "0 16px 36px rgba(75, 59, 64, 0.22)",
              border: "1px solid #f0dfd8",
              transform: "rotate(-3deg)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/sirokuma.jpeg`}
              alt="환영 사진"
              style={{
                width: "100%",
                height: "270px",
                maxHeight: "45vh",
                objectFit: "cover",
                borderRadius: "10px",
                display: "block",
              }}
            />
          </div>

          <p
            style={{
              marginTop: "1.2rem",
              color: "#8c7675",
              fontFamily: "'Zen Maru Gothic', sans-serif",
              fontSize: "0.95rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            タッチして ♬
          </p>
        </div>
      )}

      {/* 메인 생일 페이지 컨텐츠 */}
      <main className="birthday-page">
        <div className="decoration decoration-star" aria-hidden="true">
          ✳
        </div>
        <div className="decoration decoration-heart" aria-hidden="true">
          ♥
        </div>

        <header className="page-header">
          <div className="header-characters" aria-hidden="true">
            <img
              src={`${import.meta.env.BASE_URL}images/hachiware.png`}
              alt=""
              className="header-char char-left"
            />
            <img
              src={`${import.meta.env.BASE_URL}images/kitty.png`}
              alt=""
              className="header-char char-center"
            />
            <img
              src={`${import.meta.env.BASE_URL}images/momonkani.png`}
              alt=""
              className="header-char char-right"
            />
          </div>
          <p className="eyebrow">
            <span aria-hidden="true">✷</span> A LITTLE BIRTHDAY SURPRISE{" "}
            <span aria-hidden="true">✷</span>
          </p>
          <h1>
            愛音,
            <br />
            <span>25번째 생일 축하해!</span>
          </h1>
          <p className="intro">今日も幸せな1日になるように</p>
        </header>

        <section className="gallery-section" aria-label="아논쨩의 사진 갤러리">
          <div className="section-heading">
            <span className="section-sparkle" aria-hidden="true">
              ✦
            </span>
            <h2>24歳の愛音の可愛い瞬間</h2>
            <span className="section-sparkle" aria-hidden="true">
              ✦
            </span>
          </div>
          <div className={`gallery-card${hasPhotos ? " has-photo" : ""}`}>
            {hasPhotos ? (
              <div className="gallery-stage">
                <div className="gallery-deck-container">
                  {CARD_OFFSETS.map((offset) => {
                    const index =
                      (activePhoto + offset + photos.length * 10) % photos.length;
                    const item = photos[index];

                    const positionClass =
                      offset === 0
                        ? "card-pos-main"
                        : offset < 0
                        ? `card-pos-prev-${Math.abs(offset)}`
                        : `card-pos-next-${offset}`;

                    return (
                      <button
                        key={item.src}
                        className={`gallery-card-item ${positionClass}`}
                        type="button"
                        onClick={() => {
                          if (offset === 0) {
                            setLightboxPhoto(index);
                          } else if (offset < 0) {
                            showPreviousPhoto();
                          } else {
                            showNextPhoto();
                          }
                        }}
                        aria-label={`${item.caption} 사진 크게 보기`}
                      >
                        <img src={item.src} alt={item.alt} />
                      </button>
                    );
                  })}
                </div>

                <button
                  className="gallery-arrow gallery-arrow-previous"
                  type="button"
                  onClick={showPreviousPhoto}
                  aria-label="이전 사진"
                >
                  ‹
                </button>
                <button
                  className="gallery-arrow gallery-arrow-next"
                  type="button"
                  onClick={showNextPhoto}
                  aria-label="다음 사진"
                >
                  ›
                </button>
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

        <section className="letter-card" aria-labelledby="letter-title">
          <div className="letter-top">
            <span className="letter-stamp" aria-hidden="true">
              ♡
            </span>
            <span className="letter-date">CONGRATULATIONS🍾</span>
          </div>
          <h2 id="letter-title">Dear. 愛音</h2>
          <div className="letter-copy">
            <p>あのん、お誕生日おめでとう🥳</p>
            <p>
              ２４歳のあのんは色々大変で悲しかったことも、
              <br />
              嬉しかったこともあったけど、
              <br />
              ワーホリ期間中にまじで偉いだったと思ってる
              <br />
              本当にお疲れ様！！
              <br />
              僕がもっと優しくしなかったからごめんね、
              <br />
              でも、いつも笑顔でいてくれて一緒に何でも食べてくれたしどこでも楽しんでたから本当にありがとう、大好き❤️
              <br />
              これからも色々大変なことありそうだけど、
              <br />
              あまり心配はしてないんだ
              <br />
              あのんは何でもできるからね
              <br />
              今からもよろしくね、愛してる
            </p>
            <p>앞으로도 맛있는거 많이 먹고 행복하자!!</p>
          </div>
          <p className="letter-signature">
            - 준환 <span aria-hidden="true">♡</span>
          </p>
        </section>

        <footer className="page-footer">
          made with love for anon <span aria-hidden="true">♡</span>
        </footer>

        {lightboxPhoto !== null && (
          <div
            className="lightbox-backdrop"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setLightboxPhoto(null);
              }
            }}
          >
            <figure
              className="lightbox"
              role="dialog"
              aria-modal="true"
              aria-label="사진 확대 보기"
            >
              <button
                className="lightbox-close"
                type="button"
                onClick={() => setLightboxPhoto(null)}
                aria-label="사진 확대 보기 닫기"
                autoFocus
              >
                ×
              </button>
              <img
                className="lightbox-image"
                src={photos[lightboxPhoto].src}
                alt={photos[lightboxPhoto].alt}
              />
              <figcaption className="lightbox-caption">
                {photos[lightboxPhoto].caption}
              </figcaption>
            </figure>
          </div>
        )}
      </main>
    </>
  );
}

export default App;