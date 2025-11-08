// ============================================
// Page Navigation System
// ============================================

const homeExperienceElement = document.getElementById('homeExperience');
const customCursor = document.getElementById('customCursor');

function toggleHomeExperience(isActive) {
    if (!homeExperienceElement) return;
    if (isActive) {
        homeExperienceElement.classList.remove('home-experience--inactive');
        if (customCursor) {
            customCursor.style.opacity = 0;
        }
    } else {
        homeExperienceElement.classList.add('home-experience--inactive');
        if (customCursor) {
            customCursor.style.opacity = 0;
        }
    }
}

/**
 * Navigate to a specific page
 * @param {string} pageName - The name of the page to navigate to
 */
function navigateToPage(pageName) {
    // Get all pages
    const pages = document.querySelectorAll('.page');
    
    // Remove active class from all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Add active class to target page
    const targetPage = document.querySelector(`[data-page="${pageName}"]`);
    if (targetPage) {
        targetPage.classList.add('active');
        toggleHomeExperience(pageName === 'home');
        
        // Update countdown progress when navigating to rooms page
        if (pageName === 'rooms') {
            setTimeout(() => {
                updateCountdownProgress();
            }, 100);
        }
        
        // Render wish cards when navigating to todo page
        if (pageName === 'todo') {
            setTimeout(() => {
                renderWishCards();
            }, 100);
        }
    }
}

// ============================================
// Detail Page Inspiration Reveals
// ============================================

function setupDetailReveals() {
    const triggers = document.querySelectorAll('[data-reveal-trigger]');

    triggers.forEach(trigger => {
        const revealId = trigger.getAttribute('data-reveal-trigger');
        if (!revealId) return;

        const panel = document.querySelector(`[data-reveal-panel="${revealId}"]`);
        if (!panel) return;

        panel.classList.remove('detail-reveal__panel--visible');
        panel.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');

        trigger.addEventListener('click', () => {
            const isVisible = panel.classList.toggle('detail-reveal__panel--visible');
            panel.setAttribute('aria-hidden', (!isVisible).toString());
            trigger.setAttribute('aria-expanded', isVisible.toString());
        });
    });
}

// ============================================
// Home Page Navigation
// ============================================

// Handle click on home page button
const homePageButton = document.querySelector('.home-page__button');
if (homePageButton) {
    homePageButton.addEventListener('click', () => {
        navigateToPage('rooms');
    });
}

// ============================================
// Rooms Page Navigation
// ============================================

// Handle click on back button in rooms page
const roomsBackButton = document.querySelector('.rooms-page__back-button');
if (roomsBackButton) {
    roomsBackButton.addEventListener('click', () => {
        navigateToPage('home');
    });
}

// Handle click on to do list button in rooms page
const roomsTodoButton = document.querySelector('.rooms-page__todo-button');
if (roomsTodoButton) {
    roomsTodoButton.addEventListener('click', () => {
        navigateToPage('todo');
    });
}

// Room type to detail page mapping
const roomToDetailPageMap = {
    'living-room': 'detail-living-room',
    'bedroom': 'detail-bedroom',
    'balcony': 'detail-balcony',
    'study': 'detail-study',
    'room': 'detail-room'
};

// Handle click on room cards
const roomCards = document.querySelectorAll('.room-card');
roomCards.forEach(card => {
    card.addEventListener('click', () => {
        const roomName = card.getAttribute('data-room-name');
        const roomNameEn = card.getAttribute('data-room-name-en');
        const roomType = card.getAttribute('data-room');
        
        // Get the corresponding detail page name
        const detailPageName = roomToDetailPageMap[roomType];
        
        if (detailPageName) {
            // Get the detail page element
            const detailPage = document.querySelector(`[data-page="${detailPageName}"]`);
            
            // Update detail page title in the target page
            if (detailPage) {
                const detailPageTitle = detailPage.querySelector('.detail-page__title');
                if (detailPageTitle) {
                    detailPageTitle.textContent = roomName;
                }
            }
            
            // Navigate to the specific detail page
            navigateToPage(detailPageName);
        }
    });
});

// ============================================
// Detail Page Navigation
// ============================================

// Handle click on back button in detail pages (using event delegation)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('detail-page__back-button')) {
        navigateToPage('rooms');
    }
    
});

// ============================================
// Todo Page Navigation
// ============================================

// Handle click on back button in todo page
const todoBackButton = document.querySelector('.todo-page__back-button');
if (todoBackButton) {
    todoBackButton.addEventListener('click', () => {
        navigateToPage('rooms');
    });
}

// ============================================
// Wish Plan Data & Functions
// ============================================

// 示例愿望列表
let wishList = [
    { id: 1, emoji: '☕', title: '设置咖啡角', room: '客厅' },
    { id: 2, emoji: '🌿', title: '养绿植', room: '阳台' },
    { id: 3, emoji: '📸', title: '照片墙', room: '卧室' },
    { id: 4, emoji: '🛋️', title: '买沙发', room: '客厅' },
    { id: 5, emoji: '🍳', title: '添置烤箱', room: '厨房' },
    { id: 6, emoji: '📚', title: '书架', room: '书房' }
];

let currentEditingWishId = null;
let emojiList = ['☕', '🌿', '📸', '🛋️', '🍳', '📚', '🛏️', '🌱', '🖼️', '💡', '🎨', '📖', '🪴', '🕯️', '🎵'];

// 房间颜色映射
const roomColorMap = {
    '客厅': '#E8DED5',
    '卧室': '#E8D5D8',
    '厨房': '#F4E8D9',
    '阳台': '#DEE8D5',
    '书房': '#E8DED5',
    '房间': '#E8D5D8'
};

// 渲染愿望卡片
function renderWishCards() {
    const wishGrid = document.getElementById('wishGrid');
    if (!wishGrid) return;
    
    wishGrid.innerHTML = '';
    
    wishList.forEach(wish => {
        const card = document.createElement('div');
        card.className = 'wish-card';
        const roomColor = roomColorMap[wish.room] || '#E8DED5';
        // 设置背景色，使用 rgba 格式以支持毛玻璃效果
        const rgb = hexToRgb(roomColor);
        if (rgb) {
            card.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`;
        } else {
            card.style.backgroundColor = roomColor;
        }
        card.dataset.wishId = wish.id;
        
        card.innerHTML = `
            <div class="wish-card__emoji">${wish.emoji}</div>
            <div class="wish-card__title">${wish.title}</div>
            <div class="wish-card__room">📍${wish.room}</div>
        `;
        
        card.addEventListener('click', () => {
            editWish(wish.id);
        });
        
        wishGrid.appendChild(card);
    });
}

// 辅助函数：将十六进制颜色转换为 RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// 编辑愿望
function editWish(wishId) {
    const wish = wishList.find(w => w.id === wishId);
    if (!wish) return;
    
    currentEditingWishId = wishId;
    
    document.getElementById('wishPlanEmoji').textContent = wish.emoji;
    document.getElementById('wishPlanTitle').value = wish.title;
    document.getElementById('wishPlanRoom').value = wish.room;
    document.getElementById('wishPlanNote').value = wish.note || '';
    
    openWishPlanModal();
}

// 添加新愿望
function addNewWish() {
    currentEditingWishId = null;
    
    document.getElementById('wishPlanEmoji').textContent = '☕';
    document.getElementById('wishPlanTitle').value = '';
    document.getElementById('wishPlanRoom').value = '客厅';
    document.getElementById('wishPlanNote').value = '';
    
    openWishPlanModal();
}

// 保存愿望
function saveWish() {
    const emoji = document.getElementById('wishPlanEmoji').textContent;
    const title = document.getElementById('wishPlanTitle').value.trim();
    const room = document.getElementById('wishPlanRoom').value;
    const note = document.getElementById('wishPlanNote').value.trim();
    
    if (!title) {
        alert('请输入愿望标题');
        return;
    }
    
    if (currentEditingWishId) {
        // 更新现有愿望
        const wish = wishList.find(w => w.id === currentEditingWishId);
        if (wish) {
            wish.emoji = emoji;
            wish.title = title;
            wish.room = room;
            wish.note = note;
        }
    } else {
        // 添加新愿望
        const newId = wishList.length > 0 ? Math.max(...wishList.map(w => w.id)) + 1 : 1;
        wishList.push({
            id: newId,
            emoji: emoji,
            title: title,
            room: room,
            note: note
        });
    }
    
    renderWishCards();
    closeWishPlanModal();
}

// 切换emoji
function changeEmoji() {
    const emojiDisplay = document.getElementById('wishPlanEmoji');
    const currentEmoji = emojiDisplay.textContent;
    const currentIndex = emojiList.indexOf(currentEmoji);
    const nextIndex = (currentIndex + 1) % emojiList.length;
    emojiDisplay.textContent = emojiList[nextIndex];
}

// Handle click on add button
const todoAddButton = document.querySelector('.todo-page__add-button');
if (todoAddButton) {
    todoAddButton.addEventListener('click', () => {
        addNewWish();
    });
}

// ============================================
// Wish Plan Modal Functions
// ============================================

function openWishPlanModal() {
    const wishPlanModal = document.getElementById('wishPlanModal');
    if (wishPlanModal) {
        wishPlanModal.classList.add('active');
    }
}

function closeWishPlanModal() {
    const wishPlanModal = document.getElementById('wishPlanModal');
    if (wishPlanModal) {
        wishPlanModal.classList.remove('active');
        currentEditingWishId = null;
    }
}

// Handle click on wish plan close button
const wishPlanCloseButton = document.querySelector('.wish-plan-close');
if (wishPlanCloseButton) {
    wishPlanCloseButton.addEventListener('click', () => {
        closeWishPlanModal();
    });
}

// Handle click on wish plan backdrop
const wishPlanBackdrop = document.querySelector('.wish-plan-backdrop');
if (wishPlanBackdrop) {
    wishPlanBackdrop.addEventListener('click', () => {
        closeWishPlanModal();
    });
}

// Handle click on emoji change button
const wishPlanEmojiChange = document.getElementById('wishPlanEmojiChange');
if (wishPlanEmojiChange) {
    wishPlanEmojiChange.addEventListener('click', () => {
        changeEmoji();
    });
}

// Handle click on save button
const wishPlanSave = document.getElementById('wishPlanSave');
if (wishPlanSave) {
    wishPlanSave.addEventListener('click', () => {
        saveWish();
    });
}


// ============================================
// Timeline Slider Functionality
// ============================================

// Initialize timeline sliders for all detail pages
function initializeTimelineSliders() {
    const detailPages = document.querySelectorAll('[data-page^="detail-"]');
    
    detailPages.forEach(detailPage => {
        const timelineSlider = detailPage.querySelector('.timeline__slider');
        const timelineHandle = detailPage.querySelector('.timeline__slider-handle');
        const timelineTrack = detailPage.querySelector('.timeline__track');
        
        if (timelineSlider && timelineHandle && timelineTrack) {
            setupTimelineSlider(timelineSlider, timelineHandle, timelineTrack, detailPage);
        }
    });
}

function setupTimelineSlider(timelineSlider, timelineHandle, timelineTrack, detailPage) {
    let isDragging = false;
    let currentPosition = 50; // Start at 50% (middle)
    
    // Find background images within this specific detail page
    const layer1 = detailPage.querySelector('.detail-page__background--layer-1');
    const layer2 = detailPage.querySelector('.detail-page__background--layer-2');
    const image1 = layer1 ? layer1.querySelector('.detail-page__background-image') : null;
    const image2 = layer2 ? layer2.querySelector('.detail-page__background-image') : null;
    
    // Get the image sources
    const image1Src = image1 ? image1.src : null;
    const image2Src = image2 ? image2.src : null;
    
    // Update background based on slider position
    function updateBackground(percentage) {
        if (!layer1 || !layer2) return;
        
        // Calculate opacity based on slider position
        // At 0%: show image 1 (layer1 opacity = 1, layer2 opacity = 0)
        // At 100%: show image 2 (layer1 opacity = 0, layer2 opacity = 1)
        // Smooth transition between 0% and 100%
        const layer1Opacity = 1 - (percentage / 100);
        const layer2Opacity = percentage / 100;
        
        layer1.style.opacity = layer1Opacity;
        layer2.style.opacity = layer2Opacity;
    }
    
    // Update handle position
    function updateHandlePosition(percentage) {
        currentPosition = Math.max(0, Math.min(100, percentage));
        timelineHandle.style.left = `${currentPosition}%`;
        updateBackground(currentPosition);
    }
    
    // Get position from mouse/touch event
    function getPositionFromEvent(e) {
        const rect = timelineTrack.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const percentage = ((clientX - rect.left) / rect.width) * 100;
        return percentage;
    }
    
    // Mouse events
    timelineHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    timelineSlider.addEventListener('mousedown', (e) => {
        if (e.target === timelineSlider || e.target === timelineTrack) {
            const percentage = getPositionFromEvent(e);
            updateHandlePosition(percentage);
            isDragging = true;
        }
    });
    
    const handleMouseMove = (e) => {
        if (isDragging) {
            const percentage = getPositionFromEvent(e);
            updateHandlePosition(percentage);
        }
    };
    
    const handleMouseUp = () => {
        isDragging = false;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Touch events for mobile
    timelineHandle.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    timelineSlider.addEventListener('touchstart', (e) => {
        if (e.target === timelineSlider || e.target === timelineTrack) {
            const percentage = getPositionFromEvent(e);
            updateHandlePosition(percentage);
            isDragging = true;
        }
    });
    
    const handleTouchMove = (e) => {
        if (isDragging) {
            const percentage = getPositionFromEvent(e);
            updateHandlePosition(percentage);
        }
    };
    
    const handleTouchEnd = () => {
        isDragging = false;
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    // Initialize handle position and background
    updateHandlePosition(50);
}

// ============================================
// Background Image Cross-Fade Animation
// ============================================

// Function to change background images with cross-fade effect
function changeBackgroundImage(imageSrc) {
    const layer1 = document.querySelector('.detail-page__background--layer-1');
    const layer2 = document.querySelector('.detail-page__background--layer-2');
    
    if (!layer1 || !layer2) return;
    
    // Determine which layer is currently visible
    const currentLayer = layer1.style.opacity === '1' || !layer1.style.opacity ? layer1 : layer2;
    const nextLayer = currentLayer === layer1 ? layer2 : layer1;
    
    // Set the new image
    const nextImage = nextLayer.querySelector('.detail-page__background-image');
    if (nextImage) {
        nextImage.src = imageSrc;
    }
    
    // Cross-fade animation
    currentLayer.style.opacity = '0';
    nextLayer.style.opacity = '1';
}

// You can call changeBackgroundImage() when the timeline slider moves
// to update the background based on the timeline position

// ============================================
// Countdown Progress Ring Update
// ============================================

function updateCountdownProgress() {
    const progressFill = document.querySelector('.countdown-progress-fill');
    const countdownDays = document.querySelector('.countdown-days');
    
    if (!progressFill || !countdownDays) return;
    
    // Get the current countdown days (default: 71)
    const daysRemaining = parseInt(countdownDays.textContent) || 71;
    const totalDays = 90; // Assuming 90 days total
    const daysPassed = totalDays - daysRemaining;
    const progressPercentage = (daysPassed / totalDays) * 100;
    
    // Calculate the stroke-dashoffset
    // Circumference = 2 * π * r = 2 * π * 90 ≈ 565.48
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (circumference * progressPercentage / 100);
    
    // Set initial position
    progressFill.style.strokeDashoffset = circumference;
    
    // Animate to final position
    setTimeout(() => {
        progressFill.style.transition = 'stroke-dashoffset 2s ease-out';
        progressFill.style.strokeDashoffset = offset;
    }, 100);
}

// ============================================
// Initialize Application
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    navigateToPage('home');
    
    // Initialize timeline sliders for all detail pages
    initializeTimelineSliders();
    
    // Update countdown progress ring
    updateCountdownProgress();

    // Initialize detail page inspiration reveals
    setupDetailReveals();
    
    // Add any initialization code here
    console.log('Home Memories app initialized');
});

