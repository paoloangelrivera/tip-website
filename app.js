const translations = {
  es: {
    'nav.home':'Inicio','nav.about':'Nosotros','nav.portfolio':'Portafolio','nav.why':'Por qué AT.ip','nav.clients':'Clientes','nav.contact':'Contacto',
    'buttons.contact':'Conversemos ↗','buttons.learn':'Conoce más ↓',
    'hero.eyebrow':'TECNOLOGÍA SIN LÍMITES','hero.title':'Tecnología que conecta la <em>estrategia</em> con la <em>ejecución</em>.','hero.description':'Un socio tecnológico para transformar, modernizar y operar tu negocio.',
    'about.eyebrow':'NOSOTROS','about.title':'SOMOS AT.ip','about.lead':'Un integrador tecnológico peruano con alcance regional, que combina experiencia, capacidades y las mejores soluciones del mercado.','metrics.experience':'años de experiencia','metrics.clients':'clientes','metrics.solutions':'soluciones','about.p1':'Nacimos de la combinación de capacidades especializadas para construir una oferta tecnológica más completa, sólida y enfocada en el cliente.','about.p2':'Como socios peruanos, entendemos el mercado local y combinamos esa cercanía con tecnología, talento y aliados de clase mundial.','about.statement':'Integramos tecnología. Conectamos capacidades. Creamos impacto.',
    'portfolio.eyebrow':'NUESTRO PORTAFOLIO','portfolio.lead':'Capacidades integradas para acompañar a nuestros clientes desde la estrategia hasta la operación.',
    'portfolio.consulting.title':'CONSULTORÍA','portfolio.consulting.body':'Estrategia digital<br>Arquitectura empresarial<br>Transformación<br>Tecnología para operaciones','portfolio.data.title':'DATOS E IA','portfolio.data.body':'Plataformas de datos<br>Analítica<br>IA generativa y agéntica','portfolio.cloud.title':'CLOUD','portfolio.cloud.body':'Transformación cloud<br>Modernización<br>Cloud gestionado','portfolio.security.title':'CIBERSEGURIDAD','portfolio.security.body':'Identidad y acceso<br>Operaciones de seguridad<br>Riesgo y cumplimiento','portfolio.apps.title':'APLICACIONES','portfolio.apps.body':'ERP / CRM<br>Aplicaciones de negocio<br>Integración y modernización<br>Nómina y Recursos Humanos','portfolio.infrastructure.title':'INFRAESTRUCTURA','portfolio.infrastructure.body':'Redes<br>Espacio de trabajo digital<br>Servicios gestionados',
    'why.eyebrow':'POR QUÉ AT.ip','why.lead':'Cercanía, experiencia y capacidad de ejecución.','why.understand.title':'ENTENDER','why.understand.body':'Entendemos el negocio, la industria y el desafío.','why.design.title':'DISEÑAR','why.design.body':'Diseñamos una solución pragmática, escalable y medible.','why.execute.title':'EJECUTAR','why.execute.body':'Ejecutamos con especialistas y aliados líderes.','why.operate.title':'OPERAR','why.operate.body':'Acompañamos la operación y evolucionamos continuamente la plataforma.',
    'commitment.eyebrow':'NUESTRO COMPROMISO','commitment.title':'Innovar.<br>Optimizar.<br>Transformar.','commitment.body':'Un solo socio para convertir la tecnología en impacto para el negocio.','clients.eyebrow':'NUESTROS CLIENTES','clients.lead':'Construimos relaciones de largo plazo basadas en resultados.','contact.banner':'Conversemos sobre cómo la tecnología puede crear valor para tu negocio.','footer':'© 2026 AT.ip. Todos los derechos reservados.'
  },
  en: {
    'nav.home':'Home','nav.about':'About Us','nav.portfolio':'Portfolio','nav.why':'Why AT.ip','nav.clients':'Clients','nav.contact':'Contact',
    'buttons.contact':'Get in touch ↗','buttons.learn':'Learn more ↓',
    'hero.eyebrow':'TECHNOLOGY WITHOUT LIMITS','hero.title':'Technology that connects <em>strategy</em> with <em>execution</em>.','hero.description':'A technology partner to transform, modernize, and operate your business.',
    'about.eyebrow':'ABOUT US','about.title':'WE ARE AT.ip','about.lead':'A Peruvian technology integrator with regional reach, combining experience, capabilities, and the best solutions in the market.','metrics.experience':'years of experience','metrics.clients':'clients','metrics.solutions':'solutions','about.p1':'We were born from the combination of specialized capabilities to build a more complete, solid, and client-focused technology offering.','about.p2':'As a Peruvian partner, we understand the local market and combine that proximity with technology, talent, and world-class partners.','about.statement':'We integrate technology. We connect capabilities. We create impact.',
    'portfolio.eyebrow':'OUR PORTFOLIO','portfolio.lead':'Integrated capabilities to support our clients from strategy through operations.','portfolio.consulting.title':'CONSULTING','portfolio.consulting.body':'Digital strategy<br>Enterprise architecture<br>Transformation<br>Operations technology','portfolio.data.title':'DATA & AI','portfolio.data.body':'Data platforms<br>Analytics<br>Generative and agentic AI','portfolio.cloud.title':'CLOUD','portfolio.cloud.body':'Cloud transformation<br>Modernization<br>Managed cloud','portfolio.security.title':'CYBERSECURITY','portfolio.security.body':'Identity and access<br>Security operations<br>Risk and compliance','portfolio.apps.title':'APPLICATIONS','portfolio.apps.body':'ERP / CRM<br>Business applications<br>Integration and modernization<br>Payroll and Human Resources','portfolio.infrastructure.title':'INFRASTRUCTURE','portfolio.infrastructure.body':'Networks<br>Digital workplace<br>Managed services',
    'why.eyebrow':'WHY AT.ip','why.lead':'Proximity, experience, and execution capability.','why.understand.title':'UNDERSTAND','why.understand.body':'We understand the business, the industry, and the challenge.','why.design.title':'DESIGN','why.design.body':'We design a pragmatic, scalable, and measurable solution.','why.execute.title':'EXECUTE','why.execute.body':'We execute with specialists and leading partners.','why.operate.title':'OPERATE','why.operate.body':'We support operations and continuously evolve the platform.',
    'commitment.eyebrow':'OUR COMMITMENT','commitment.title':'Innovate.<br>Optimize.<br>Transform.','commitment.body':'One partner to turn technology into business impact.','clients.eyebrow':'OUR CLIENTS','clients.lead':'We build long-term relationships based on results.','contact.banner':'Let’s talk about how technology can create value for your business.','footer':'© 2026 AT.ip. All rights reserved.'
  }
};

const toggle = document.getElementById('languageToggle');
let currentLanguage = localStorage.getItem('atip-language') || 'es';

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[language][key] !== undefined) element.innerHTML = translations[language][key];
  });
  toggle.textContent = language === 'es' ? 'EN' : 'ES';
  toggle.setAttribute('aria-label', language === 'es' ? 'Switch to English' : 'Cambiar a español');
  localStorage.setItem('atip-language', language);
}

toggle.addEventListener('click', () => setLanguage(currentLanguage === 'es' ? 'en' : 'es'));
setLanguage(currentLanguage);
