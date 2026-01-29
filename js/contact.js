/**
 * Contact Module
 * 문의 폼 처리
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 폼 데이터 수집
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            projectType: formData.get('projectType'),
            message: formData.get('message'),
            submittedAt: new Date().toISOString()
        };

        // 간단한 유효성 검사
        if (!data.name || !data.phone || !data.message) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }

        // 제출 버튼 비활성화
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '전송 중...';

        try {
            // 실제 서버가 없으므로 시뮬레이션
            // 실제 구현 시 여기에 서버 API 호출 코드 추가
            await simulateSubmit(data);

            // 성공 시 폼 숨기고 성공 메시지 표시
            contactForm.style.display = 'none';
            if (successMessage) {
                successMessage.style.display = 'block';
            }

            // 콘솔에 데이터 출력 (개발용)
            console.log('문의 데이터:', data);

        } catch (error) {
            console.error('문의 전송 실패:', error);
            alert('문의 전송에 실패했습니다. 다시 시도해주세요.');

            // 버튼 복원
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // 전화번호 자동 포맷팅
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 3 && value.length <= 7) {
                value = value.replace(/(\d{3})(\d+)/, '$1-$2');
            } else if (value.length > 7) {
                value = value.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
            }

            e.target.value = value;
        });
    }
});

/**
 * 폼 제출 시뮬레이션 (서버 없이 테스트용)
 */
function simulateSubmit(data) {
    return new Promise((resolve) => {
        // 1초 후 성공 처리
        setTimeout(() => {
            resolve({ success: true });
        }, 1000);
    });
}
