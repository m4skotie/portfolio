const revealSelectors = [
  ".section-heading",
  ".section-accent-text",
  ".about-main-text",
  ".about-photo",
  ".tool-card",
  ".tools-note",
  ".philosophy-card",
  ".case-card",
  ".pawpal-title",
  ".pawpal-tags",
  ".case-summary-card",
  ".case-tools-block",
  ".polkius-story-intro",
  ".polkius-compare-copy",
  ".polkius-compare-widget",
  ".polkius-process-card",
  ".pointbooster-story-intro",
  ".pointbooster-highlight-copy",
  ".pointbooster-highlight-shot",
  ".pointbooster-process-card",
  ".pointbooster-gallery .pawpal-marquee",
  ".terratech-story-intro",
  ".terratech-focus-card",
  ".terratech-gallery .pawpal-marquee",
  ".vdk-story-intro",
  ".vdk-focus-copy",
  ".vdk-focus-card",
  ".vdk-process-card",
  ".vdk-brandbook-shot",
  ".vdk-gallery .pawpal-marquee",
  ".logobook-story-intro",
  ".logobook-book-shot",
  ".logobook-direction",
  ".other-cases",
  ".contacts-grid",
];

const revealTargets = Array.from(
  document.querySelectorAll(revealSelectors.join(",")),
);

const header = document.querySelector(".header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".nav");

if (header && menuToggle && siteNav) {
  const closeMenu = () => {
    header.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";

      if (href.startsWith("#")) {
        event.preventDefault();
        const target = document.querySelector(href);
        closeMenu();

        if (target) {
          requestAnimationFrame(() => {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          });
        }

        return;
      }

      closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) {
      closeMenu();
    }
  });
}

revealTargets.forEach((target, index) => {
  target.setAttribute("data-reveal", "");
  target.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId ? document.querySelector(targetId) : null;

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -10% 0px",
  },
);

revealTargets.forEach((target) => revealObserver.observe(target));

const scrollTopButton = document.createElement("button");
scrollTopButton.className = "scroll-top-btn";
scrollTopButton.type = "button";
scrollTopButton.setAttribute("aria-label", "Наверх");
scrollTopButton.innerHTML = '<img src="assets/icons/up.svg" alt="" aria-hidden="true">';
document.body.appendChild(scrollTopButton);

const updateScrollTopButton = () => {
  if (window.scrollY > 420) {
    scrollTopButton.classList.add("is-visible");
  } else {
    scrollTopButton.classList.remove("is-visible");
  }
};

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", updateScrollTopButton, { passive: true });
updateScrollTopButton();

const tooltipCards = Array.from(document.querySelectorAll(".contact-card[data-tooltip]"));
const contactTooltip = document.createElement("div");
contactTooltip.className = "contact-tooltip";
document.body.appendChild(contactTooltip);

let activeTooltipCard = null;

const prefersFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const positionTooltip = (event) => {
  if (!activeTooltipCard) return;

  const offset = 18;
  const maxX = window.innerWidth - contactTooltip.offsetWidth - 12;
  const maxY = window.innerHeight - contactTooltip.offsetHeight - 12;
  const x = Math.min(event.clientX + offset, maxX);
  const y = Math.min(event.clientY + offset, maxY);

  contactTooltip.style.left = `${x}px`;
  contactTooltip.style.top = `${y}px`;
};

if (prefersFinePointer) {
  tooltipCards.forEach((card) => {
    card.addEventListener("mouseenter", (event) => {
      activeTooltipCard = card;
      contactTooltip.textContent = card.dataset.tooltip || "";
      contactTooltip.classList.add("is-visible");
      positionTooltip(event);
    });

    card.addEventListener("mousemove", positionTooltip);

    card.addEventListener("mouseleave", () => {
      activeTooltipCard = null;
      contactTooltip.classList.remove("is-visible");
    });
  });
}

document.querySelectorAll("[data-compare]").forEach((compare) => {
  const range = compare.querySelector("[data-compare-range]");
  const after = compare.querySelector("[data-compare-after]");
  const divider = compare.querySelector("[data-compare-divider]");

  if (!range || !after || !divider) return;

  const updateCompare = () => {
    const value = Number(range.value);
    after.style.clipPath = `inset(0 0 0 ${value}%)`;
    divider.style.left = `${value}%`;
  };

  range.addEventListener("input", updateCompare);
  updateCompare();
});

const caseGalleryMedia = window.matchMedia("(max-width: 980px)");

const syncAdaptiveCaseGalleries = () => {
  document.querySelectorAll(".case-detail-page .pawpal-marquee-track").forEach((track) => {
    const items = Array.from(track.children).filter((child) =>
      child.classList.contains("case-image"),
    );

    const hasLoopDuplicates = items.length > 1 && items.length % 2 === 0;
    const visibleCount = hasLoopDuplicates ? items.length / 2 : items.length;

    items.forEach((item, index) => {
      item.hidden = caseGalleryMedia.matches && hasLoopDuplicates && index >= visibleCount;
    });
  });
};

let adaptiveGalleryDotsCleanup = () => {};

const setupAdaptiveGalleryDots = () => {
  adaptiveGalleryDotsCleanup();

  const cleanups = [];

  document.querySelectorAll(".case-detail-page .pawpal-marquee").forEach((gallery) => {
    gallery.nextElementSibling?.classList.contains("case-slider-dots") &&
      gallery.nextElementSibling.remove();

    if (!caseGalleryMedia.matches) {
      return;
    }

    const track = gallery.querySelector(".pawpal-marquee-track");
    if (!track) return;

    const slides = Array.from(track.querySelectorAll(".case-image")).filter(
      (slide) => !slide.hidden,
    );

    if (slides.length <= 1) {
      return;
    }

    const dots = document.createElement("div");
    dots.className = "case-slider-dots";

    const dotButtons = slides.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "case-slider-dot";
      dot.setAttribute("aria-label", `Перейти к слайду ${index + 1}`);
      dots.appendChild(dot);
      return dot;
    });

    gallery.insertAdjacentElement("afterend", dots);

    const updateActiveDot = () => {
      const galleryRect = gallery.getBoundingClientRect();
      const galleryCenter = galleryRect.left + galleryRect.width / 2;

      let activeIndex = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        const distance = Math.abs(slideCenter - galleryCenter);

        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = index;
        }
      });

      dotButtons.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeIndex);
      });
    };

    dotButtons.forEach((dot, index) => {
      const onClick = () => {
        slides[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      };

      dot.addEventListener("click", onClick);
      cleanups.push(() => dot.removeEventListener("click", onClick));
    });

    const onScroll = () => updateActiveDot();
    gallery.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => gallery.removeEventListener("scroll", onScroll));

    updateActiveDot();
  });

  adaptiveGalleryDotsCleanup = () => {
    cleanups.forEach((cleanup) => cleanup());
    document.querySelectorAll(".case-slider-dots").forEach((dots) => dots.remove());
  };
};

syncAdaptiveCaseGalleries();
setupAdaptiveGalleryDots();

if (typeof caseGalleryMedia.addEventListener === "function") {
  caseGalleryMedia.addEventListener("change", () => {
    syncAdaptiveCaseGalleries();
    setupAdaptiveGalleryDots();
  });
} else if (typeof caseGalleryMedia.addListener === "function") {
  caseGalleryMedia.addListener(() => {
    syncAdaptiveCaseGalleries();
    setupAdaptiveGalleryDots();
  });
}

const emptyCasePlaceholder = document.querySelector(".case-card-empty .case-image-placeholder");

if (emptyCasePlaceholder) {
  const sourceIcon = emptyCasePlaceholder.querySelector("img");

  if (sourceIcon) {
    const createGhost = (className) => {
      const ghost = document.createElement("div");
      ghost.className = `case-glitch-ghost ${className}`;
      ghost.setAttribute("aria-hidden", "true");

      const clone = sourceIcon.cloneNode(true);
      clone.alt = "";
      ghost.appendChild(clone);
      emptyCasePlaceholder.appendChild(ghost);
    };

    createGhost("case-glitch-ghost-a");
    createGhost("case-glitch-ghost-b");
  }

  const bars = document.createElement("div");
  bars.className = "case-glitch-bars";
  bars.setAttribute("aria-hidden", "true");

  Array.from({ length: 6 }).forEach(() => {
    const bar = document.createElement("span");
    bar.className = "case-glitch-bar";
    bars.appendChild(bar);
  });

  emptyCasePlaceholder.appendChild(bars);

  let glitchTimeoutId = null;
  let glitchLoopId = null;
  let hoverMode = false;

  const randomBetween = (min, max) => Math.random() * (max - min) + min;
  const randomInt = (min, max) => Math.floor(randomBetween(min, max + 1));

  const runGlitchBurst = () => {
    const barNodes = Array.from(bars.children);

    emptyCasePlaceholder.style.setProperty("--glitch-ghost-a-x", `${randomInt(-18, 18)}px`);
    emptyCasePlaceholder.style.setProperty("--glitch-ghost-a-y", `${randomInt(-8, 8)}px`);
    emptyCasePlaceholder.style.setProperty("--glitch-ghost-b-x", `${randomInt(-10, 10)}px`);
    emptyCasePlaceholder.style.setProperty("--glitch-ghost-b-y", `${randomInt(-12, 12)}px`);
    emptyCasePlaceholder.style.setProperty("--glitch-icon-x", `${randomInt(-4, 4)}px`);
    emptyCasePlaceholder.style.setProperty("--glitch-icon-y", `${randomInt(-3, 3)}px`);
    emptyCasePlaceholder.style.setProperty("--glitch-glow", `${randomBetween(10, 24).toFixed(1)}px`);

    barNodes.forEach((bar) => {
      bar.style.top = `${randomBetween(8, 92).toFixed(1)}%`;
      bar.style.height = `${randomInt(6, 28)}px`;
      bar.style.transform = `translateX(${randomInt(-32, 32)}px) skewX(${randomInt(-20, 20)}deg)`;
    });

    emptyCasePlaceholder.classList.add("is-glitching");

    window.clearTimeout(glitchTimeoutId);
    glitchTimeoutId = window.setTimeout(() => {
      emptyCasePlaceholder.classList.remove("is-glitching");
    }, randomInt(110, 190));
  };

  const queueNextBurst = () => {
    window.clearTimeout(glitchLoopId);
    const delay = hoverMode ? randomInt(420, 900) : randomInt(1100, 2600);
    glitchLoopId = window.setTimeout(() => {
      runGlitchBurst();
      queueNextBurst();
    }, delay);
  };

  emptyCasePlaceholder.closest(".case-card-empty")?.addEventListener("mouseenter", () => {
    hoverMode = true;
    runGlitchBurst();
    queueNextBurst();
  });

  emptyCasePlaceholder.closest(".case-card-empty")?.addEventListener("mouseleave", () => {
    hoverMode = false;
    queueNextBurst();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearTimeout(glitchLoopId);
      window.clearTimeout(glitchTimeoutId);
      emptyCasePlaceholder.classList.remove("is-glitching");
      return;
    }

    queueNextBurst();
  });

  queueNextBurst();
}
