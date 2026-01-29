/**
 * Project Detail Module
 * 프로젝트 상세 페이지 기능
 */

let allProjects = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 데이터 로드
        const response = await fetch('data/projects.json');
        const data = await response.json();

        allProjects = data.projects;

        // URL에서 프로젝트 ID 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');

        if (!projectId) {
            // ID가 없으면 프로젝트 리스트로 리다이렉트
            window.location.href = 'projects.html';
            return;
        }

        // 프로젝트 찾기
        const project = allProjects.find(p => p.id === projectId);

        if (!project) {
            // 프로젝트를 찾을 수 없으면 리스트로 리다이렉트
            window.location.href = 'projects.html';
            return;
        }

        // 프로젝트 상세 렌더링
        renderProjectDetail(project);

        // 이전/다음 프로젝트 네비게이션 설정
        setupProjectNavigation(projectId);

        // 페이지 타이틀 업데이트
        document.title = `${project.title} | DESIGN STUDIO`;

    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
});

/**
 * 프로젝트 상세 렌더링
 */
function renderProjectDetail(project) {
    // 카테고리
    const categoryEl = document.getElementById('projectCategory');
    if (categoryEl) categoryEl.textContent = project.category.toUpperCase();

    // 제목
    const titleEl = document.getElementById('projectTitle');
    if (titleEl) titleEl.textContent = project.title;

    // 메타 정보
    const locationEl = document.getElementById('projectLocation');
    if (locationEl) locationEl.textContent = project.location;

    const areaEl = document.getElementById('projectArea');
    if (areaEl) areaEl.textContent = project.area;

    const yearEl = document.getElementById('projectYear');
    if (yearEl) yearEl.textContent = project.year;

    // 갤러리
    const galleryEl = document.getElementById('projectGallery');
    if (galleryEl && project.images) {
        galleryEl.innerHTML = project.images.map(img => `
      <div class="project-gallery-item">
        <img src="${img}" alt="${project.title}" loading="lazy">
      </div>
    `).join('');
    }

    // 설명
    const descriptionEl = document.getElementById('projectDescription');
    if (descriptionEl) descriptionEl.textContent = project.description;
}

/**
 * 이전/다음 프로젝트 네비게이션 설정
 */
function setupProjectNavigation(currentId) {
    const currentIndex = allProjects.findIndex(p => p.id === currentId);

    // 이전 프로젝트
    const prevLink = document.getElementById('prevProject');
    const prevTitle = document.getElementById('prevProjectTitle');

    if (currentIndex > 0) {
        const prevProject = allProjects[currentIndex - 1];
        if (prevLink && prevTitle) {
            prevLink.href = `project-detail.html?id=${prevProject.id}`;
            prevTitle.textContent = prevProject.title;
            prevLink.style.display = 'flex';
        }
    }

    // 다음 프로젝트
    const nextLink = document.getElementById('nextProject');
    const nextTitle = document.getElementById('nextProjectTitle');

    if (currentIndex < allProjects.length - 1) {
        const nextProject = allProjects[currentIndex + 1];
        if (nextLink && nextTitle) {
            nextLink.href = `project-detail.html?id=${nextProject.id}`;
            nextTitle.textContent = nextProject.title;
            nextLink.style.display = 'flex';
        }
    }
}
