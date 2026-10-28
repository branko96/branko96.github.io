// Corre antes de pintar: evita el flash de tema equivocado. Oscuro por defecto.
export const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}`;
