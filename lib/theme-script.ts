import { DEFAULT_PALETTE, PALETTES } from './palettes';

const IDS = JSON.stringify(PALETTES.map((p) => p.id));

// Corre antes de pintar: evita el flash de tema/paleta equivocados. Oscuro por defecto.
// La paleta guardada solo se respeta con el lab activo (?lab): los visitantes ven la publicada.
export const THEME_SCRIPT = `try{var d=document.documentElement,s=localStorage,t=s.getItem('theme');d.dataset.theme=t==='light'?'light':'dark';var q=/[?&]lab\\b/.test(location.search);if(q)s.setItem('lab','1');var lab=s.getItem('lab')==='1',p=s.getItem('palette');d.dataset.palette=lab&&${IDS}.indexOf(p)>-1?p:'${DEFAULT_PALETTE}';if(lab)d.dataset.lab=''}catch(e){document.documentElement.dataset.theme='dark'}`;
