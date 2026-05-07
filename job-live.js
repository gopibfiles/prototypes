(function () {
  const candidates = [
    {
      name: "Sophia",
      active: "Last active 5 hours ago",
      currentTitle: "Staff Nurse",
      desiredTitle: "Nurse Assessor",
      location: "Camden, London",
      eligibility: "Eligible to work in UK",
      skills: ["Clinical Assessment", "WCA"],
    },
    {
      name: "James",
      active: "Last active 1 day ago",
      currentTitle: "Mental Health Nurse",
      desiredTitle: "Nurse Assessor",
      location: "Islington, London",
      eligibility: "Eligible to work in UK",
      skills: ["Patient Care", "Assessment", "PIP"],
    },
    {
      name: "Amara",
      active: "Last active 3 hours ago",
      currentTitle: "Community Nurse",
      desiredTitle: "Nurse Assessor",
      location: "Holborn, London",
      eligibility: "Eligible to work in UK",
      skills: ["Triage", "Reports", "WCA"],
    },
    {
      name: "Daniel",
      active: "Last active 2 days ago",
      currentTitle: "Registered Nurse",
      desiredTitle: "Nurse Assessor",
      location: "Shoreditch, London",
      eligibility: "Eligible to work in UK",
      skills: ["Clinical Assessment", "Documentation"],
    },
  ];

  const xCloseSvg =
    '<svg width="13" height="13" viewBox="0 0 13.150 13.150" fill="none" aria-hidden="true">' +
    '<path fill="currentColor" fill-rule="nonzero" d="M 6.575 7.975 L 1.675 12.875 C 1.492 13.058 1.258 13.15 0.975 13.15 C 0.692 13.15 0.458 13.058 0.275 12.875 C 0.092 12.692 0 12.458 0 12.175 C 0 11.892 0.092 11.658 0.275 11.475 L 5.175 6.575 L 0.275 1.675 C 0.092 1.492 0 1.258 0 0.975 C 0 0.692 0.092 0.458 0.275 0.275 C 0.458 0.092 0.692 0 0.975 0 C 1.258 0 1.492 0.092 1.675 0.275 L 6.575 5.175 L 11.475 0.275 C 11.658 0.092 11.892 0 12.175 0 C 12.458 0 12.692 0.092 12.875 0.275 C 13.058 0.458 13.15 0.692 13.15 0.975 C 13.15 1.258 13.058 1.492 12.875 1.675 L 7.975 6.575 L 12.875 11.475 C 13.058 11.658 13.15 11.892 13.15 12.175 C 13.15 12.458 13.058 12.692 12.875 12.875 C 12.692 13.058 12.458 13.15 12.175 13.15 C 11.892 13.15 11.658 13.058 11.475 12.875 L 6.575 7.975 Z"/>' +
    '</svg>';

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function cardHtml(c) {
    return (
      '<article class="candidate-card">' +
        '<div class="cc-top">' +
          '<div>' +
            '<div class="cc-name">' + escapeHtml(c.name) + '</div>' +
            '<div class="cc-active">' + escapeHtml(c.active) + '</div>' +
          '</div>' +
          '<div class="cc-actions">' +
            '<button class="btn-view-cc" type="button" data-candidate="' + escapeHtml(c.name) + '">View</button>' +
            '<button class="btn-icon-cc" type="button" aria-label="Mark as unsuitable">' + xCloseSvg + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="cc-divider"></div>' +
        '<div class="cc-fields">' +
          '<div><div class="cc-field-label">Current job title</div><div class="cc-field-value">' + escapeHtml(c.currentTitle) + '</div></div>' +
          '<div><div class="cc-field-label">Desired job title</div><div class="cc-field-value">' + escapeHtml(c.desiredTitle) + '</div></div>' +
          '<div><div class="cc-field-label">Location</div><div class="cc-field-value">' + escapeHtml(c.location) + '</div></div>' +
          '<div><div class="cc-field-label">Work eligibility</div><div class="cc-field-value">' + escapeHtml(c.eligibility) + '</div></div>' +
        '</div>' +
        '<div>' +
          '<div class="cc-skills-label">Matching skills</div>' +
          '<div class="cc-chips">' +
            c.skills.map(function (s) { return '<span class="cc-chip">' + escapeHtml(s) + '</span>'; }).join('') +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  const carousel = document.getElementById('carousel');
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  track.innerHTML = candidates.map(cardHtml).join('');

  const STEP = 416 + 24; // card width + gap

  function updateButtons() {
    const max = carousel.scrollWidth - carousel.clientWidth;
    prevBtn.disabled = carousel.scrollLeft <= 1;
    nextBtn.disabled = carousel.scrollLeft >= max - 1;
  }

  prevBtn.addEventListener('click', function () {
    carousel.scrollBy({ left: -STEP, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', function () {
    carousel.scrollBy({ left: STEP, behavior: 'smooth' });
  });

  carousel.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);

  // Convert vertical wheel input to horizontal scroll when hovered
  carousel.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      carousel.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('keydown', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowRight') carousel.scrollBy({ left: STEP, behavior: 'smooth' });
    else if (e.key === 'ArrowLeft') carousel.scrollBy({ left: -STEP, behavior: 'smooth' });
  });

  // Clicking "View" on a card → go to Application Management with the
  // candidate name in the query string. The Application Management page
  // reads ?candidate=<name> and auto-opens the modal after 500ms.
  track.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-view-cc');
    if (!btn) return;
    const name = btn.getAttribute('data-candidate') || '';
    window.location.href = 'Application Management.html?candidate=' + encodeURIComponent(name);
  });

  updateButtons();
})();
