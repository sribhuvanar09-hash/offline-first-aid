/* =========================================================
   OFFLINE FIRST AID
   MAIN JAVASCRIPT
========================================================= */

"use strict";

/* =========================================================
   CONFIG
========================================================= */

const API_URL = "http://127.0.0.1:5000/api";

const STORAGE_KEYS = {
    theme: "offlineFirstAidTheme",
    favorites: "offlineFirstAidFavorites",
    kit: "offlineFirstAidKit"
};


/* =========================================================
   APP STATE
========================================================= */

let allGuides = {};
let currentGuide = null;

let quizIndex = 0;
let quizScore = 0;

let deferredPrompt = null;
let toastTimer = null;


/* =========================================================
   GUIDE ICONS
========================================================= */

const guideIcons = {
    "bleeding": "🩸",
    "burns": "🔥",
    "choking": "🫁",
    "injuries": "🩹",
    "bites": "🦟",
    "nosebleed": "👃",
    "fainting": "😵",
    "deep-cut": "🩸",
    "minor-cut": "✂️",
    "sprain": "🦶",
    "muscle-strain": "💪",
    "fracture": "🦴",
    "ankle-twist": "🦶",
    "head-injury": "🧠",
    "eye-injury": "👁️",
    "finger-injury": "☝️",
    "foot-injury": "🦶",
    "knee-injury": "🦵",
    "abrasion": "🩹",
    "bruise": "🟣",
    "minor-burn": "🔥",
    "nose-injury": "👃"
};


/* =========================================================
   MAIN GUIDE CARDS
========================================================= */

const mainGuideKeys = [
    "bleeding",
    "burns",
    "choking",
    "injuries",
    "bites",
    "nosebleed",
    "fainting"
];


/* =========================================================
   OFFLINE GUIDE DATA
   This allows the application to work without internet.
========================================================= */

const offlineGuides = {

    bleeding: {
        title: "Bleeding",
        description:
            "For minor bleeding, use basic first-aid measures and monitor the injury.",
        steps: [
            "Wash your hands if possible.",
            "Use a clean cloth or dressing to apply gentle, steady pressure.",
            "Keep the wound covered with a clean dressing.",
            "Seek medical help if the bleeding is severe or does not stop."
        ],
        warning:
            "Heavy bleeding or a serious wound needs urgent professional medical attention."
    },

    burns: {
        title: "Burns",
        description:
            "For a minor burn, cool the affected area with clean, cool running water.",
        steps: [
            "Move away from the source of the burn.",
            "Cool the area with cool running water.",
            "Remove tight items such as jewellery if they are not stuck to the skin.",
            "Cover the area loosely with a clean dressing."
        ],
        warning:
            "Large, deep, chemical, electrical, or severe burns require medical attention."
    },

    choking: {
        title: "Choking",
        description:
            "Choking can be an emergency. Get help immediately when a person cannot breathe normally.",
        steps: [
            "Encourage the person to cough if they can breathe and cough.",
            "If they cannot breathe, speak, or cough effectively, call emergency services.",
            "Follow the emergency first-aid procedure appropriate for the person's age.",
            "Stay with the person until help arrives."
        ],
        warning:
            "Severe choking is an emergency. Contact local emergency services immediately."
    },

    injuries: {
        title: "Sprains and Injuries",
        description:
            "For a minor sprain or soft-tissue injury, protect the injured area and avoid activities that increase pain.",
        steps: [
            "Stop the activity and rest the injured area.",
            "Use a cold pack wrapped in cloth for short periods.",
            "Keep the injured area supported if comfortable.",
            "Seek medical advice if there is severe pain, deformity, or inability to use the limb normally."
        ],
        warning:
            "Suspected fractures or serious injuries need professional medical assessment."
    },

    bites: {
        title: "Insect Bites",
        description:
            "Most minor insect bites can be managed with basic first aid.",
        steps: [
            "Move away from the insect or source.",
            "Wash the affected area with soap and water.",
            "Use a cool compress to help reduce discomfort.",
            "Monitor for signs of an allergic reaction."
        ],
        warning:
            "Difficulty breathing, swelling of the face or throat, or other severe allergic symptoms require emergency medical help."
    },

    nosebleed: {
        title: "Nosebleed",
        description:
            "A simple nosebleed can often be managed with correct positioning and gentle pressure.",
        steps: [
            "Sit upright and lean slightly forward.",
            "Pinch the soft part of the nose gently.",
            "Continue pressure for several minutes.",
            "If bleeding continues or is heavy, seek medical help."
        ],
        warning:
            "Persistent or heavy nosebleeding requires medical attention."
    },

    fainting: {
        title: "Fainting",
        description:
            "A person who faints should be kept safe and monitored while they recover.",
        steps: [
            "Help the person lie down safely.",
            "Check that they are breathing normally.",
            "Keep the area clear and allow them to recover.",
            "Get medical help if they do not recover normally or if there are concerning symptoms."
        ],
        warning:
            "Unresponsiveness or abnormal breathing is an emergency."
    },

    "deep-cut": {
        title: "Deep Cut",
        description:
            "A deep cut may need professional medical attention, especially when bleeding is heavy or the wound is large.",
        steps: [
            "Stop the activity and move to a safe place.",
            "Use a clean cloth or dressing to apply steady pressure.",
            "Keep pressure on the wound and avoid repeatedly checking it.",
            "Get urgent medical help for heavy bleeding, a large wound, or a wound that may need medical closure."
        ],
        warning:
            "Heavy bleeding or a deep or serious wound requires urgent professional medical attention."
    },

    "minor-cut": {
        title: "Minor Cut",
        description:
            "Small cuts can usually be managed with basic wound care.",
        steps: [
            "Wash your hands if possible.",
            "Rinse the cut gently with clean running water.",
            "Apply gentle pressure if there is bleeding.",
            "Cover the cut with a clean dressing."
        ],
        warning:
            "Seek medical advice if the cut is deep, badly contaminated, or does not stop bleeding."
    },

    sprain: {
        title: "Sprain",
        description:
            "A minor sprain can be supported with rest and protection while monitoring symptoms.",
        steps: [
            "Stop the activity and rest the affected area.",
            "Use a cold pack wrapped in cloth for short periods.",
            "Keep the area supported if comfortable.",
            "Seek medical advice if pain or swelling is severe or movement is very difficult."
        ],
        warning:
            "Severe pain, major swelling, deformity, or inability to use the limb needs medical assessment."
    },

    "muscle-strain": {
        title: "Muscle Strain",
        description:
            "A minor muscle strain can often be managed by stopping the activity and protecting the affected area.",
        steps: [
            "Stop the activity that caused the pain.",
            "Rest the affected muscle.",
            "Use a cold pack wrapped in cloth for short periods.",
            "Return to normal activity gradually when comfortable."
        ],
        warning:
            "Severe pain, significant swelling, or inability to use the affected area normally requires medical advice."
    },

    fracture: {
        title: "Suspected Fracture",
        description:
            "A suspected broken bone requires medical assessment. Avoid unnecessary movement of the injured area.",
        steps: [
            "Keep the injured area as still and comfortable as possible.",
            "Do not try to straighten or reposition the injured limb.",
            "Get urgent medical assistance.",
            "Monitor the person while waiting for professional help."
        ],
        warning:
            "A suspected fracture requires professional medical assessment, especially when there is severe pain, deformity, or loss of normal function."
    },

    "ankle-twist": {
        title: "Ankle Twist",
        description:
            "A twisted ankle may cause pain and swelling. Protect the ankle and avoid activities that increase pain.",
        steps: [
            "Stop walking or running and rest the ankle.",
            "Use a cold pack wrapped in cloth for short periods.",
            "Keep the ankle supported if comfortable.",
            "Seek medical advice if you cannot use the ankle normally or symptoms are severe."
        ],
        warning:
            "Severe pain, deformity, major swelling, or inability to put weight on the ankle requires medical assessment."
    },

    "head-injury": {
        title: "Head Injury",
        description:
            "A head injury should be monitored carefully because some symptoms may require urgent medical assessment.",
        steps: [
            "Stop the activity and keep the person in a safe place.",
            "Monitor for changes in alertness or unusual symptoms.",
            "Avoid returning to sports or strenuous activity until medically advised if symptoms occur.",
            "Seek medical help if there are concerning or worsening symptoms."
        ],
        warning:
            "Loss of consciousness, repeated vomiting, seizure, increasing confusion, severe headache, or unusual behavior requires urgent medical attention."
    },

    "eye-injury": {
        title: "Eye Injury",
        description:
            "Protect the eye and avoid rubbing or pressing on it.",
        steps: [
            "Stop the activity and protect the eye from further injury.",
            "Do not rub or press the eye.",
            "If something is irritating the eye, gently rinse with clean water when appropriate.",
            "Seek medical advice if vision changes, significant pain, or a serious injury occurs."
        ],
        warning:
            "Vision loss, severe eye pain, chemical exposure, or a penetrating injury requires urgent medical attention."
    },

    "finger-injury": {
        title: "Finger Injury",
        description:
            "A minor finger injury can be managed by protecting the finger and monitoring pain and swelling.",
        steps: [
            "Stop using the injured finger.",
            "Use a cold pack wrapped in cloth for short periods.",
            "Keep the hand comfortably supported.",
            "Seek medical advice if the finger looks deformed or cannot be moved normally."
        ],
        warning:
            "Severe pain, deformity, loss of normal movement, or significant swelling requires medical assessment."
    },

    "foot-injury": {
        title: "Foot Injury",
        description:
            "For a minor foot injury, rest the foot and avoid activities that increase pain.",
        steps: [
            "Stop the activity and rest the foot.",
            "Use a cold pack wrapped in cloth for short periods.",
            "Keep the foot comfortably supported.",
            "Seek medical advice if walking is very difficult or symptoms are severe."
        ],
        warning:
            "Severe pain, deformity, major swelling, or inability to use the foot normally requires medical assessment."
    },

    "knee-injury": {
        title: "Knee Injury",
        description:
            "A minor knee injury can be managed by stopping activity and protecting the knee.",
        steps: [
            "Stop the activity and rest the knee.",
            "Use a cold pack wrapped in cloth for short periods.",
            "Keep the knee comfortably supported.",
            "Seek medical advice if pain, swelling, or movement problems are significant."
        ],
        warning:
            "Severe pain, deformity, major swelling, or inability to use the knee normally requires medical assessment."
    },

    abrasion: {
        title: "Scrape",
        description:
            "A minor scrape can usually be cleaned and covered with a clean dressing.",
        steps: [
            "Wash your hands if possible.",
            "Gently rinse the scrape with clean running water.",
            "Apply gentle pressure if there is bleeding.",
            "Cover it with a clean dressing."
        ],
        warning:
            "Seek medical advice if the wound is deep, heavily contaminated, or shows signs of infection."
    },

    bruise: {
        title: "Bruise",
        description:
            "A minor bruise can often be managed with rest and a cold pack.",
        steps: [
            "Stop the activity if the area is painful.",
            "Use a cold pack wrapped in cloth for short periods.",
            "Rest the affected area.",
            "Monitor the bruise for increasing pain or swelling."
        ],
        warning:
            "Severe pain, significant swelling, or an unexplained or rapidly worsening bruise requires medical advice."
    },

    "minor-burn": {
        title: "Minor Burn",
        description:
            "A minor burn should be cooled promptly with clean, cool running water.",
        steps: [
            "Move away from the source of the burn.",
            "Cool the affected area with cool running water.",
            "Remove jewellery or tight items if they are not stuck to the skin.",
            "Cover the area loosely with a clean dressing."
        ],
        warning:
            "Large, deep, chemical, electrical, or severe burns require medical attention."
    },

    "nose-injury": {
        title: "Nose Injury",
        description:
            "A minor nose injury should be protected and monitored for bleeding or other concerning symptoms.",
        steps: [
            "Stop the activity and sit upright.",
            "If there is a nosebleed, lean slightly forward.",
            "Apply gentle pressure to the soft part of the nose if appropriate.",
            "Seek medical advice if there is significant swelling, deformity, or persistent bleeding."
        ],
        warning:
            "Heavy bleeding, difficulty breathing, significant deformity, or a serious facial injury requires medical assessment."
    }
};


/* =========================================================
   QUIZ DATA
========================================================= */

const quizQuestions = [
    {
        question: "What should you do first for a minor cut?",
        options: [
            "Ignore it",
            "Wash your hands if possible",
            "Rub the wound",
            "Apply perfume"
        ],
        answer: 1
    },

    {
        question: "What should be used to cool a minor burn?",
        options: [
            "Cool running water",
            "Ice directly on skin",
            "Hot water",
            "Toothpaste"
        ],
        answer: 0
    },

    {
        question: "What is important during severe choking?",
        options: [
            "Wait for it to pass",
            "Call emergency services",
            "Give random food",
            "Leave the person alone"
        ],
        answer: 1
    },

    {
        question: "What should you avoid doing with a suspected fracture?",
        options: [
            "Keeping it still",
            "Getting medical help",
            "Trying to straighten it",
            "Monitoring the person"
        ],
        answer: 2
    },

    {
        question: "Why is first-aid knowledge useful?",
        options: [
            "It replaces doctors",
            "It can help provide immediate basic support",
            "It guarantees no injury",
            "It replaces emergency services"
        ],
        answer: 1
    }
];


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});


/* =========================================================
   INITIALIZE APP
========================================================= */

function initializeApp() {

    initializeTheme();

    setupThemeButton();

    setupMobileMenu();

    setupSearch();

    setupChecklist();

    setupInstallButton();

    setupOnlineStatus();

    setupModalEvents();

    setupKeyboardEvents();

    loadGuides();

    initializeQuiz();

    registerServiceWorker();

    hidePageLoader();

    console.log("Offline First Aid initialized successfully.");
}


/* =========================================================
   THEME
========================================================= */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            STORAGE_KEYS.theme
        );

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

    } else if (savedTheme === "light") {

        document.body.classList.remove("dark");

    } else {

        /*
         * If user has never selected a theme,
         * follow device preference.
         */

        const prefersDark =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

        if (prefersDark) {
            document.body.classList.add("dark");
        }
    }

    updateThemeButton();
}


/* =========================================================
   THEME BUTTON
========================================================= */

function setupThemeButton() {

    const themeButton =
        document.getElementById(
            "themeToggle"
        );

    if (!themeButton) {
        console.warn(
            "themeToggle button not found."
        );
        return;
    }

    themeButton.addEventListener(
        "click",
        toggleTheme
    );

    updateThemeButton();
}


/* =========================================================
   TOGGLE DARK / LIGHT
========================================================= */

function toggleTheme() {

    const isDark =
        document.body.classList.toggle(
            "dark"
        );

    localStorage.setItem(
        STORAGE_KEYS.theme,
        isDark ? "dark" : "light"
    );

    updateThemeButton();

    showToast(
        isDark
            ? "Dark theme enabled 🌙"
            : "Light theme enabled ☀️"
    );
}


/* =========================================================
   UPDATE THEME ICON
========================================================= */

function updateThemeButton() {

    const themeButton =
        document.getElementById(
            "themeToggle"
        );

    if (!themeButton) return;

    const isDark =
        document.body.classList.contains(
            "dark"
        );

    /*
     * Works with either:
     * textContent or innerHTML.
     */

    themeButton.innerHTML =
        isDark
            ? "☀️"
            : "🌙";

    themeButton.setAttribute(
        "aria-label",
        isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
    );

    themeButton.setAttribute(
        "title",
        isDark
            ? "Light theme"
            : "Dark theme"
    );
}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const menuButton =
        document.querySelector(
            ".menu-toggle"
        );

    const nav =
        document.querySelector(
            ".main-nav, .nav-links"
        );

    if (!menuButton || !nav) {
        return;
    }

    menuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                nav.classList.toggle(
                    "open"
                );

            menuButton.classList.toggle(
                "active",
                isOpen
            );

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        }
    );

    /*
     * Close mobile menu when
     * clicking a navigation link.
     */

    nav.querySelectorAll("a").forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    nav.classList.remove(
                        "open"
                    );

                    menuButton.classList.remove(
                        "active"
                    );

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            );
        }
    );
}


/* =========================================================
   GLOBAL MOBILE MENU FUNCTIONS
   Supports old HTML onclick handlers too.
========================================================= */

function toggleMenu() {

    const menuButton =
        document.querySelector(
            ".menu-toggle"
        );

    const nav =
        document.querySelector(
            ".main-nav, .nav-links"
        );

    if (!menuButton || !nav) return;

    const isOpen =
        nav.classList.toggle(
            "open"
        );

    menuButton.classList.toggle(
        "active",
        isOpen
    );

    menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );
}


function closeMenu() {

    const menuButton =
        document.querySelector(
            ".menu-toggle"
        );

    const nav =
        document.querySelector(
            ".main-nav, .nav-links"
        );

    if (!menuButton || !nav) return;

    nav.classList.remove("open");

    menuButton.classList.remove(
        "active"
    );

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );
}


/* =========================================================
   LOAD GUIDES
========================================================= */

async function loadGuides() {

    /*
     * Start with local data immediately.
     * This makes the application usable offline.
     */

    allGuides = {
        ...offlineGuides
    };

    displayGuides();

    displayFavorites();

    try {

        const response =
            await fetch(
                `${API_URL}/firstaid`,
                {
                    method: "GET",
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );

        if (!response.ok) {
            throw new Error(
                "API request failed"
            );
        }

        const result =
            await response.json();

        if (
            result &&
            result.success &&
            result.data
        ) {

            allGuides = {
                ...offlineGuides,
                ...result.data
            };

            console.log(
                "First-aid data loaded from Flask API."
            );

            updateConnectionStatus(
                true
            );

            displayGuides();
            displayFavorites();
        }

    } catch (error) {

        console.log(
            "Using offline first-aid data."
        );

        updateConnectionStatus(
            navigator.onLine
        );
    }
}


/* =========================================================
   DISPLAY MAIN GUIDES
========================================================= */

function displayGuides(
    guidesToShow = null
) {

    const grid =
        document.getElementById(
            "guideGrid"
        );

    if (!grid) return;

    grid.innerHTML = "";

    const keys =
        guidesToShow
            ? Object.keys(guidesToShow)
            : mainGuideKeys.filter(
                key => allGuides[key]
            );

    keys.forEach(key => {

        const guide =
            allGuides[key];

        if (!guide) return;

        const card =
            createGuideCard(
                key,
                guide
            );

        grid.appendChild(card);
    });

    updateGuideCount(keys.length);

    const noResults =
        document.getElementById(
            "noResults"
        );

    if (noResults) {

        noResults.hidden =
            keys.length !== 0;
    }
}


/* =========================================================
   CREATE GUIDE CARD
========================================================= */

function createGuideCard(
    key,
    guide
) {

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "guide-card";

    const isFavorite =
        isGuideFavorite(key);

    card.innerHTML = `
        <div class="guide-icon">
            ${guideIcons[key] || "🩺"}
        </div>

        <h3>
            ${escapeHTML(guide.title)}
        </h3>

        <p>
            ${escapeHTML(guide.description)}
        </p>

        <div class="guide-card-footer">

            <span class="guide-card-action">
                View guide →
            </span>

            <button
                class="guide-favorite ${isFavorite ? "active" : ""}"
                type="button"
                aria-label="${
                    isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }"
            >
                ${isFavorite ? "♥" : "♡"}
            </button>

        </div>
    `;

    /*
     * Open guide when card is clicked.
     */

    card.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    ".guide-favorite"
                )
            ) {
                return;
            }

            openGuide(key);
        }
    );

    /*
     * Favorite button.
     */

    const favoriteButton =
        card.querySelector(
            ".guide-favorite"
        );

    favoriteButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            toggleFavorite(key);

            /*
             * Re-render the card so
             * the heart updates.
             */

            displayGuides(
                getCurrentlyDisplayedGuides()
            );

            displayFavorites();
        }
    );

    return card;
}


/* =========================================================
   GET CURRENTLY DISPLAYED GUIDES
========================================================= */

function getCurrentlyDisplayedGuides() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    if (
        !searchInput ||
        !searchInput.value.trim()
    ) {

        return null;
    }

    const query =
        searchInput.value
            .trim()
            .toLowerCase();

    const filtered = {};

    Object.keys(allGuides).forEach(
        key => {

            const guide =
                allGuides[key];

            const searchableText =
                `
                ${guide.title}
                ${guide.description}
                ${guide.warning}
                ${guide.steps.join(" ")}
                `
                .toLowerCase();

            if (
                searchableText.includes(
                    query
                )
            ) {
                filtered[key] =
                    guide;
            }
        }
    );

    return filtered;
}


/* =========================================================
   GUIDE COUNT
========================================================= */

function updateGuideCount(count) {

    const countElement =
        document.getElementById(
            "guideCount"
        );

    if (!countElement) return;

    countElement.textContent =
        `${count} guide${count === 1 ? "" : "s"}`;
}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );

    const clearButton =
        document.getElementById(
            "clearSearch"
        );

    if (!input) return;

    input.addEventListener(
        "input",
        searchGuides
    );

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearSearch
        );
    }

    updateSearchBoxState();
}


/* =========================================================
   SEARCH GUIDES
========================================================= */

function searchGuides() {

    const input =
        document.getElementById(
            "searchInput"
        );

    if (!input) return;

    const query =
        input.value
            .trim()
            .toLowerCase();

    updateSearchBoxState();

    if (!query) {

        displayGuides();

        return;
    }

    const filtered = {};

    Object.keys(allGuides).forEach(
        key => {

            const guide =
                allGuides[key];

            const text =
                `
                ${guide.title}
                ${guide.description}
                ${guide.warning}
                ${guide.steps.join(" ")}
                `
                .toLowerCase();

            if (
                text.includes(query)
            ) {

                filtered[key] =
                    guide;
            }
        }
    );

    displayGuides(
        filtered
    );
}


/* =========================================================
   CLEAR SEARCH
========================================================= */

function clearSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );

    if (!input) return;

    input.value = "";

    updateSearchBoxState();

    displayGuides();

    input.focus();
}


/* =========================================================
   SEARCH BOX STATE
========================================================= */

function updateSearchBoxState() {

    const input =
        document.getElementById(
            "searchInput"
        );

    const box =
        document.querySelector(
            ".search-box"
        );

    if (!input || !box) return;

    box.classList.toggle(
        "has-value",
        input.value.trim().length > 0
    );
}


/* =========================================================
   QUICK FIND
========================================================= */

function findSituation(key) {

    const guide =
        allGuides[key] ||
        offlineGuides[key];

    if (!guide) {

        showToast(
            "Guide not available."
        );

        return;
    }

    openGuide(key);
}


/* =========================================================
   OPEN GUIDE MODAL
========================================================= */

function openGuide(key) {

    const guide =
        allGuides[key] ||
        offlineGuides[key];

    if (!guide) return;

    currentGuide = {
        key,
        ...guide
    };

    const modal =
        document.getElementById(
            "guideModal"
        );

    if (!modal) return;

    const icon =
        document.getElementById(
            "modalIcon"
        );

    const title =
        document.getElementById(
            "modalTitle"
        );

    const description =
        document.getElementById(
            "modalDescription"
        );

    const steps =
        document.getElementById(
            "modalSteps"
        );

    const warning =
        document.getElementById(
            "modalWarning"
        );

    const favoriteButton =
        document.getElementById(
            "favoriteButton"
        );

    if (icon) {

        icon.textContent =
            guideIcons[key] ||
            "🩺";
    }

    if (title) {

        title.textContent =
            guide.title;
    }

    if (description) {

        description.textContent =
            guide.description;
    }

    if (steps) {

        steps.innerHTML = "";

        guide.steps.forEach(
            step => {

                const li =
                    document.createElement(
                        "li"
                    );

                li.textContent =
                    step;

                steps.appendChild(li);
            }
        );
    }

    if (warning) {

        warning.textContent =
            guide.warning;
    }

    updateModalFavoriteButton();

    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "no-scroll"
    );
}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

    const modal =
        document.getElementById(
            "guideModal"
        );

    if (!modal) return;

    modal.classList.remove(
        "open"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "no-scroll"
    );

    stopReading();
}


/* =========================================================
   MODAL EVENTS
========================================================= */

function setupModalEvents() {

    const modal =
        document.getElementById(
            "guideModal"
        );

    if (!modal) return;

    const closeButton =
        modal.querySelector(
            ".modal-close"
        );

    const overlay =
        modal.querySelector(
            ".modal-overlay"
        );

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeModal
        );
    }

    if (overlay) {

        overlay.addEventListener(
            "click",
            closeModal
        );
    }

    const favoriteButton =
        document.getElementById(
            "favoriteButton"
        );

    if (favoriteButton) {

        favoriteButton.addEventListener(
            "click",
            () => {

                if (!currentGuide) return;

                toggleFavorite(
                    currentGuide.key
                );

                updateModalFavoriteButton();

                displayFavorites();

                displayGuides(
                    getCurrentlyDisplayedGuides()
                );
            }
        );
    }
}


/* =========================================================
   MODAL FAVORITE BUTTON
========================================================= */

function updateModalFavoriteButton() {

    const button =
        document.getElementById(
            "favoriteButton"
        );

    if (!button || !currentGuide) {
        return;
    }

    const favorite =
        isGuideFavorite(
            currentGuide.key
        );

    button.textContent =
        favorite
            ? "♥"
            : "♡";

    button.classList.toggle(
        "active",
        favorite
    );

    button.setAttribute(
        "aria-label",
        favorite
            ? "Remove from favorites"
            : "Add to favorites"
    );
}


/* =========================================================
   FAVORITES
========================================================= */

function getFavorites() {

    try {

        const stored =
            localStorage.getItem(
                STORAGE_KEYS.favorites
            );

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.warn(
            "Could not read favorites."
        );

        return [];
    }
}


function saveFavorites(
    favorites
) {

    localStorage.setItem(
        STORAGE_KEYS.favorites,
        JSON.stringify(
            favorites
        )
    );
}


function isGuideFavorite(key) {

    return getFavorites()
        .includes(key);
}


function toggleFavorite(key) {

    const favorites =
        getFavorites();

    const index =
        favorites.indexOf(key);

    if (index === -1) {

        favorites.push(key);

        showToast(
            "Added to favorites ❤️"
        );

    } else {

        favorites.splice(
            index,
            1
        );

        showToast(
            "Removed from favorites"
        );
    }

    saveFavorites(
        favorites
    );

    updateModalFavoriteButton();
}


/* =========================================================
   DISPLAY FAVORITES
========================================================= */

function displayFavorites() {

    const grid =
        document.getElementById(
            "favoritesGrid"
        );

    const empty =
        document.getElementById(
            "noFavorites"
        );

    if (!grid) return;

    grid.innerHTML = "";

    const favorites =
        getFavorites();

    const validFavorites =
        favorites.filter(
            key =>
                allGuides[key] ||
                offlineGuides[key]
        );

    if (
        empty
    ) {

        empty.hidden =
            validFavorites.length > 0;
    }

    validFavorites.forEach(
        key => {

            const guide =
                allGuides[key] ||
                offlineGuides[key];

            const card =
                createGuideCard(
                    key,
                    guide
                );

            grid.appendChild(
                card
            );
        }
    );
}


/* =========================================================
   CHECKLIST
========================================================= */

function setupChecklist() {

    const checkboxes =
        document.querySelectorAll(
            ".check-item input, .kit-check"
        );

    if (!checkboxes.length) {
        return;
    }

    const saved =
        getKitState();

    checkboxes.forEach(
        checkbox => {

            const item =
                checkbox.dataset.item;

            if (
                item &&
                saved[item] === true
            ) {

                checkbox.checked =
                    true;
            }

            checkbox.addEventListener(
                "change",
                saveKitState
            );
        }
    );

    updateChecklistProgress();
}


/* =========================================================
   KIT STATE
========================================================= */

function getKitState() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEYS.kit
            );

        return saved
            ? JSON.parse(saved)
            : {};

    } catch (error) {

        return {};
    }
}


/* =========================================================
   SAVE KIT STATE
========================================================= */

function saveKitState() {

    const state = {};

    const checkboxes =
        document.querySelectorAll(
            ".check-item input, .kit-check"
        );

    checkboxes.forEach(
        checkbox => {

            const item =
                checkbox.dataset.item;

            if (item) {

                state[item] =
                    checkbox.checked;
            }
        }
    );

    localStorage.setItem(
        STORAGE_KEYS.kit,
        JSON.stringify(state)
    );

    updateChecklistProgress();
}


/* =========================================================
   CHECKLIST PROGRESS
========================================================= */

function updateChecklistProgress() {

    const checkboxes =
        document.querySelectorAll(
            ".check-item input, .kit-check"
        );

    if (!checkboxes.length) return;

    const checked =
        Array.from(
            checkboxes
        ).filter(
            checkbox =>
                checkbox.checked
        ).length;

    const total =
        checkboxes.length;

    const percentage =
        Math.round(
            (checked / total) *
            100
        );

    const circle =
        document.getElementById(
            "progressCircle"
        );

    const text =
        document.getElementById(
            "progressText"
        );

    if (circle) {

        circle.style.setProperty(
            "--progress",
            `${percentage}%`
        );
    }

    if (text) {

        text.textContent =
            `${percentage}%`;
    }
}


/* =========================================================
   RESET CHECKLIST
========================================================= */

function resetChecklist() {

    const checkboxes =
        document.querySelectorAll(
            ".check-item input, .kit-check"
        );

    checkboxes.forEach(
        checkbox => {

            checkbox.checked =
                false;
        }
    );

    localStorage.removeItem(
        STORAGE_KEYS.kit
    );

    updateChecklistProgress();

    showToast(
        "First-aid kit checklist reset."
    );
}


/* =========================================================
   QUIZ
========================================================= */

function initializeQuiz() {

    quizIndex = 0;
    quizScore = 0;

    renderQuiz();
}


/* =========================================================
   RENDER QUIZ
========================================================= */

function renderQuiz() {

    const questionElement =
        document.getElementById(
            "quizQuestion"
        );

    const optionsElement =
        document.getElementById(
            "quizOptions"
        );

    const progressText =
        document.getElementById(
            "quizProgress"
        );

    const progressBar =
        document.getElementById(
            "quizBar"
        );

    const result =
        document.getElementById(
            "quizResult"
        );

    if (
        !questionElement ||
        !optionsElement
    ) {
        return;
    }

    if (
        quizIndex >=
        quizQuestions.length
    ) {

        showQuizResult();

        return;
    }

    const current =
        quizQuestions[
            quizIndex
        ];

    questionElement.textContent =
        current.question;

    optionsElement.innerHTML = "";

    current.options.forEach(
        (
            option,
            index
        ) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.className =
                "quiz-option";

            button.textContent =
                option;

            button.addEventListener(
                "click",
                () => {

                    answerQuiz(
                        index,
                        button
                    );
                }
            );

            optionsElement.appendChild(
                button
            );
        }
    );

    if (progressText) {

        progressText.textContent =
            `Question ${
                quizIndex + 1
            } of ${
                quizQuestions.length
            }`;
    }

    if (progressBar) {

        const percentage =
            (
                (quizIndex + 1) /
                quizQuestions.length
            ) * 100;

        progressBar.style.width =
            `${percentage}%`;
    }

    if (result) {

        result.hidden =
            true;
    }
}


/* =========================================================
   ANSWER QUIZ
========================================================= */

function answerQuiz(
    selectedIndex,
    selectedButton
) {

    const current =
        quizQuestions[
            quizIndex
        ];

    const options =
        document.querySelectorAll(
            ".quiz-option"
        );

    options.forEach(
        button => {

            button.disabled =
                true;
        }
    );

    if (
        selectedIndex ===
        current.answer
    ) {

        quizScore++;

        selectedButton.classList.add(
            "correct"
        );

    } else {

        selectedButton.classList.add(
            "incorrect"
        );

        if (
            options[
                current.answer
            ]
        ) {

            options[
                current.answer
            ].classList.add(
                "correct"
            );
        }
    }

    setTimeout(
        () => {

            quizIndex++;

            renderQuiz();

        },
        850
    );
}


/* =========================================================
   SHOW QUIZ RESULT
========================================================= */

function showQuizResult() {

    const content =
        document.getElementById(
            "quizContent"
        );

    const result =
        document.getElementById(
            "quizResult"
        );

    const score =
        document.getElementById(
            "finalScore"
        );

    if (content) {

        /*
         * Hide question area/buttons
         * if they exist.
         */

        const questionArea =
            content.querySelector(
                ".quiz-question-area"
            );

        const options =
            content.querySelector(
                ".quiz-options"
            );

        if (questionArea) {
            questionArea.hidden =
                true;
        }

        if (options) {
            options.hidden =
                true;
        }
    }

    if (score) {

        score.textContent =
            `${quizScore}/${quizQuestions.length}`;
    }

    if (result) {

        result.hidden =
            false;
    }
}


/* =========================================================
   RESTART QUIZ
========================================================= */

function restartQuiz() {

    quizIndex = 0;
    quizScore = 0;

    const content =
        document.getElementById(
            "quizContent"
        );

    if (content) {

        const questionArea =
            content.querySelector(
                ".quiz-question-area"
            );

        const options =
            content.querySelector(
                ".quiz-options"
            );

        if (questionArea) {
            questionArea.hidden =
                false;
        }

        if (options) {
            options.hidden =
                false;
        }
    }

    renderQuiz();

    showToast(
        "Quiz restarted 🧠"
    );
}


/* =========================================================
   READ ALOUD
========================================================= */

function readCurrentGuide() {

    if (!currentGuide) {

        showToast(
            "Open a guide first."
        );

        return;
    }

    if (
        !("speechSynthesis" in window)
    ) {

        showToast(
            "Read aloud is not supported on this browser."
        );

        return;
    }

    stopReading();

    const text =
        `
        ${currentGuide.title}.
        ${currentGuide.description}.
        Steps:
        ${currentGuide.steps.join(". ")}.
        Warning:
        ${currentGuide.warning}.
        `;

    const speech =
        new SpeechSynthesisUtterance(
            text
        );

    speech.lang = "en-IN";

    speech.rate = 0.92;

    speech.pitch = 1;

    window.speechSynthesis.speak(
        speech
    );

    showToast(
        "Reading guide aloud 🔊"
    );
}


/* =========================================================
   OLD FUNCTION COMPATIBILITY
========================================================= */

function readGuideAloud() {
    readCurrentGuide();
}


function stopReading() {

    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis.cancel();
    }
}


/* =========================================================
   ONLINE / OFFLINE STATUS
========================================================= */

function setupOnlineStatus() {

    window.addEventListener(
        "online",
        () => {

            updateConnectionStatus(
                true
            );

            showToast(
                "Internet connection restored."
            );
        }
    );

    window.addEventListener(
        "offline",
        () => {

            updateConnectionStatus(
                false
            );

            showToast(
                "Offline mode active — guides still work."
            );
        }
    );

    updateConnectionStatus(
        navigator.onLine
    );
}


/* =========================================================
   UPDATE CONNECTION STATUS
========================================================= */

function updateConnectionStatus(
    isOnline
) {

    const status =
        document.getElementById(
            "connectionStatus"
        );

    if (!status) return;

    const dot =
        status.querySelector(
            ".status-dot"
        );

    const text =
        status.querySelector(
            ".status-text"
        );

    status.classList.toggle(
        "offline",
        !isOnline
    );

    if (dot) {

        dot.setAttribute(
            "aria-label",
            isOnline
                ? "Online"
                : "Offline"
        );
    }

    if (text) {

        text.textContent =
            isOnline
                ? "Online"
                : "Offline mode";
    } else {

        /*
         * If HTML does not have
         * .status-text, preserve
         * existing content safely.
         */

        status.title =
            isOnline
                ? "Online"
                : "Offline mode";
    }
}


/* =========================================================
   PWA INSTALL
========================================================= */

function setupInstallButton() {

    const installButton =
        document.getElementById(
            "installButton"
        );

    if (!installButton) {
        return;
    }

    installButton.hidden =
        true;

    window.addEventListener(
        "beforeinstallprompt",
        event => {

            event.preventDefault();

            deferredPrompt =
                event;

            installButton.hidden =
                false;
        }
    );

    installButton.addEventListener(
        "click",
        async () => {

            if (!deferredPrompt) {

                showToast(
                    "Install option is not available yet."
                );

                return;
            }

            deferredPrompt.prompt();

            const choice =
                await deferredPrompt.userChoice;

            if (
                choice.outcome ===
                "accepted"
            ) {

                showToast(
                    "Installation started 📲"
                );
            }

            deferredPrompt = null;

            installButton.hidden =
                true;
        }
    );

    window.addEventListener(
        "appinstalled",
        () => {

            deferredPrompt = null;

            installButton.hidden =
                true;

            showToast(
                "Offline First Aid added successfully."
            );
        }
    );
}


/* =========================================================
   SERVICE WORKER
========================================================= */

function registerServiceWorker() {

    if (
        !("serviceWorker" in navigator)
    ) {
        return;
    }

    /*
     * Service workers only work from
     * localhost / HTTPS.
     *
     * They do NOT work from file://
     */

    if (
        location.protocol !== "http:" &&
        location.protocol !== "https:"
    ) {

        console.log(
            "Service Worker skipped: use localhost or HTTPS."
        );

        return;
    }

    window.addEventListener(
        "load",
        async () => {

            try {

                const registration =
                    await navigator.serviceWorker.register(
                        "./service-worker.js"
                    );

                console.log(
                    "Service Worker registered:",
                    registration.scope
                );

            } catch (error) {

                console.error(
                    "Service Worker registration failed:",
                    error
                );
            }
        }
    );
}


/* =========================================================
   MODAL KEYBOARD
========================================================= */

function setupKeyboardEvents() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeModal();

                closeMenu();
            }
        }
    );
}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message
) {

    let toast =
        document.getElementById(
            "appToast"
        );

    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "appToast";

        toast.className =
            "toast";

        toast.innerHTML = `
            <span>✓</span>
            <span class="toast-message"></span>
        `;

        document.body.appendChild(
            toast
        );
    }

    const messageElement =
        toast.querySelector(
            ".toast-message"
        );

    if (messageElement) {

        messageElement.textContent =
            message;
    }

    toast.classList.add(
        "show"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2600
        );
}


/* =========================================================
   PAGE LOADER
========================================================= */

function hidePageLoader() {

    const loader =
        document.querySelector(
            ".page-loader"
        );

    if (!loader) {
        return;
    }

    setTimeout(
        () => {

            loader.classList.add(
                "hide"
            );

        },
        300
    );
}


/* =========================================================
   HTML ESCAPE
   Prevents guide text from being
   interpreted as HTML.
========================================================= */

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


/* =========================================================
   GLOBAL FUNCTIONS
   Required for HTML onclick attributes.
========================================================= */

window.toggleTheme =
    toggleTheme;

window.toggleMenu =
    toggleMenu;

window.closeMenu =
    closeMenu;

window.searchGuides =
    searchGuides;

window.clearSearch =
    clearSearch;

window.findSituation =
    findSituation;

window.openGuide =
    openGuide;

window.closeModal =
    closeModal;

window.resetChecklist =
    resetChecklist;

window.restartQuiz =
    restartQuiz;

window.readCurrentGuide =
    readCurrentGuide;

window.readGuideAloud =
    readGuideAloud;

window.stopReading =
    stopReading;


/* =========================================================
   END
========================================================= */