/**
 * Main Module
 * 메인 페이지 기능 - 카테고리 및 피쳐드 프로젝트 로드
 */

// Fallback 데이터 (로컬 파일 환경에서 CORS 문제 시 사용)
const fallbackData = {
  categories: [
    { id: "restaurant", name: "RESTAURANT", nameKr: "레스토랑" },
    { id: "cafe", name: "CAFE", nameKr: "카페" },
    { id: "office", name: "OFFICE", nameKr: "오피스" },
    { id: "hospital", name: "HOSPITAL", nameKr: "병원" },
    { id: "gym", name: "GYM", nameKr: "피트니스" },
    { id: "apt", name: "APT", nameKr: "주거공간" },
    { id: "showroom", name: "SHOWROOM", nameKr: "쇼룸" }
  ],
  projects: [
    { id: "project-001", title: "카페 블루밍", category: "cafe", location: "서울 성수동", area: "82㎡", year: "2024", thumbnail: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80", featured: true },
    { id: "project-002", title: "레스토랑 소울", category: "restaurant", location: "서울 청담동", area: "156㎡", year: "2024", thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", featured: true },
    { id: "project-003", title: "오피스 넥스트", category: "office", location: "서울 강남구", area: "320㎡", year: "2024", thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", featured: true },
    { id: "project-004", title: "피트니스 바디웍스", category: "gym", location: "서울 삼성동", area: "245㎡", year: "2023", thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", featured: true },
    { id: "project-006", title: "아파트 리모델링", category: "apt", location: "서울 용산구", area: "132㎡", year: "2024", thumbnail: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80", featured: true },
    { id: "project-007", title: "브랜드 쇼룸", category: "showroom", location: "서울 한남동", area: "176㎡", year: "2023", thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80", featured: true }
  ]
};

document.addEventListener('DOMContentLoaded', async () => {
  let data;

  try {
    // 데이터 로드 시도
    const response = await fetch('data/projects.json');
    data = await response.json();
  } catch (error) {
    console.warn('데이터 로드 실패, fallback 데이터 사용:', error);
    data = fallbackData;
  }

  // 카테고리 그리드 렌더링
  renderCategoryGrid(data.categories);

  // 피쳐드 프로젝트 렌더링
  renderFeaturedProjects(data.projects);

  // 페이지 로드 애니메이션
  document.body.classList.add('page-enter-active');
});

/**
 * 카테고리 그리드 렌더링
 */
function renderCategoryGrid(categories) {
  const grid = document.getElementById('categoryGrid');
  if (!grid) return;

  // 'all' 카테고리 제외
  const visibleCategories = categories.filter(cat => cat.id !== 'all');

  grid.innerHTML = visibleCategories.map(category => `
    <a href="projects.html?category=${category.id}" class="category-card">
      <div class="category-card-image">
        <img src="images/categories/${category.id}.png" alt="${category.nameKr}" loading="lazy">
      </div>
      <div class="category-card-overlay"></div>
      <div class="category-card-content">
        <span class="category-card-name text-english">${category.name}</span>
        <span class="category-card-name-kr">${category.nameKr}</span>
      </div>
    </a>
  `).join('');
}

/**
 * 피쳐드 프로젝트 렌더링
 */
function renderFeaturedProjects(projects) {
  const container = document.getElementById('featuredProjects');
  if (!container) return;

  // featured가 true인 프로젝트만 필터링 (최대 6개)
  const featuredProjects = projects
    .filter(project => project.featured)
    .slice(0, 6);

  container.innerHTML = featuredProjects.map(project => createProjectCard(project)).join('');

  // Lazy loading 이미지
  lazyLoadImages();
}

/**
 * 프로젝트 카드 HTML 생성
 */
function createProjectCard(project) {
  return `
    <a href="project-detail.html?id=${project.id}" class="project-card">
      <div class="project-card-image">
        <img 
          src="${project.thumbnail}" 
          alt="${project.title}"
          loading="lazy"
        >
      </div>
      <div class="project-card-content">
        <span class="project-card-category">${project.category.toUpperCase()}</span>
        <h3 class="project-card-title">${project.title}</h3>
        <div class="project-card-meta">
          <span>${project.location}</span>
          <span>${project.area}</span>
        </div>
      </div>
    </a>
  `;
}

/**
 * Lazy Load 이미지
 */
function lazyLoadImages() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// 카테고리 카드 스타일 추가
const categoryCardStyle = document.createElement('style');
categoryCardStyle.textContent = `
  .category-card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 16 / 9;
    border-radius: var(--radius-md);
    overflow: hidden;
    text-align: center;
  }
  
  .category-card-image {
    position: absolute;
    inset: 0;
    z-index: 1;
  }
  
  .category-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
  }
  
  .category-card:hover .category-card-image img {
    transform: scale(1.1);
  }
  
  .category-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
    z-index: 2;
    transition: background var(--transition-base);
  }
  
  .category-card:hover .category-card-overlay {
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
  }
  
  .category-card-content {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .category-card-name {
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
    letter-spacing: var(--tracking-wider);
    color: var(--color-white);
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    transition: transform var(--transition-fast);
  }
  
  .category-card:hover .category-card-name {
    transform: translateY(-2px);
  }
  
  .category-card-name-kr {
    font-size: var(--text-sm);
    color: rgba(255,255,255,0.9);
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
`;
document.head.appendChild(categoryCardStyle);
