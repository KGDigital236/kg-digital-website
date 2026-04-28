  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));

  // Smooth nav active
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id');
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current
        ? 'rgba(240,244,255,1)'
        : '';
    });
  });

  // Form submit
  document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('.form-submit');
    btn.textContent = 'SENDING...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    try {
      const res = await fetch('https://formspree.io/f/xlganenn', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(this)
      });
      if (res.ok) {
        this.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      } else {
        btn.textContent = 'SEND FAILED — TRY AGAIN';
        btn.disabled = false;
        btn.style.opacity = '1';
      }
    } catch {
      btn.textContent = 'SEND FAILED — TRY AGAIN';
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  });

  // Count up numbers
  function countUp(el, target, suffix) {
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.floor(start) + suffix;
    }, 16);
  }

  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-num');
        nums[0].textContent = '48h';
        nums[1].textContent = '100%';
        nums[2].textContent = '24/7';
        statsObs.unobserve(entry.target);
      }
    });
  });

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) statsObs.observe(statsStrip);

  // Team card flip
  function flipCard(name) {
    const card = document.getElementById('card-' + name);
    card.classList.toggle('flipped');
    // Pulse cursor ring when flipping
    if (ring) {
      ring.style.transform = 'translate(-50%,-50%) scale(2)';
      ring.style.borderColor = 'rgba(59,130,246,0.9)';
      setTimeout(() => {
        ring.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.borderColor = 'rgba(96,165,250,0.5)';
      }, 400);
    }
  }

  // Make flipCard globally accessible
  window.flipCard = flipCard;

  // Re-apply cursor hover listeners to dynamically added elements
  document.querySelectorAll('.team-card, .contact-link-item, .value-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)';
      ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
      ring.style.borderColor = 'rgba(96,165,250,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = 'rgba(96,165,250,0.5)';
    });
  });

  // Cookie consent
  function closeCookie(choice) {
    localStorage.setItem('kg_cookie_consent', choice);
    document.getElementById('cookie-banner').style.transform = 'translateY(100%)';
  }

  // Save granular cookie preferences from settings modal
  function saveCookiePrefs(forceChoice) {
    const analytics = document.getElementById('analytics-toggle');
    const functional = document.getElementById('functional-toggle');
    let choice;
    if (forceChoice === 'reject') {
      choice = 'reject';
      if (analytics) analytics.checked = false;
      if (functional) functional.checked = false;
    } else {
      const hasOptional = (analytics && analytics.checked) || (functional && functional.checked);
      choice = hasOptional ? 'accept' : 'reject';
    }
    localStorage.setItem('kg_cookie_consent', choice);
    if (analytics) localStorage.setItem('kg_cookie_analytics', analytics ? analytics.checked : false);
    if (functional) localStorage.setItem('kg_cookie_functional', functional ? functional.checked : false);
    document.getElementById('cookie-banner').style.transform = 'translateY(100%)';
    closeModal('cookie-settings');
  }
  window.saveCookiePrefs = saveCookiePrefs;
  function openModal(name) {
    document.getElementById('modal-' + name).classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(name) {
    document.getElementById('modal-' + name).classList.remove('open');
    document.body.style.overflow = '';
  }
  window.openModal = openModal;
  window.closeModal = closeModal;

  // Close modal on backdrop click
  document.querySelectorAll('.legal-modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) closeModal(this.id.replace('modal-',''));
    });
  });

  // Show cookie banner if no consent yet
  setTimeout(() => {
    if (!localStorage.getItem('kg_cookie_consent')) {
      document.getElementById('cookie-banner').classList.add('visible');
    }
  }, 1200);

  // Copy nav logo src into hero background + why section (avoids duplicating base64 data)
  const navLogoImg = document.getElementById('nav-logo-img');
  const heroLogoBg = document.getElementById('hero-logo-bg');
  const whyLogoBg  = document.getElementById('why-logo-bg');
  if (navLogoImg && heroLogoBg) {
    heroLogoBg.src = navLogoImg.src;
  }
  if (navLogoImg && whyLogoBg) {
    whyLogoBg.src = navLogoImg.src;
  }

  // Hero canvas rings animation
  (function(){
    var hc=document.getElementById('hero-canvas');
    if(!hc)return;
    var ctx=hc.getContext('2d'),hs=document.getElementById('hero');
    var W,H,floats=[];
    function initF(){floats=Array.from({length:18},function(){return{x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+0.5,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,alpha:Math.random()*0.5+0.2};});}
    function resize(){W=hc.width=hs.offsetWidth;H=hc.height=hs.offsetHeight;initF();}
    resize();window.addEventListener('resize',resize);
    var rings=Array.from({length:5},function(_,i){return{r:60+i*55,speed:(i%2===0?1:-1)*(0.12-i*0.018),angle:i*1.2,nodes:5+i*2,dash:[6+i*2,8+i*3]};});
    function drawRing(ring){
      var cx=W/2,cy=H/2;
      ctx.save();ctx.translate(cx,cy);ctx.rotate(ring.angle);
      ctx.setLineDash(ring.dash);ctx.strokeStyle='rgba(79,158,255,'+(0.12-ring.nodes*0.005)+')';ctx.lineWidth=0.8;
      ctx.beginPath();ctx.arc(0,0,ring.r,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
      for(var i=0;i<ring.nodes;i++){
        var a=(i/ring.nodes)*Math.PI*2,nx=Math.cos(a)*ring.r,ny=Math.sin(a)*ring.r;
        ctx.beginPath();ctx.arc(nx,ny,2,0,Math.PI*2);ctx.fillStyle='rgba(79,158,255,'+(0.5-ring.nodes*0.03)+')';
        ctx.shadowBlur=8;ctx.shadowColor='#4f9eff';ctx.fill();ctx.shadowBlur=0;
        ctx.beginPath();ctx.moveTo(nx,ny);ctx.lineTo(0,0);ctx.strokeStyle='rgba(79,158,255,0.04)';ctx.lineWidth=0.5;ctx.stroke();
      }
      ctx.restore();
    }
    function loop(){
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#050810';ctx.fillRect(0,0,W,H);
      floats.forEach(function(p){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(79,158,255,'+p.alpha+')';ctx.fill();});
      rings.forEach(function(r){r.angle+=r.speed*0.008;drawRing(r);});
      var grd=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,220);grd.addColorStop(0,'rgba(79,158,255,0.06)');grd.addColorStop(1,'transparent');ctx.fillStyle=grd;ctx.fillRect(0,0,W,H);
      requestAnimationFrame(loop);
    }
    loop();
  })();
  // Mobile hamburger nav
  (function(){
    var btn=document.getElementById('navHamburger'),menu=document.getElementById('navLinks');
    if(!btn||!menu)return;
    btn.addEventListener('click',function(){
      var open=menu.classList.toggle('nav-open');
      btn.classList.toggle('is-open',open);
      btn.setAttribute('aria-expanded',String(open));
    });
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('nav-open');btn.classList.remove('is-open');btn.setAttribute('aria-expanded','false');});});
  })();
