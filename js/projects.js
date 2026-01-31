/**
 * Projects Module
 * 프로젝트 리스트 페이지 기능 - 카테고리 필터, 프로젝트 그리드
 */

let allProjects = [];
let categories = [];

// Fallback 데이터 (로컬 파일 환경에서 CORS 문제 시 사용)
const fallbackData = {
    categories: [
        { id: "all", name: "ALL", nameKr: "전체" },
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
        { id: "project-005", title: "힐링 클리닉", category: "hospital", location: "서울 서초구", area: "198㎡", year: "2023", thumbnail: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80", featured: false },
        { id: "project-006", title: "아파트 리모델링", category: "apt", location: "서울 용산구", area: "132㎡", year: "2024", thumbnail: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80", featured: true },
        { id: "project-007", title: "브랜드 쇼룸", category: "showroom", location: "서울 한남동", area: "176㎡", year: "2023", thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80", featured: true },
        { id: "project-008", title: "카페 선셋", category: "cafe", location: "제주 서귀포", area: "95㎡", year: "2023", thumbnail: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80", featured: false }
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
});

/**
 * 카테고리 탭 렌더링
 */
function renderCategoryTabs() {
    const tabsContainer = document.getElementById('categoryTabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = categories.map(category => {
        // 'all' 카테고리는 이미지 없이 표시
        const imageHtml = category.id !== 'all'
            ? `<img src="images/categories/${category.id}.png" alt="${category.nameKr}" class="category-tab-image">`
            : '';

        return `
        <button 
          class="category-tab ${category.id !== 'all' ? 'has-image' : ''}" 
          data-category="${category.id}"
          aria-label="${category.nameKr} 카테고리"
        >
          ${imageHtml}
          <span class="category-tab-text">${category.nameKr}</span>
        </button>
      `;
    }).join('');

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
