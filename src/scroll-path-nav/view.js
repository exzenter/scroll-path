/**
 * Scroll Path Nav - Frontend JavaScript
 * Auto-detects headings and creates animated SVG scroll path navigation
 */

(function () {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', initScrollPathNav);

    function initScrollPathNav() {
        const navContainers = document.querySelectorAll('.scrollpath-nav');

        navContainers.forEach((nav) => {
            new ScrollPathNav(nav);
        });
    }

    class ScrollPathNav {
        constructor(container) {
            this.container = container;
            this.visibleClass = 'scrollpath-nav__item--visible';
            this.navItems = [];
            this.navPath = null;
            this.observer = null;

            // Read heading levels from data attribute
            const headingLevelsAttr = container.dataset.headingLevels || 'h2,h3,h4';
            this.headingLevels = headingLevelsAttr.split(',').filter(Boolean);

            // Read custom selectors from data attribute
            this.customSelectors = container.dataset.customSelectors || '';

            this.init();
        }


        init() {
            // Find all headings on the page (excluding those inside this nav)
            const headings = this.findHeadings();

            if (headings.length === 0) {
                this.container.innerHTML = '<p class="scrollpath-nav__empty">No headings found on this page.</p>';
                return;
            }

            // Ensure all headings have IDs
            this.ensureHeadingIds(headings);

            // Build the navigation structure
            this.buildNavigation(headings);

            // Setup the SVG path
            this.setupSvgPath();

            // Draw the initial path
            this.drawPath();

            // Setup intersection observer
            this.setupObserver(headings);

            // Redraw path on resize
            window.addEventListener('resize', this.debounce(() => this.drawPath(), 100));
        }

        findHeadings() {
            // Build selector from configured heading levels
            const headingSelector = this.headingLevels.join(', ');

            // Find all configured headings
            let allElements = [];

            if (headingSelector) {
                allElements = [...document.querySelectorAll(headingSelector)];
            }

            // Add custom selector elements if provided
            if (this.customSelectors) {
                const customSelectorList = this.customSelectors
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean);

                customSelectorList.forEach(selector => {
                    try {
                        const customElements = document.querySelectorAll(selector);
                        customElements.forEach(el => {
                            // Avoid duplicates
                            if (!allElements.includes(el)) {
                                allElements.push(el);
                            }
                        });
                    } catch (e) {
                        console.warn(`ScrollPathNav: Invalid custom selector "${selector}"`, e);
                    }
                });
            }

            // Sort elements by their position in the document
            allElements.sort((a, b) => {
                const position = a.compareDocumentPosition(b);
                if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
                if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
                return 0;
            });

            // Filter out elements inside the scroll path nav itself
            return allElements.filter((element) => {
                return !element.closest('.scrollpath-nav') &&
                    !element.closest('.scrollpath-nav-editor');
            });
        }


        ensureHeadingIds(headings) {
            const usedIds = new Set();

            headings.forEach((heading, index) => {
                if (!heading.id) {
                    // Generate an ID from the heading text
                    let baseId = heading.textContent
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '');

                    if (!baseId) {
                        baseId = 'section';
                    }

                    // Ensure unique ID
                    let id = baseId;
                    let counter = 1;
                    while (usedIds.has(id) || document.getElementById(id)) {
                        id = `${baseId}-${counter}`;
                        counter++;
                    }

                    heading.id = id;
                }
                usedIds.add(heading.id);
            });
        }

        buildNavigation(headings) {
            const rootList = document.createElement('ul');
            rootList.className = 'scrollpath-nav__list';

            // Track the current parent elements for each level
            const parents = {
                1: rootList,
                2: null,
                3: null,
                4: null,
                5: null,
                6: null,
            };

            let lastLevel = 1;

            headings.forEach((element) => {
                // Determine the level: for headings use tag level, for custom selectors default to level 2
                let level;
                const tagName = element.tagName.toLowerCase();
                if (/^h[1-6]$/.test(tagName)) {
                    level = parseInt(tagName.charAt(1), 10);
                } else {
                    // Custom selector elements are treated as level 2 (top level)
                    level = 2;
                }

                const item = document.createElement('li');
                item.className = 'scrollpath-nav__item';
                item.setAttribute('data-level', level);
                item.setAttribute('data-target', element.id);

                const link = document.createElement('a');
                link.className = 'scrollpath-nav__link';
                link.href = `#${element.id}`;
                link.textContent = element.textContent;

                item.appendChild(link);

                // For h1 or elements treated as top-level, just append to root
                if (level === 1) {
                    rootList.appendChild(item);
                    parents[1] = rootList;
                    parents[2] = null;
                    parents[3] = null;
                    parents[4] = null;
                    parents[5] = null;
                    parents[6] = null;
                } else if (level === 2) {
                    // Level 2 - find parent under h1 if exists, otherwise root
                    const lastH1Item = rootList.querySelector('.scrollpath-nav__item[data-level="1"]:last-of-type');

                    if (lastH1Item) {
                        let nestedList = lastH1Item.querySelector(':scope > .scrollpath-nav__list');
                        if (!nestedList) {
                            nestedList = document.createElement('ul');
                            nestedList.className = 'scrollpath-nav__list';
                            lastH1Item.appendChild(nestedList);
                        }
                        nestedList.appendChild(item);
                        parents[2] = nestedList;
                    } else {
                        rootList.appendChild(item);
                        parents[2] = rootList;
                    }
                    parents[3] = null;
                    parents[4] = null;
                    parents[5] = null;
                    parents[6] = null;
                } else {
                    // For levels 3-6, find parent at level-1
                    const parentLevel = level - 1;
                    let targetParent = parents[parentLevel];

                    if (targetParent) {
                        const lastParentItem = targetParent.querySelector(`.scrollpath-nav__item[data-level="${parentLevel}"]:last-of-type`) ||
                            targetParent.lastElementChild;

                        if (lastParentItem) {
                            let nestedList = lastParentItem.querySelector(':scope > .scrollpath-nav__list');
                            if (!nestedList) {
                                nestedList = document.createElement('ul');
                                nestedList.className = 'scrollpath-nav__list';
                                lastParentItem.appendChild(nestedList);
                            }
                            nestedList.appendChild(item);
                            parents[level] = nestedList;
                        } else {
                            targetParent.appendChild(item);
                        }
                    } else {
                        // No parent at expected level, append to root
                        rootList.appendChild(item);
                    }

                    // Clear child levels
                    for (let i = level + 1; i <= 6; i++) {
                        parents[i] = null;
                    }
                }

                lastLevel = level;
            });

            this.container.appendChild(rootList);

            // Build navItems array for path calculation
            const listItems = this.container.querySelectorAll('.scrollpath-nav__item');
            this.navItems = [...listItems].map((listItem) => {
                const anchor = listItem.querySelector('.scrollpath-nav__link');
                const targetID = anchor.getAttribute('href').slice(1);
                const target = document.getElementById(targetID);

                return { listItem, anchor, target };
            }).filter((item) => item.target);
        }


        setupSvgPath() {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'scrollpath-nav__svg');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', 'scrollpath-nav__path');

            svg.appendChild(path);
            this.container.appendChild(svg);

            this.navPath = path;
        }

        drawPath() {
            if (!this.navPath || this.navItems.length === 0) {
                return;
            }

            const pathData = [];
            let pathIndent;

            this.navItems.forEach((item, i) => {
                const x = item.anchor.offsetLeft - 5;
                const y = item.anchor.offsetTop;
                const height = item.anchor.offsetHeight;

                if (i === 0) {
                    pathData.push('M', x, y, 'L', x, y + height);
                    item.pathStart = 0;
                } else {
                    if (pathIndent !== x) {
                        pathData.push('L', pathIndent, y);
                    }

                    pathData.push('L', x, y);

                    this.navPath.setAttribute('d', pathData.join(' '));
                    item.pathStart = this.navPath.getTotalLength() || 0;
                    pathData.push('L', x, y + height);
                }

                pathIndent = x;
                this.navPath.setAttribute('d', pathData.join(' '));
                item.pathEnd = this.navPath.getTotalLength();
            });
        }

        syncPath() {
            if (!this.navPath) {
                return;
            }

            const someElsAreVisible = () => this.container.querySelectorAll(`.${this.visibleClass}`).length > 0;
            const thisElIsVisible = (el) => el.classList.contains(this.visibleClass);
            const pathLength = this.navPath.getTotalLength();

            let pathStart = pathLength;
            let pathEnd = 0;

            this.navItems.forEach((item) => {
                if (thisElIsVisible(item.listItem)) {
                    pathStart = Math.min(item.pathStart, pathStart);
                    pathEnd = Math.max(item.pathEnd, pathEnd);
                }
            });

            if (someElsAreVisible() && pathStart < pathEnd) {
                const dashArray = `1 ${pathStart} ${pathEnd - pathStart} ${pathLength}`;

                this.navPath.style.setProperty('stroke-dashoffset', '1');
                this.navPath.style.setProperty('stroke-dasharray', dashArray);
                this.navPath.style.setProperty('opacity', '1');
            } else {
                this.navPath.style.setProperty('opacity', '0');
            }
        }

        setupObserver(headings) {
            // Create a map of heading IDs to their corresponding sections
            const headingMap = new Map();
            headings.forEach((heading) => {
                headingMap.set(heading.id, heading);
            });

            // Create intersection observer
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    rootMargin: '-10% 0px -70% 0px', // Trigger when heading is in top 20-30% of viewport
                    threshold: 0,
                }
            );

            // Observe all headings
            headings.forEach((heading) => {
                this.observer.observe(heading);
            });
        }

        handleIntersection(entries) {
            entries.forEach((entry) => {
                const id = entry.target.getAttribute('id');
                const navItem = this.container.querySelector(`.scrollpath-nav__item[data-target="${id}"]`);

                if (!navItem) {
                    return;
                }

                if (entry.isIntersecting) {
                    navItem.classList.add(this.visibleClass);
                } else {
                    navItem.classList.remove(this.visibleClass);
                }
            });

            this.syncPath();
        }

        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    }

    // Export for potential external use
    window.ScrollPathNav = ScrollPathNav;
})();
