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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded'); // Проверяем, загрузился ли DOM
    
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