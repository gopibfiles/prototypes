(function () {
  const candidates = [
    {
      name: "Sophia",
      active: "Last active 5 hours ago",
      currentTitle: "Care Worker",
      desiredTitle: "Senior Care Worker",
      location: "Camden, London",
      eligibility: "Eligible to work in UK",
      skills: ["Personal Care", "Medication Admin"],
    },
    {
      name: "James",
      active: "Last active 1 day ago",
      currentTitle: "Senior Care Assistant",
      desiredTitle: "Senior Care Worker",
      location: "Islington, London",
      eligibility: "Eligible to work in UK",
      skills: ["Personal Care", "Care Planning", "Manual Handling"],
    },
    {
      name: "Amara",
      active: "Last active 3 hours ago",
      currentTitle: "Home Care Worker",
      desiredTitle: "Senior Care Worker",
      location: "Holborn, London",
      eligibility: "Eligible to work in UK",
      skills: ["First Aid", "Care Planning", "Medication Admin"],
    },
    {
      name: "Daniel",
      active: "Last active 2 days ago",
      currentTitle: "Support Worker",
      desiredTitle: "Senior Care Worker",
      location: "Shoreditch, London",
      eligibility: "Eligible to work in UK",
      skills: ["Personal Care", "Record Keeping"],
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

  // Read persisted state from Application Management. Invited or
  // marked-unsuitable candidates are excluded from the carousel.
  function loadPersist() {
    try { return JSON.parse(localStorage.getItem('jt-candidate-state-v1')) || { invited: [], unsuitable: [] }; }
    catch (e) { return { invited: [], unsuitable: [] }; }
  }
  function visibleCandidates() {
    const s = loadPersist();
    const hide = new Set([...(s.invited || []), ...(s.unsuitable || [])]);
    return candidates.filter(c => !hide.has(c.name));
  }

  track.innerHTML = visibleCandidates().map(cardHtml).join('');

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

  // Clicking "View" on a card → open the candidate modal in a fullscreen
  // iframe overlay sourced from Application Management.html (chromeless
  // mode hides the host page so only the modal shows).
  track.addEventListener('click', function (e) {
    const viewBtn = e.target.closest('.btn-view-cc');
    if (viewBtn) {
      const name = viewBtn.getAttribute('data-candidate') || '';
      openCandidateOverlay(name);
      return;
    }
    const xBtn = e.target.closest('.btn-icon-cc');
    if (xBtn) {
      const card = xBtn.closest('.candidate-card');
      const nameEl = card && card.querySelector('.cc-name');
      const name = nameEl ? nameEl.textContent.trim() : '';
      markUnsuitable(name);
      return;
    }
  });

  function markUnsuitable(name) {
    if (!name) return;
    // Persist + remove from carousel immediately
    try {
      const raw = localStorage.getItem('jt-candidate-state-v1');
      const s = raw ? JSON.parse(raw) : { invited: [], unsuitable: [] };
      if (!s.unsuitable.includes(name)) s.unsuitable.push(name);
      s.invited = (s.invited || []).filter(n => n !== name);
      localStorage.setItem('jt-candidate-state-v1', JSON.stringify(s));
    } catch (e) {}
    removeCardByName(name);
    // Show the same toast + improve modal via a hidden chromeless iframe
    // running ?action=unsuitable on Application Management.
    openCandidateOverlay(name, 'unsuitable');
  }

  function openCandidateOverlay(name, action) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;inset:0;z-index:9999;';
    const iframe = document.createElement('iframe');
    let url = 'Application Management.html?candidate=' + encodeURIComponent(name) + '&chromeless=1';
    if (action) url += '&action=' + encodeURIComponent(action);
    iframe.src = url;
    iframe.style.cssText = 'width:100%;height:100%;border:0;background:transparent;';
    iframe.setAttribute('allowtransparency', 'true');
    wrap.appendChild(iframe);
    document.body.appendChild(wrap);
    document.body.style.overflow = 'hidden';

    function onMsg(ev) {
      if (!ev || !ev.data) return;
      if (ev.data.type === 'closeCandidateModal') {
        window.removeEventListener('message', onMsg);
        wrap.remove();
        document.body.style.overflow = '';
      } else if (ev.data.type === 'candidateInvited' && ev.data.name) {
        removeCardByName(ev.data.name);
      } else if (ev.data.type === 'candidateUnsuitable' && ev.data.name) {
        removeCardByName(ev.data.name);
      }
    }
    window.addEventListener('message', onMsg);
  }

  function removeCardByName(name) {
    const cards = track.querySelectorAll('.candidate-card');
    cards.forEach(card => {
      const n = card.querySelector('.cc-name');
      if (n && n.textContent.trim() === name.trim()) {
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.94)';
        setTimeout(() => { card.remove(); updateButtons(); }, 260);
      }
    });
  }

  updateButtons();
})();
