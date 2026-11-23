// Original drawings for the opening. Repeated shapes stay shared inside each SVG.
export const ivoryArtwork = `
<svg class="opening-ivory-art" viewBox="0 0 1332 388" preserveAspectRatio="none" aria-hidden="true" focusable="false">
  <defs>
    <pattern id="opening-ivory-tiles" width="244" height="130" patternUnits="userSpaceOnUse">
      <path d="M0 2h242v126H0zM7 8h230v112H7zM10 15h224v96H10z" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <path d="M10 112 120 16l112 96h-20l-91-79-90 79ZM12 18h84L14 94V74l65-54H65L14 63v-8l40-35H39L14 43ZM231 18h-83l82 76V74l-63-54h15l48 43v-8l-40-35h15l25 23Z" fill="currentColor"/>
      <path d="M11 124h222M30 108l90-79 93 79M46 108l74-63 76 63" fill="none" stroke="currentColor" stroke-width="3"/>
    </pattern>
    <pattern id="opening-ivory-braid" width="122" height="83" patternUnits="userSpaceOnUse">
      <path d="M0 2h122M0 79h122M-12 13l36 23 37-23 37 23 36-23M-12 26l36 23 37-23 37 23 36-23M-12 40l36 23 37-23 37 23 36-23" fill="none" stroke="currentColor" stroke-width="5"/>
      <path d="m10 70 14-9 14 9-14 7zm74 0 14-9 14 9-14 7z" fill="currentColor"/>
    </pattern>
    <radialGradient id="opening-ivory-veil">
      <stop offset=".27" stop-color="var(--opening-ivory)"/>
      <stop offset=".59" stop-color="var(--opening-ivory)" stop-opacity=".89"/>
      <stop offset="1" stop-color="var(--opening-ivory)" stop-opacity="0"/>
    </radialGradient>
    <g id="opening-arch-bay">
      <path d="M0 150V49Q28 8 56 49v101M7 150V53Q28 21 49 53v97M15 148V59q13-22 26 0v89M0 85h56m-56 12h56m-56 49h56M23 11v15h10V11zM4 154h48m-48 6h48M24 60v78m8-78v78"/>
      <path d="M3 109h12m26 0h12M3 120h12m26 0h12M3 131h12m26 0h12M17 77l11-8 11 8-11 8z"/>
    </g>
    <g id="opening-arch-pier">
      <path d="M0 0h25v9H0zM3 9h19v119H3zm-3 120h25v10H0zm-6 12h37v9H-6zM8 17v101m9-101v101M0 34h25M0 95h25"/>
      <path d="m6 45 7-8 7 8-7 8zm0 33 7-8 7 8-7 8z"/>
    </g>
  </defs>
  <g class="opening-ivory-pattern">
    <path d="M0 14h1332M0 28h1332M0 34h1332" stroke="currentColor" stroke-width="3" fill="none"/>
    <path d="M0 41h1332v111H0z" fill="url(#opening-ivory-tiles)"/>
    <path d="M0 151h1332v82H0zm0 90h1332v82H0z" fill="url(#opening-ivory-braid)"/>
    <path d="M0 325h1332v40H0z" fill="url(#opening-ivory-tiles)"/>
    <path d="M0 368h1332m0 8H0m0 9h1332" stroke="currentColor" stroke-width="3" fill="none"/>
  </g>
  <rect width="1332" height="388" fill="url(#opening-ivory-veil)"/>
  <g class="opening-arch" transform="translate(430 37)" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round">
    <path d="M14 280h445m-416-10h382m-361-16h342m-338-9h329M78 115h302v130H78zm-18-9h337v9H60zm-11-10h359v10H49zm28-11h303v11H77zM96 72h268v13H96zM126 54h209v18H126zM172 41h118v13H172zM211 20h41v21h-41zM221 9h22v11h-22zM92 131h276M92 150h276m-276 66h276"/>
    <path d="M191 248v-80q39-66 78 0v80m-70 0v-77q31-58 62 0v77m-48 0v-70q17-39 34 0v70M230 156v85M226 179h8m-11 12h14M97 81v-8m19 8v-8m19 8v-8m19 8v-8m19 8v-8m19 8v-8m19 8v-8m19 8v-8m19 8v-8m19 8v-8m19 8v-8m19 8v-8m19 8v-8m19 8v-8m19 8v-8"/>
    <use href="#opening-arch-bay" transform="translate(108 106) scale(.85 .87)"/>
    <use href="#opening-arch-bay" transform="translate(305 106) scale(.85 .87)"/>
    <use href="#opening-arch-pier" x="77" y="113"/><use href="#opening-arch-pier" x="161" y="113"/>
    <use href="#opening-arch-pier" x="276" y="113"/><use href="#opening-arch-pier" x="359" y="113"/>
    <path d="M47 281h343l56 9H14zm26 13h321l32 10H38zm30 15h284M155 321h194M197 335h111M18 239h55m312 0h68m-432-8h31m346 0h41"/>
  </g>
</svg>`

const flourishes = `
<defs>
  <path id="opening-flourish-leaf" d="M2 36C-1 21 3 8 18 2c-3 7-3 11 5 9-6 6-8 13-21 25Zm1-1c7-9 11-15 13-22"/>
  <g id="opening-flourish-half">
    <path d="M90 114C51 116 22 103 22 74c0-18 18-34 36-30 17 4 21 25 7 31-7 3-12-1-11-5 3 1 7 0 9-4 5-9-3-15-12-14-13 2-21 13-18 25 4 20 25 32 57 34Z"/>
    <path d="M32 70C37 44 61 37 69 25c6-9 2-19-9-21-11-2-19 7-17 16 2 5 7 8 11 5-6 0-8-7-3-11 5-5 13-1 13 6-2 12-20 14-29 26-6 7-8 15-8 23Z"/>
    <path d="M53 51C58 36 86 35 96 21c8-12 1-26-13-25-8 0-14 5-15 11 8-6 21-5 23 4 3 13-18 21-28 27ZM31 87C20 75 7 70 7 60c0-8 8-11 14-6-4-9-15-9-20-2-7 13 8 28 30 35Z"/>
    <path d="M82 114C68 101 58 84 67 73c5-7 16-7 20 0 3 5 0 11-4 11 2-6-5-9-9-3-4 10 2 22 8 33ZM47 101C22 100 12 89 15 80c-9 5-7 14 1 21 8 5 20 5 31 0Z"/>
    <use href="#opening-flourish-leaf" transform="translate(59 27) rotate(13) scale(.93)"/>
    <use href="#opening-flourish-leaf" transform="translate(31 46) rotate(-58) scale(.84)"/>
    <use href="#opening-flourish-leaf" transform="translate(14 55) rotate(-38) scale(.64)"/>
    <use href="#opening-flourish-leaf" transform="translate(85 32) rotate(23) scale(.69)"/>
    <use href="#opening-flourish-leaf" transform="translate(93 46) rotate(40) scale(.87)"/>
    <use href="#opening-flourish-leaf" transform="translate(103 61) rotate(54) scale(.88)"/>
    <use href="#opening-flourish-leaf" transform="translate(118 63) rotate(56) scale(.87)"/>
    <use href="#opening-flourish-leaf" transform="translate(135 71) rotate(71) scale(.83)"/>
    <path d="M91 108c13-25 42-39 69-23-16-4-26-3-38 4 13-5 25-3 35 2-24-3-42 6-56 18z"/>
    <path d="M79 86q18-8 27-27-2 16-10 24m9 12q15-13 33-14" fill="none" stroke="currentColor" stroke-width="2"/>
  </g>
  <path id="opening-flourish-petal" d="M0 1c-10-10-7-30 1-28 3 1 0 6 4 8 9 5 7 13-5 20Z"/>
  <g id="opening-flourish-flower" transform="translate(88 114)">
    ${Array.from({length:9},(_,i)=>`<use href="#opening-flourish-petal" transform="rotate(${i*40})"/>`).join('')}
    <path d="M-6 0a6 6 0 1 0 12 0A6 6 0 0 0-6 0z" fill="var(--opening-ivory)"/><circle r="3"/>
  </g>
  <g id="opening-flourish-shape">
    <use href="#opening-flourish-half"/>
    <use href="#opening-flourish-half" transform="translate(0 228) scale(1 -1)"/>
    <use href="#opening-flourish-flower"/>
    <use href="#opening-flourish-flower" transform="translate(-52 47) scale(.58)"/>
  </g>
</defs>`

export const sideFlourishes = `
<svg class="opening-flourish opening-flourish-left" viewBox="0 0 165 240" aria-hidden="true" focusable="false">
  ${flourishes}
  <use href="#opening-flourish-shape" y="6"/>
</svg>
<svg class="opening-flourish opening-flourish-right" viewBox="0 0 165 240" aria-hidden="true" focusable="false">
  <use href="#opening-flourish-shape" transform="translate(165 6) scale(-1 1)"/>
</svg>`

export const fleuron = `
<svg class="opening-fleuron" viewBox="0 0 54 43" aria-hidden="true" focusable="false">
  <path d="M27 0c-11 9-10 16-2 24-2-10-1-13 2-17 3 4 4 7 2 17 8-8 9-15-2-24ZM1 20c8-9 18-6 21 9-7-8-13-7-16-6l16 11C10 32 6 23 1 20Zm52 0c-8-9-18-6-21 9 7-8 13-7 16-6L32 34c12-2 16-11 21-14ZM27 31l4 6-4 5-4-5z" fill="currentColor"/>
  <path d="M12 11c5-3 10 5 11 13-4-6-8-9-11-9Zm30 0c-5-3-10 5-11 13 4-6 8-9 11-9Z" fill="currentColor" opacity=".65"/>
</svg>`

export const crimsonPattern = `
<svg class="opening-crimson-art" viewBox="0 0 1332 279" preserveAspectRatio="none" aria-hidden="true" focusable="false">
  <defs>
    <pattern id="opening-crimson-tiles" width="360" height="250" patternUnits="userSpaceOnUse">
      <path d="M0 0h358v248H0zM8 9h341v231H8zM8 73h341M8 143h341M8 185h341" stroke="currentColor" stroke-width="7" fill="none"/>
      <path d="M18 20h132v43H18zm10 9h112v24H28zm27 7h59v12H55zM213 20l29 23-29 22-30-22zM285 20l29 23-29 22-30-22zm-72 12-13 11 13 10 13-10zm72 0-13 11 13 10 13-10z" fill="currentColor" fill-rule="evenodd"/>
      <path d="M13 90l45 25 45-25 45 25 45-25 44 25 46-25 44 25 23-13M12 104l45 25 45-25 45 25 45-25 44 25 46-25 44 25 23-13m-338 1 45 25 45-25 45 25 45-25 44 25 46-25 44 25 23-13" fill="none" stroke="currentColor" stroke-width="5"/>
      <path d="M20 153h18v14h18v-14h18v14h18v-14h18v14h18v-14h18v14h18v-14h18v23H20zm181 0h18v14h18v-14h18v14h18v-14h18v14h18v-14h18v23H201z" fill="currentColor"/>
      <path d="m46 192 25 21-25 20-24-20zm68 0 25 21-25 20-24-20zm68 0 25 21-25 20-24-20zm68 0 25 21-25 20-24-20zm68 0 25 21-25 20-24-20z" fill="none" stroke="currentColor" stroke-width="6"/>
    </pattern>
  </defs>
  <rect width="1332" height="279" fill="url(#opening-crimson-tiles)"/>
</svg>`

const medallions = [[92,24,-37],[192,95,-29],[323,144,-16],[450,175,0],[577,144,16],[708,95,29],[808,24,37]]

export const mandala = `
<svg class="opening-mandala" viewBox="0 0 900 264" aria-hidden="true" focusable="false">
  <defs>
    <path id="opening-mandala-petal" d="M0 6C-27 53-35 97 0 152 35 97 27 53 0 6Zm0 20C-18 63-20 103 0 129 20 103 18 63 0 26ZM0 49q-18 42 0 68 18-26 0-68Z" fill="currentColor" fill-rule="evenodd"/>
    <path id="opening-mandala-spoke" d="M0 28C-10 49-14 105 0 149 14 105 10 49 0 28Zm0 12v72" fill="none" stroke="currentColor" stroke-width="2"/>
    <path id="opening-mandala-leaf" d="M0 0C-25 22-22 45 0 64 22 45 25 22 0 0ZM0 13q-16 20 0 39 16-19 0-39Z" fill="currentColor" fill-rule="evenodd"/>
    <g id="opening-mandala-medallion" fill="none" stroke="currentColor">
      <circle r="44" stroke-width="4"/><circle r="38" stroke-width="2.5"/><circle r="22" stroke-width="2"/><circle r="11" stroke-width="2"/>
      ${Array.from({length:12},(_,i)=>`<circle cy="30" r="2.3" fill="currentColor" transform="rotate(${i*30})"/>`).join('')}
      ${Array.from({length:6},(_,i)=>`<path d="M0 3q-16 3-9 14Q4 18 0 3Z" fill="currentColor" stroke="none" transform="rotate(${i*60})"/>`).join('')}
      <use href="#opening-mandala-leaf" transform="translate(0 40) scale(.60)"/>
      <use href="#opening-mandala-leaf" transform="translate(-25 34) rotate(37) scale(.53)"/>
      <use href="#opening-mandala-leaf" transform="translate(25 34) rotate(-37) scale(.53)"/>
    </g>
    <path id="opening-mandala-vine" d="M0 1c31 41 61 44 131 29 72-16 121-15 202 30 33 19 57 19 105 4M6 10c30 41 53 50 138 32 73-15 129-1 190 36 36 22 57 21 105 7M10 11q59 100 149 65 79-30 153 2M0 18q-7 88 74 135c22 11 55 18 93 8" fill="none" stroke="currentColor" stroke-width="3.4"/>
  </defs>
  <g transform="translate(450 -21)">
    <circle r="112" fill="none" stroke="currentColor" stroke-width="4"/>
    ${Array.from({length:12},(_,i)=>`<use href="#opening-mandala-petal" transform="rotate(${i*30})"/>`).join('')}
    ${Array.from({length:12},(_,i)=>`<use href="#opening-mandala-spoke" transform="rotate(${i*30+15}) scale(1.12)"/>`).join('')}
    <circle r="51" fill="none" stroke="currentColor" stroke-width="3"/>
  </g>
  <g transform="translate(450 0)">
    <use href="#opening-mandala-vine"/><use href="#opening-mandala-vine" transform="scale(-1 1)"/>
  </g>
  ${medallions.map(([x,y,r])=>`<use href="#opening-mandala-medallion" transform="translate(${x} ${y}) rotate(${r})"/>`).join('')}
  <use href="#opening-mandala-leaf" transform="translate(450 216) scale(.72)"/>
  <use href="#opening-mandala-leaf" transform="translate(52 23) rotate(53) scale(.86)"/>
  <use href="#opening-mandala-leaf" transform="translate(848 23) rotate(-53) scale(.86)"/>
</svg>`
