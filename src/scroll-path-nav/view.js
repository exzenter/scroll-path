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
            // Find all h2, h3, h4 headings
            const allHeadings = document.querySelectorAll('h2, h3, h4');

            // Filter out headings inside the scroll path nav itself
            return [...allHeadings].filter((heading) => {
                return !heading.closest('.scrollpath-nav') &&
                    !heading.closest('.scrollpath-nav-editor');
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
                2: rootList,
                3: null,
                4: null,
            };

            let lastLevel = 2;

            headings.forEach((heading) => {
                const level = parseInt(heading.tagName.charAt(1), 10);
                const item = document.createElement('li');
                item.className = 'scrollpath-nav__item';
                item.setAttribute('data-level', level);
                item.setAttribute('data-target', heading.id);

                const link = document.createElement('a');
                link.className = 'scrollpath-nav__link';
                link.href = `#${heading.id}`;
                link.textContent = heading.textContent;

                item.appendChild(link);

                // Determine where to append this item
                if (level === 2) {
                    // Top level - always append to root
                    rootList.appendChild(item);
                    parents[2] = rootList;
                    parents[3] = null;
                    parents[4] = null;
                } else if (level === 3) {
                    // Find or create a nested list under the last h2
                    const lastH2Item = rootList.querySelector('.scrollpath-nav__item[data-level="2"]:last-of-type') ||
                        rootList.lastElementChild;

                    if (lastH2Item) {
                        let nestedList = lastH2Item.querySelector(':scope > .scrollpath-nav__list');
                        if (!nestedList) {
                            nestedList = document.createElement('ul');
                            nestedList.className = 'scrollpath-nav__list';
                            lastH2Item.appendChild(nestedList);
                        }
                        nestedList.appendChild(item);
                        parents[3] = nestedList;
                        parents[4] = null;
                    } else {
                        rootList.appendChild(item);
                    }
                } else if (level === 4) {
                    // Find or create a nested list under the last h3
                    let targetParent = parents[3];

                    if (targetParent) {
                        const lastH3Item = targetParent.querySelector('.scrollpath-nav__item[data-level="3"]:last-of-type') ||
                            targetParent.lastElementChild;

                        if (lastH3Item) {
                            let nestedList = lastH3Item.querySelector(':scope > .scrollpath-nav__list');
                            if (!nestedList) {
                                nestedList = document.createElement('ul');
                                nestedList.className = 'scrollpath-nav__list';
                                lastH3Item.appendChild(nestedList);
                            }
                            nestedList.appendChild(item);
                            parents[4] = nestedList;
                        } else {
                            targetParent.appendChild(item);
                        }
                    } else {
                        // No h3 parent, append to root or last h2
                        const lastItem = rootList.lastElementChild;
                        if (lastItem) {
                            let nestedList = lastItem.querySelector(':scope > .scrollpath-nav__list');
                            if (!nestedList) {
                                nestedList = document.createElement('ul');
                                nestedList.className = 'scrollpath-nav__list';
                                lastItem.appendChild(nestedList);
                            }
                            nestedList.appendChild(item);
                        } else {
                            rootList.appendChild(item);
                        }
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
