/* =============================================================
   script.js  -  Personal Webpage interactivity
   Author : Samhitha Kondeti
   Adds : 1) Smooth scroll for nav links
          2) Dark mode toggle (saved across reloads)
          3) Typing animation for the page title
          4) Show / hide sections (collapsible H2 headers)
   ============================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------- 1. SMOOTH SCROLL ----------
       Any <a href="#section-id"> link will scroll smoothly
       instead of jumping.  Works for the nav bar that the
       script auto-injects below. */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId.length <= 1) return;             // ignore plain "#"
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    /* ---------- 2. AUTO-INJECT A TOP NAV BAR ----------
       Builds nav links from every <section id="..."> on the
       page so the smooth-scroll has something to click. */
    const sections = document.querySelectorAll("section[id]");
    if (sections.length > 0) {
        const nav = document.createElement("nav");
        nav.className = "site-nav";

        sections.forEach(sec => {
            const heading = sec.querySelector("h2");
            if (!heading) return;
            const link = document.createElement("a");
            link.href = "#" + sec.id;
            link.textContent = heading.textContent.trim();
            nav.appendChild(link);
        });

        // Insert nav as the very first child of the page-container
        const container = document.querySelector(".page-container");
        if (container) container.insertBefore(nav, container.firstChild);

        // Re-apply smooth-scroll listeners to the freshly injected links
        nav.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener("click", function (e) {
                const target = document.querySelector(this.getAttribute("href"));
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });
    }

    /* ---------- 3. DARK MODE TOGGLE ----------
       Floating button in the top-right corner.  Saves the
       user's choice to localStorage so it survives reloads. */
    const themeBtn = document.createElement("button");
    themeBtn.id = "theme-toggle";
    themeBtn.setAttribute("aria-label", "Toggle dark mode");
    themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeBtn);

    // Restore saved preference
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        themeBtn.innerHTML = isDark
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    /* ---------- 4. TYPING ANIMATION ----------
       Re-types the <h1> name letter by letter on first load. */
    const h1 = document.querySelector("h1");
    if (h1) {
        const fullText = h1.textContent;
        h1.textContent = "";
        h1.classList.add("typing-cursor");
        let i = 0;
        const typeSpeed = 80;             // ms per character
        const typeChar = () => {
            if (i < fullText.length) {
                h1.textContent += fullText.charAt(i);
                i++;
                setTimeout(typeChar, typeSpeed);
            } else {
                // Stop the blinking cursor 2 seconds after typing completes
                setTimeout(() => h1.classList.remove("typing-cursor"), 2000);
            }
        };
        typeChar();
    }

    /* ---------- 5. SHOW / HIDE SECTIONS ----------
       Each <h2> inside a <section> becomes a clickable header.
       Clicking it collapses or expands the rest of the section.
       A small chevron icon shows the current state. */
    sections.forEach(sec => {
        const heading = sec.querySelector("h2");
        if (!heading) return;

        // Wrap everything except the heading in a single div we can hide
        const wrapper = document.createElement("div");
        wrapper.className = "section-content";

        // Move all siblings of the heading into the wrapper
        const siblings = [];
        let next = heading.nextSibling;
        while (next) {
            siblings.push(next);
            next = next.nextSibling;
        }
        siblings.forEach(node => wrapper.appendChild(node));
        sec.appendChild(wrapper);

        // Add chevron icon to the heading
        const chevron = document.createElement("i");
        chevron.className = "fas fa-chevron-down section-chevron";
        heading.appendChild(chevron);
        heading.classList.add("collapsible");

        heading.addEventListener("click", () => {
            const isHidden = wrapper.classList.toggle("collapsed");
            chevron.classList.toggle("rotated", isHidden);
        });
    });

});
// updated Fri Apr 24 22:36:51 CDT 2026
