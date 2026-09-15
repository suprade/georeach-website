// ===== SUPABASE CONFIG =====
const SUPABASE_URL = "https://viezjjnpconukdqhpafz.supabase.co";
const SUPABASE_KEY = "sb_publishable_gWzbfvGfB6U2-VlPXY2pGw_mmIv7B--";

const SUPABASE_FUNCTION =
  `${SUPABASE_URL}/functions/v1/submit-lead`;

(function () {
  'use strict';
  const pages = ['home','build-with-ai','web-and-digital','mobile-apps','growth-marketing','industries','portfolio','case-studies','about-us','contact'];
  const labels = {
    'Explore AI Architecture':'build-with-ai','Explore Web Systems':'web-and-digital','Explore Growth Marketing':'growth-marketing','Explore Mobile Solutions':'mobile-apps','Explore Industry Expertise':'industries','View All Case Studies':'case-studies','Read Full Technical Architecture':'case-studies','Read E-Commerce Case Study':'case-studies','Read Automotive Case Study':'case-studies','Learn About Our Culture & Team':'about-us','Portfolio Showcase':'portfolio','Contact Us':'contact','About Us':'about-us','Case Studies':'case-studies','Build with AI Architecture':'build-with-ai','Web Design & Dev':'web-and-digital','Mobile Applications':'mobile-apps','Growth Marketing Engine':'growth-marketing','12 Core Industries':'industries'
  };
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  function getPage(){ const h=(location.hash||'').replace(/^#\/?/,''); return pages.includes(h)?h:'home'; }
  function showPage(page, updateHash=true){
    if(!pages.includes(page)) page='home';
    $$('.static-page').forEach(el=>{ el.hidden = el.dataset.page !== page; });
    $$('.georeach-nav-link').forEach(el=>el.classList.toggle('is-active', el.id === 'nav-link-'+page));
    $$('.georeach-mobile-link').forEach(el=>el.classList.toggle('is-active', el.dataset.page === page));
    if(updateHash && getPage()!==page) history.pushState({page},'', '#/'+page);
    window.scrollTo(0, 0);
    closeMobile();
    document.title = page==='home' ? 'GeoReach Technologies - AI-First Digital Agency' : 'GeoReach Technologies - '+page.replaceAll('-',' ');
  }
  function navigate(page){ showPage(page,true); }
  function navigateToCaseStudy(slug){
  document.activeElement?.blur();
  navigate('case-studies');
}
  function closeMobile(){ const o=$('#mobile-drawer-overlay'); if(o){o.hidden=true;} const t=$('#mobile-menu-toggle'); if(t){t.setAttribute('aria-expanded','false');} }
  function openMobile(){ const o=$('#mobile-drawer-overlay'); if(o){o.hidden=false;} const t=$('#mobile-menu-toggle'); if(t){t.setAttribute('aria-expanded','true');} }
  function openConsultation(){ const host=$('#consultation-modal-host'); if(!host) return; host.hidden=false; const b=$('#consultation-modal-backdrop'); if(b) b.hidden=false; document.body.style.overflow='hidden'; }
  function closeConsultation(){ const host=$('#consultation-modal-host'); if(!host) return; host.hidden=true; const b=$('#consultation-modal-backdrop'); if(b) b.hidden=true; document.body.style.overflow=''; }
  function wireHeader(){
    $('#brand-logo-btn')?.addEventListener('click',()=>navigate('home'));
    $$('.georeach-nav-link').forEach(b=>b.addEventListener('click',()=>navigate(b.id.replace('nav-link-',''))));
    $('#header-start-project-cta')?.addEventListener('click',()=>navigate('contact'));
    $('#mobile-menu-toggle')?.addEventListener('click',()=>{ const o=$('#mobile-drawer-overlay'); if(o?.hidden) openMobile(); else closeMobile(); });
    $$('.georeach-mobile-link').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.page)));
    $('#mobile-drawer-overlay')?.addEventListener('click',e=>{if(e.target.id==='mobile-drawer-overlay') closeMobile();});
    $('#mobile-drawer-panel')?.addEventListener('click',e=>e.stopPropagation());
    $('#mobile-strategy-btn')?.addEventListener('click',openConsultation);
    $('#floating-strategy-cta')?.addEventListener('click',openConsultation);
  }
  const idWiredElsewhere = ['brand-logo-btn','header-start-project-cta','mobile-menu-toggle','floating-strategy-cta','mobile-strategy-btn','hero-cta-start-project','hero-cta-explore-cases','card-book-strategy-btn','banner-book-free-consultation','portfolio-hero-cta','cta-ai-request-blueprint','cta-ai-view-cases','cta-ai-schedule-poc','cta-web-discuss','cta-web-cases','cta-web-read-case','cta-mobile-build','cta-mobile-view-case','cta-mobile-inspect-case','cta-growth-audit','cta-growth-vohra-case','cta-growth-claim','cta-industries-agri','cta-about-leadership','cta-about-office','cta-portfolio-book-review','cta-portfolio-direct-contact'];
  function wireTextNavigation(){
    $$('button').forEach(b=>{
      if(b.dataset.page || b.id?.startsWith('nav-link-') || idWiredElsewhere.includes(b.id)) return;
      const txt=b.textContent.replace(/\s+/g,' ').trim();
      const p=labels[txt]; if(p) b.addEventListener('click',()=>navigate(p));
      if(txt==='Home') b.addEventListener('click',()=>navigate('home'));
    });
  }
  function wireModal(){
  $('#modal-close-btn')?.addEventListener('click',closeConsultation);

  $('#consultation-modal-backdrop')?.addEventListener('click',e=>{
    if(e.target.id==='consultation-modal-backdrop') closeConsultation();
  });

  const form = $('#consultation-modal-dialog form');

  form?.addEventListener('submit', async e => {
    e.preventDefault();

    const inputs = form.querySelectorAll('input');
    const selects = form.querySelectorAll('select');

    const name = inputs[0]?.value.trim() || '';
    const contact = inputs[1]?.value.trim() || '';

    const service = selects[0]?.value || '';
    const slot = selects[1]?.value || '';

    const overview = form.querySelector('textarea')?.value.trim() || '';

    const email = contact.includes('@') ? contact : '';
    const phone = contact.includes('@') ? 'N/A' : contact;

    try {
      const response = await fetch(SUPABASE_FUNCTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          company: '',
          service,
          message:
            overview +
            `\n\nPreferred Strategy Session: ${slot}`,
          source_page: 'Strategy Session Booking'
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to submit booking');
      }

      form.outerHTML = `
        <div class="py-6 flex flex-col items-center text-center">
          <div class="w-16 h-16 rounded-2xl bg-[#eaedff] text-[#004ac6] flex items-center justify-center mb-4">
            <span class="text-3xl">✓</span>
          </div>

          <h3 class="font-headline text-2xl font-bold text-[#131b2e] mb-2">
            Session Confirmed!
          </h3>

          <p class="text-sm text-[#434655] max-w-sm mb-6">
            Thank you,
            <span class="font-bold text-[#131b2e]">
              ${escapeHtml(name)}
            </span>.
            We've received your strategy session request for
            <span class="font-semibold text-[#004ac6]">
              ${escapeHtml(slot)}
            </span>.
          </p>

          <div class="w-full p-4 rounded-2xl bg-[#f2f3ff] border border-[#dae2fd] text-left text-xs text-[#434655] flex flex-col gap-2 mb-6">
            <div>Our team will coordinate the session with your submitted contact.</div>
            <div>Direct Line: +91 7709692945 (Pune Hub)</div>
          </div>

          <button
            type="button"
            id="modal-done-btn"
            class="btn btn-primary font-btn px-6 py-2.5 text-sm"
          >
            Done &amp; Continue Browsing
          </button>
        </div>
      `;

      $('#modal-done-btn')?.addEventListener('click',closeConsultation);

    } catch (error) {
      console.error('Strategy booking Supabase error:', error);
      alert('Unable to submit your booking. Please try again.');
    }
  });
}
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
  function wireForms(){
    const quick = $('#quick-submit-btn')?.closest('form');

quick?.addEventListener('submit', async e => {
  e.preventDefault();

  const inputs = quick.querySelectorAll('input');
  const name = inputs[0]?.value.trim() || '';
  const contact = inputs[1]?.value.trim() || '';
  const service = quick.querySelector('select')?.value || '';

  const email = contact.includes('@') ? contact : '';
  const phone = contact.includes('@') ? 'N/A' : contact;

  try {
    const response = await fetch(SUPABASE_FUNCTION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY
      },
      body: JSON.stringify({
        name,
        phone,
        email,
        company: '',
        service,
        message: 'Quick Project Inquiry from Home Page',
        source_page: 'Home Page - Quick Project Inquiry'
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Unable to submit lead');
    }

    const box = quick.parentElement;

    box.innerHTML = `
      <div class="py-6 flex flex-col items-center text-center">
        <div class="w-12 h-12 rounded-full bg-[#eaedff] flex items-center justify-center text-[#004ac6] mb-3">
          <span class="text-2xl">✓</span>
        </div>

        <h4 class="font-headline text-base font-bold text-[#131b2e] mb-1">
          Inquiry Received!
        </h4>

        <p class="text-xs text-[#434655]">
          Thank you, ${escapeHtml(name)}. A GeoReach Solution Architect from our Pune office will review your requirements and reach out within 2 hours.
        </p>
      </div>
    `;

  } catch (error) {
    console.error('Quick inquiry Supabase error:', error);
    alert('Unable to submit your inquiry. Please try again.');
  }
});
    const contact=$('#contact-form-submit')?.closest('form');
contact?.addEventListener('submit',async e=>{e.preventDefault();
  const inputs = contact.querySelectorAll('input');

const name = inputs[0]?.value.trim() || '';
const company = inputs[1]?.value.trim() || '';
const email = inputs[2]?.value.trim() || '';
const phone = inputs[3]?.value.trim() || '';

const service = Array.from(
  contact.querySelectorAll('button[type="button"]')
)
  .filter(b => b.classList.contains('border-[#2563eb]'))
  .map(b => b.textContent.trim())
  .join(', ');

const budget = contact.querySelector('select')?.value || '';
const overview = contact.querySelector('textarea')?.value.trim() || '';

const message =
  overview +
  (budget ? `\n\nEstimated Project Budget: ${budget}` : '');

try {
  const response = await fetch(SUPABASE_FUNCTION, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY
    },
    body: JSON.stringify({
      name,
      phone,
      email,
      company,
      service,
      message,
      source_page: 'Contact Page'
    })
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Unable to submit lead');
  }

} catch (error) {
  console.error('Supabase submission error:', error);
  alert('Unable to submit your inquiry. Please try again.');
  return;
} const displayName = name; contact.outerHTML='<div class="py-12 flex flex-col items-center text-center"><div class="w-16 h-16 rounded-2xl bg-[#eaedff] text-[#004ac6] flex items-center justify-center mb-4"><span class="text-3xl">✓</span></div><h3 class="font-headline text-3xl font-bold text-[#131b2e] mb-2">Proposal Request Dispatched!</h3><p class="text-sm text-[#434655] max-w-md mb-6 leading-relaxed">Thank you, <span class="font-bold text-[#131b2e]">'+escapeHtml(displayName)+'</span>. Your project brief has been routed to our Lead Architecture Team at the Pune Innovation Hub.</p><div class="w-full max-w-sm p-4 rounded-2xl bg-[#f2f3ff] border border-[#dae2fd] text-xs text-[#434655] flex flex-col gap-2 mb-6 text-left"><div><b>Response Time Pledge:</b> Under 2 Hours (Business Days)</div><div><b>Direct Lead Phone:</b> +91 7709692945</div><div><b>Email:</b> '+escapeHtml(email)+'</div></div></div>';});

  }
  function wireIndustries(){
  const page = $('#page-industries');
  if (!page) return;

  const search = page.querySelector('input[type="search"], input[placeholder*="Search"], input');
  if (!search) return;

  const cards = $$('[class*="cursor-pointer"]', page)
    .filter(el => el.querySelector('h3'));

  search.addEventListener('input', function(){
    const query = this.value.trim().toLowerCase();

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();

      card.style.display =
        !query || text.includes(query)
          ? ''
          : 'none';
    });
  });
}
  function wirePortfolio(){
  const page = $('#page-portfolio');
  if (!page) return;

  const input = page.querySelector('input[type="search"]') || page.querySelector('input');
  const cards = $$('[id^="portfolio-card-"]', page);

  const filterButtons = $$('button', page).filter(b =>
    ['All Clients','AI & Automation','Web & Commerce','Mobile','Enterprise']
      .some(x => b.textContent.includes(x))
  );

  /* ---------- VIEW CASE STUDIES BUTTON ---------- */

  const viewCaseStudies = $$('button', page).find(
    b => b.textContent.trim().includes('View Case Studies')
  );

  viewCaseStudies?.addEventListener('click', () => {
    navigate('case-studies');
  });

  /* ---------- PORTFOLIO FILTER ---------- */

  let cat = 'all';

  function apply(){
    const q = (input?.value || '').toLowerCase();

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();

      let ok = !q || text.includes(q);

      if(cat !== 'all'){
        ok = ok && (
          cat === 'enterprise' ||
          text.includes(cat)
        );
      }

      card.style.display = ok ? '' : 'none';
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {

      const text = button.textContent.toLowerCase();

      cat =
        text.includes('ai') ? 'ai' :
        text.includes('web') ? 'web' :
        text.includes('mobile') ? 'mobile' :
        text.includes('enterprise') ? 'enterprise' :
        'all';

      filterButtons.forEach(x => {
        x.classList.remove(
          'bg-[#2563eb]',
          'text-white'
        );
      });

      button.classList.add(
        'bg-[#2563eb]',
        'text-white'
      );

      apply();
    });
  });

  input?.addEventListener('input', apply);
}
  function wireGrowthCalculator(){
  const page = $('#page-growth-marketing');
  if (!page) return;

  const ranges = page.querySelectorAll('input[type="range"]');
  if (ranges.length < 2) return;

  const trafficRange = ranges[0];
  const rateRange = ranges[1];

  const trafficValue = trafficRange.parentElement.querySelector(
    '.flex.justify-between.items-center span:last-child'
  );

  const rateValue = rateRange.parentElement.querySelector(
    '.flex.justify-between.items-center span:last-child'
  );

  const forecastCards = page.querySelectorAll(
    '.lg\\:col-span-6.grid.grid-cols-2 > div'
  );

  const forecastVisitors = forecastCards[0]?.querySelector(
    '.font-headline'
  );

  const forecastInquiries = forecastCards[1]?.querySelector(
    '.font-headline'
  );

  const upliftText = forecastCards[0]?.querySelector(
    '.text-\\[11px\\]'
  );

  const qualifiedLeadsText = forecastCards[1]?.querySelector(
    '.text-\\[11px\\]'
  );

  function update(){

    const traffic = Number(trafficRange.value);
    const rate = Number(rateRange.value);

    const projected = Math.round(traffic * 1.6);
    const current = Math.round(traffic * rate / 100);
    const leads = Math.round(projected * (rate * 1.35) / 100);
    const uplift = leads - current;

    if (trafficValue) {
      trafficValue.textContent = traffic.toLocaleString();
    }

    if (rateValue) {
      rateValue.textContent = rate.toFixed(1) + '%';
    }

    if (forecastVisitors) {
      forecastVisitors.textContent = projected.toLocaleString();
    }

    if (forecastInquiries) {
      forecastInquiries.textContent = leads.toLocaleString();
    }

    if (upliftText) {
      upliftText.textContent = '+60% Average Uplift';
    }

    if (qualifiedLeadsText) {
      qualifiedLeadsText.textContent =
        '+' + uplift.toLocaleString() + ' Net Qualified Leads';
    }
  }

  trafficRange.addEventListener('input', update);
  rateRange.addEventListener('input', update);

  update();
}
  function wireOrchestrator(){
    const scene=$('.georeach-universe'); if(!scene) return;
    const move=e=>{const r=scene.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5; scene.style.setProperty('--rx',(y*-2.5).toFixed(2)+'deg');scene.style.setProperty('--ry',(x*2.5).toFixed(2)+'deg');scene.style.setProperty('--mx',(x*100+50)+'%');scene.style.setProperty('--my',(y*100+50)+'%');};
    scene.addEventListener('pointermove',move);scene.addEventListener('pointerleave',()=>{scene.style.setProperty('--rx','0deg');scene.style.setProperty('--ry','0deg');});
  }
  function wireScroll(){ const b=$('#scroll-top-btn'); window.addEventListener('scroll',()=>{if(b)b.hidden=window.scrollY<=400;},{passive:true}); b?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'})); }
  function wireExtraCTAs(){
    const actions = {
      'hero-cta-start-project':()=>navigate('contact'),
      'hero-cta-explore-cases':()=>navigate('case-studies'),
      'card-book-strategy-btn':openConsultation,
      'banner-book-free-consultation':openConsultation,
      'portfolio-hero-cta':()=>navigate('contact'),
      'cta-ai-request-blueprint':()=>navigate('contact'),
      'cta-ai-view-cases':()=>navigate('case-studies'),
      'cta-ai-schedule-poc':openConsultation,
      'cta-web-discuss':()=>navigate('contact'),
      'cta-web-cases':()=>navigate('case-studies'),
      'cta-web-read-case':()=>navigateToCaseStudy('case-study-furniture-long-island'),
      'cta-mobile-build':()=>navigate('contact'),
      'cta-mobile-view-case':()=>navigateToCaseStudy('case-study-kisaansathi'),
      'cta-mobile-inspect-case':()=>navigateToCaseStudy('case-study-kisaansathi'),
      'cta-growth-audit':()=>navigate('contact'),
      'cta-growth-vohra-case':()=>navigateToCaseStudy('case-study-vohra-auto'),
      'cta-growth-claim':()=>navigate('contact'),
      'cta-industries-agri':()=>navigate('contact'),
      'cta-about-leadership':()=>navigate('contact'),
      'cta-about-office':()=>navigate('contact'),
      'cta-portfolio-book-review':openConsultation,
      'cta-portfolio-direct-contact':()=>navigate('contact')
    };
    Object.keys(actions).forEach(id=>{ $('#'+id)?.addEventListener('click', actions[id]); });
  }
  function wirePortfolioCardCTAs(){
    const caseMap = {
      'portfolio-card-kisaansathi':'case-study-kisaansathi',
      'portfolio-card-furniture-long-island':'case-study-furniture-long-island',
      'portfolio-card-vohra-auto':'case-study-vohra-auto'
    };
    $$('[id^="portfolio-card-"]').forEach(card=>{
      const slug = caseMap[card.id] || null;
      $$('button', card).forEach(b=>{
        const txt = b.textContent.replace(/\s+/g,' ').trim();
        if(txt.startsWith('Deep Dive')) b.addEventListener('click', ()=>navigateToCaseStudy(slug));
        if(txt.startsWith('Build This')) b.addEventListener('click', ()=>navigate('contact'));
      });
    });
  }
  function wireCaseStudies(){
    const page=$('#page-case-studies'); if(!page) return;
    const cards=$$('[id^="case-study-"]',page);
    const chipMap={'all':null,'agritech':'agritech','e-commerce':'e-commerce','automotive':'automobile','healthcare':'healthcare','real estate':'real estate','fintech':'fintech'};
    const chips=$$('button',page).filter(b=>Object.prototype.hasOwnProperty.call(chipMap, b.textContent.trim().toLowerCase()));
    chips.forEach(b=>b.addEventListener('click',()=>{
      const key=b.textContent.trim().toLowerCase();
      const needle=chipMap[key];
      chips.forEach(x=>x.classList.remove('bg-[#2563eb]','text-white'));
      b.classList.add('bg-[#2563eb]','text-white');
      cards.forEach(c=>{ c.style.display=(!needle || c.textContent.toLowerCase().includes(needle))?'':'none'; });
    }));
    $$('button',page).forEach(b=>{
      if(b.textContent.replace(/\s+/g,' ').trim()==='Request Similar Architecture') b.addEventListener('click',()=>navigate('contact'));
    });
  }
  function wireShareButton(){
    const btn = document.querySelector('button[aria-label="Share"]');
    btn?.addEventListener('click', async ()=>{
      const shareData = { title: document.title, url: location.href };
      if(navigator.share){ try{ await navigator.share(shareData); }catch(e){} }
      else if(navigator.clipboard){ try{ await navigator.clipboard.writeText(location.href); }catch(e){} }
    });
  }
  function wireEscapeKey(){
    document.addEventListener('keydown', e=>{
      if(e.key!=='Escape') return;
      const host=$('#consultation-modal-host');
      if(host && !host.hidden){ closeConsultation(); return; }
      const overlay=$('#mobile-drawer-overlay');
      if(overlay && !overlay.hidden){ closeMobile(); }
    });
  }
  window.addEventListener('hashchange',()=>showPage(getPage(),false)); window.addEventListener('popstate',()=>showPage(getPage(),false));
  wireHeader();wireTextNavigation();wireModal();wireForms();wireIndustries();wirePortfolio();wireGrowthCalculator();wireOrchestrator();wireScroll();wireExtraCTAs();wirePortfolioCardCTAs();wireCaseStudies();wireShareButton();wireEscapeKey();showPage(getPage(),false);
})();

/* ---------- CONTACT PAGE — SERVICE SELECTION ---------- */

document.addEventListener("DOMContentLoaded", function () {
  const serviceButtons = document.querySelectorAll(
    '#page-contact label + div button[type="button"]'
  );

  serviceButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const isSelected = button.classList.contains("border-[#2563eb]");

      const checkCircle = button.querySelector("span:last-child");

      if (isSelected) {
        // Deselect
        button.classList.remove(
          "bg-[#eaedff]",
          "text-[#004ac6]",
          "border-[#2563eb]"
        );

        button.classList.add(
          "bg-[#f2f3ff]",
          "text-[#434655]",
          "border-[#dae2fd]/60"
        );

        if (checkCircle) {
          checkCircle.classList.remove(
            "bg-[#2563eb]",
            "text-white"
          );

          checkCircle.classList.add(
            "bg-[#dae2fd]",
            "text-transparent"
          );
        }
      } else {
        // Select
        button.classList.remove(
          "bg-[#f2f3ff]",
          "text-[#434655]",
          "border-[#dae2fd]/60"
        );

        button.classList.add(
          "bg-[#eaedff]",
          "text-[#004ac6]",
          "border-[#2563eb]"
        );

        if (checkCircle) {
          checkCircle.classList.remove(
            "bg-[#dae2fd]",
            "text-transparent"
          );

          checkCircle.classList.add(
            "bg-[#2563eb]",
            "text-white"
          );
        }
      }
    });
  });
});

/* ---------- HERO AI CORE BUTTON ---------- */

document.addEventListener("click", function (event) {
  const aiCore = event.target.closest(".gw-core");

  if (!aiCore) return;

  window.location.hash = "#/build-with-ai";
});

/* ---------- AI ARCHITECTURE BUTTON REDIRECTS ---------- */

document.addEventListener("click", function (event) {
  const button = event.target.closest(
    '#page-build-with-ai .rounded-3xl .flex.flex-wrap.gap-2 button'
  );

  if (!button) return;

  window.location.hash = "#/contact";
});

