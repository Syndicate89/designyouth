/**
 * Main Module
 * 메인 페이지 기능 - 카테고리 및 피쳐드 프로젝트 로드
 */

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 데이터 로드
        const response = await fetch('data/projects.json');
        const data = await response.json();

        // 카테고리 그리드 렌더링
        renderCategoryGrid(data.categories);

        // 피쳐드 프로젝트 렌더링
        renderFeaturedProjects(data.projects);

        // 페이지 로드 애니메이션
        document.body.classList.add('page-enter-active');

    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
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
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 16 / 9;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
    text-align: center;
  }
  
  .category-card:hover {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
  }
  
  .category-card:hover .category-card-name,
  .category-card:hover .category-card-name-kr {
    color: var(--color-white);
  }
  
  .category-card-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .category-card-name {
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
    letter-spacing: var(--tracking-wider);
    color: var(--color-primary);
    transition: color var(--transition-fast);
  }
  
  .category-card-name-kr {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    transition: color var(--transition-fast);
  }
`;
document.head.appendChild(categoryCardStyle);
