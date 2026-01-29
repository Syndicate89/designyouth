/**
 * Navigation Module
 * 헤더 스크롤 효과 및 모바일 메뉴 토글
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const menuToggle = document.getElementById('menuToggle');

  // Scroll Effect - 스크롤 시 헤더 스타일 변경
  let lastScrollY = 0;
  
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // 스크롤 시 그림자 추가
    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
  };

  // 스로틀링으로 성능 최적화
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Mobile Menu Toggle
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('open');
      
      // 메뉴 열림 시 스크롤 방지
      if (nav.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
        menuToggle.setAttribute('aria-label', '메뉴 닫기');
      } else {
        document.body.style.overflow = '';
        menuToggle.setAttribute('aria-label', '메뉴 열기');
      }
    });

    // 모바일 메뉴에서 링크 클릭 시 메뉴 닫기
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          menuToggle.classList.remove('active');
          nav.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // 화면 크기 변경 시 모바일 메뉴 상태 초기화
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && nav.classList.contains('open')) {
      menuToggle.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Active Link 표시
  const setActiveLink = () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (currentPath.endsWith(href) || 
          (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')))) {
        // Active 클래스는 HTML에서 수동으로 지정
      }
    });
  };

  setActiveLink();
});
