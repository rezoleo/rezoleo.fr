// ===== Utilities =====
    const $ = (sel, ctx=document) => ctx.querySelector(sel);
    const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

    // Year footer
    $('#year').textContent = new Date().getFullYear();

    // Smooth scroll (native behavior with small offset)
    $$('a.nav-link, .cta a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if(!id.startsWith('#')) return;
        e.preventDefault();
        const target = $(id);
        const y = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });

    // Intersection Observer for reveal animations
    const obs = new IntersectionObserver((entries)=>{
      for(const e of entries){ if(e.isIntersecting){ e.target.classList.add('revealed'); obs.unobserve(e.target);} }
    },{ threshold:.18 });
    $$('.reveal').forEach(el=>obs.observe(el));

    const links = $$('.nav a.nav-link');
    const sections = links.map(l => ({ link:l, el: $(l.getAttribute('href')) }));

    function setActive(link){
      links.forEach(l=>l.classList.remove('active'));
      link.classList.add('active');
    }

    const spy = () => {
      let current = sections[0].link;
      for(const s of sections){
        const top = s.el.getBoundingClientRect().top;
        if(top <= 120) current = s.link;
      }
      setActive(current);
    };
    window.addEventListener('scroll', spy, { passive:true });
    window.addEventListener('resize', spy);
    window.addEventListener('load', spy);

    // Parallax background effect on hero
    const gridBg = $('.hero .grid-bg');
    window.addEventListener('mousemove', (e)=>{
      const x = (e.clientX / window.innerWidth - .5) * 10;
      const y = (e.clientY / window.innerHeight - .5) * 10;
      gridBg.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Hover tilt on feature cards
    $$('.feature').forEach(card => {
      let raf;
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const cx = e.clientX - r.left; const cy = e.clientY - r.top;
        const rx = (cy / r.height - .5) * -8; // rotateX
        const ry = (cx / r.width - .5) * 8;   // rotateY
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(()=>{
          card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        });
      };
      const reset = ()=>{ card.style.transform = ''; };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', reset);
    });

    // Helper: Easily set placeholder background images via data attribute
    // Example: document.getElementById('media-who').style.backgroundImage = "url('images/image_groupe_glitch.jpg')"
