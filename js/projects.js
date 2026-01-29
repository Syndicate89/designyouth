/**
 * Projects Module
 * 프로젝트 리스트 페이지 기능 - 카테고리 필터, 프로젝트 그리드
 */

let allProjects = [];
let categories = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 데이터 로드
        const response = await fetch('data/projects.json');
        const data = await response.json();

        allProjects = data.projects;
        categories = data.categories;

        // 카테고리 탭 렌더링
        renderCategoryTabs();

        // URL 파라미터에서 카테고리 확인
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category') || 'all';

        // 초기 프로젝트 렌더링
        filterProjects(categoryParam);

        // 활성 탭 표시
        setActiveTab(categoryParam);

    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
});

/**
 * 카테고리 탭 렌더링
 */
function renderCategoryTabs() {
    const tabsContainer = document.getElementById('categoryTabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = categories.map(category => `
    <button 
      class="category-tab" 
      data-category="${category.id}"
      aria-label="${category.nameKr} 카테고리"
    >
      ${category.name}
    </button>
  `).join('');

    // 탭 클릭 이벤트
    tabsContainer.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;

            // URL 업데이트 (새로고침 없이)
            const url = new URL(window.location);
            if (category === 'all') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', category);
            }
            window.history.pushState({}, '', url);

            // 필터링 및 활성 탭 업데이트
            filterProjects(category);
            setActiveTab(category);
        });
    });
}

/**
 * 프로젝트 필터링 및 렌더링
 */
function filterProjects(category) {
    const grid = document.getElementById('projectsGrid');
    const emptyState = document.getElementById('emptyState');

    if (!grid) return;

    // 필터링
    const filteredProjects = category === 'all'
        ? allProjects
        : allProjects.filter(project => project.category === category);

    // 빈 상태 처리
    if (filteredProjects.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // 프로젝트 카드 렌더링
    grid.innerHTML = filteredProjects.map(project => createProjectCard(project)).join('');

    // 애니메이션 효과
    animateCards();
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
 * 활성 탭 설정
 */
function setActiveTab(category) {
    document.querySelectorAll('.category-tab').forEach(tab => {
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

/**
 * 카드 등장 애니메이션
 */
function animateCards() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 브라우저 뒤로가기/앞으로가기 처리
window.addEventListener('popstate', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';
    filterProjects(category);
    setActiveTab(category);
});
