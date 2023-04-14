import { PlatformType } from 'src/game-source/types';

type PlatformMapping = Partial<
  Record<PlatformType, { id: number; name: string }>
>;

export const PLATFORMS: PlatformMapping = {
  '1292-programmable': {
    id: 253,
    name: '1292 Advanced Programmable Video System',
  },
  '3do': { id: 35, name: '3DO' },
  'apf-mp1000': { id: 213, name: 'APF MP1000/Imagination Machine' },
  'acorn-32-bit': { id: 117, name: 'Acorn 32-bit' },
  av: { id: 210, name: 'Adventure Vision' },
  air: { id: 305, name: 'AirConsole' },
  alice: { id: 194, name: 'Alice 32/90' },
  altair680: { id: 265, name: 'Altair 680' },
  altair8800: { id: 222, name: 'Altair 8800' },
  alexa: { id: 237, name: 'Amazon Alexa' },
  amiga: { id: 19, name: 'Amiga' },
  'amiga-cd32': { id: 56, name: 'Amiga CD32' },
  cpc: { id: 60, name: 'Amstrad CPC' },
  'amstrad-pcw': { id: 136, name: 'Amstrad PCW' },
  android: { id: 91, name: 'Android' },
  antstream: { id: 286, name: 'Antstream' },
  apple1: { id: 245, name: 'Apple I' },
  apple2: { id: 31, name: 'Apple II' },
  apple2gs: { id: 51, name: 'Apple IIgs' },
  arcade: { id: 143, name: 'Arcade' },
  arcadia2001: { id: 162, name: 'Arcadia 2001' },
  Arduboy: { id: 215, name: 'Arduboy' },
  astral2000: { id: 241, name: 'Astral 2000' },
  'atari-2600': { id: 28, name: 'Atari 2600' },
  'atari-5200': { id: 33, name: 'Atari 5200' },
  'atari-7800': { id: 34, name: 'Atari 7800' },
  'atari-8-bit': { id: 39, name: 'Atari 8-bit' },
  'atari-st': { id: 24, name: 'Atari ST' },
  Atom: { id: 129, name: 'Atom' },
  'BBC Micro': { id: 92, name: 'BBC Micro' },
  brew: { id: 63, name: 'BREW' },
  'Bally Astrocade': { id: 160, name: 'Bally Astrocade' },
  BeOS: { id: 165, name: 'BeOS' },
  blackberry: { id: 90, name: 'BlackBerry' },
  Blacknut: { id: 290, name: 'Blacknut' },
  'Blu-ray Disc Player': { id: 168, name: 'Blu-ray Disc Player' },
  Browser: { id: 84, name: 'Browser' },
  Bubble: { id: 231, name: 'Bubble' },
  'cd-i': { id: 73, name: 'CD-i' },
  CDTV: { id: 83, name: 'CDTV' },
  COSMAC: { id: 216, name: 'COSMAC' },
  'CP/M': { id: 261, name: 'CP/M' },
  'Camputers Lynx': { id: 154, name: 'Camputers Lynx' },
  'Casio Loopy': { id: 124, name: 'Casio Loopy' },
  'Casio PV-1000': { id: 125, name: 'Casio PV-1000' },
  'Casio Programmable Calculator': {
    id: 306,
    name: 'Casio Programmable Calculator',
  },
  'Champion 2711': { id: 298, name: 'Champion 2711' },
  'Channel F': { id: 76, name: 'Channel F' },
  ClickStart: { id: 188, name: 'ClickStart' },
  'Coleco Adam': { id: 156, name: 'Coleco Adam' },
  colecovision: { id: 29, name: 'ColecoVision' },
  'Colour Genie': { id: 197, name: 'Colour Genie' },
  'Commodore 128': { id: 61, name: 'Commodore 128' },
  'commodore-16-plus4': { id: 115, name: 'Commodore 16, Plus/4' },
  c64: { id: 27, name: 'Commodore 64' },
  pet: { id: 77, name: 'Commodore PET/CBM' },
  'Compal 80': { id: 277, name: 'Compal 80' },
  'Compucolor I': { id: 243, name: 'Compucolor I' },
  'Compucolor II': { id: 198, name: 'Compucolor II' },
  Compucorp: {
    id: 238,
    name: 'Compucorp Programmable Calculator',
  },
  CreatiVision: { id: 212, name: 'CreatiVision' },
  Cybervision: { id: 301, name: 'Cybervision' },
  dos: { id: 2, name: 'DOS' },
  'dvd-player': { id: 166, name: 'DVD Player' },
  'Danger OS': { id: 285, name: 'Danger OS' },
  'dedicated-console': { id: 204, name: 'Dedicated console' },
  'dedicated-handheld': { id: 205, name: 'Dedicated handheld' },
  Didj: { id: 184, name: 'Didj' },
  doja: { id: 72, name: 'DoJa' },
  'dragon-3264': { id: 79, name: 'Dragon 32/64' },
  dreamcast: { id: 8, name: 'Dreamcast' },
  'ECD Micromind': { id: 269, name: 'ECD Micromind' },
  electron: { id: 93, name: 'Electron' },
  Enterprise: { id: 161, name: 'Enterprise' },
  'Epoch Cassette Vision': { id: 137, name: 'Epoch Cassette Vision' },
  'Epoch Game Pocket Computer': { id: 139, name: 'Epoch Game Pocket Computer' },
  'Epoch Super Cassette Vision': {
    id: 138,
    name: 'Epoch Super Cassette Vision',
  },
  Evercade: { id: 284, name: 'Evercade' },
  ExEn: { id: 70, name: 'ExEn' },
  Exelvision: { id: 195, name: 'Exelvision' },
  'Exidy Sorcerer': { id: 176, name: 'Exidy Sorcerer' },
  fmtowns: { id: 102, name: 'FM Towns' },
  'fm-7': { id: 126, name: 'FM-7' },
  'Fire OS': { id: 159, name: 'Fire OS' },
  Freebox: { id: 268, name: 'Freebox' },
  'G-cluster': { id: 302, name: 'G-cluster' },
  GIMINI: { id: 251, name: 'GIMINI' },
  GNEX: { id: 258, name: 'GNEX' },
  GP2X: { id: 122, name: 'GP2X' },
  'GP2X Wiz': { id: 123, name: 'GP2X Wiz' },
  GP32: { id: 108, name: 'GP32' },
  GVM: { id: 257, name: 'GVM' },
  Galaksija: { id: 236, name: 'Galaksija' },
  gameboy: { id: 10, name: 'Game Boy' },
  'gameboy-advance': { id: 12, name: 'Game Boy Advance' },
  'gameboy-color': { id: 11, name: 'Game Boy Color' },
  'game-gear': { id: 25, name: 'Game Gear' },
  'Game Wave': { id: 104, name: 'Game Wave' },
  'Game.Com': { id: 50, name: 'Game.Com' },
  gamecube: { id: 14, name: 'GameCube' },
  GameStick: { id: 155, name: 'GameStick' },
  genesis: { id: 16, name: 'Genesis' },
  Gizmondo: { id: 55, name: 'Gizmondo' },
  Gloud: { id: 292, name: 'Gloud' },
  Glulx: { id: 172, name: 'Glulx' },
  'HD DVD Player': { id: 167, name: 'HD DVD Player' },
  'HP 9800': { id: 219, name: 'HP 9800' },
  'HP Programmable Calculator': { id: 234, name: 'HP Programmable Calculator' },
  'Heath/Zenith H8/H89': { id: 262, name: 'Heath/Zenith H8/H89' },
  'Heathkit H11': { id: 248, name: 'Heathkit H11' },
  'Hitachi S1': { id: 274, name: 'Hitachi S1' },
  Hugo: { id: 170, name: 'Hugo' },
  HyperScan: { id: 192, name: 'HyperScan' },
  'IBM 5100': { id: 250, name: 'IBM 5100' },
  'Ideal-Computer': { id: 252, name: 'Ideal-Computer' },
  'Intel 8008': { id: 224, name: 'Intel 8008' },
  'Intel 8080': { id: 225, name: 'Intel 8080' },
  intellivision: { id: 30, name: 'Intellivision' },
  'Interact Model One': { id: 295, name: 'Interact Model One' },
  'Interton Video 2000': { id: 221, name: 'Interton Video 2000' },
  j2me: { id: 64, name: 'J2ME' },
  Jaguar: { id: 17, name: 'Jaguar' },
  Jolt: { id: 247, name: 'Jolt' },
  'Jupiter Ace': { id: 153, name: 'Jupiter Ace' },
  'KIM-1': { id: 226, name: 'KIM-1' },
  'Kindle Classic': { id: 145, name: 'Kindle Classic' },
  'Laser 200': { id: 264, name: 'Laser 200' },
  LaserActive: { id: 163, name: 'LaserActive' },
  'LeapFrog Explorer': { id: 185, name: 'LeapFrog Explorer' },
  LeapTV: { id: 186, name: 'LeapTV' },
  Leapster: { id: 183, name: 'Leapster' },
  linux: { id: 1, name: 'Linux' },
  Luna: { id: 297, name: 'Luna' },
  Lynx: { id: 18, name: 'Lynx' },
  'MOS Technology 6502': { id: 240, name: 'MOS Technology 6502' },
  MRE: { id: 229, name: 'MRE' },
  msx: { id: 57, name: 'MSX' },
  macintosh: { id: 74, name: 'Macintosh' },
  Maemo: { id: 157, name: 'Maemo' },
  mainframe: { id: 208, name: 'Mainframe' },
  'Matsushita/Panasonic JR': { id: 307, name: 'Matsushita/Panasonic JR' },
  'Mattel Aquarius': { id: 135, name: 'Mattel Aquarius' },
  MeeGo: { id: 158, name: 'MeeGo' },
  'Memotech MTX': { id: 148, name: 'Memotech MTX' },
  Meritum: { id: 311, name: 'Meritum' },
  Microbee: { id: 200, name: 'Microbee' },
  'Microtan 65': { id: 232, name: 'Microtan 65' },
  Microvision: { id: 97, name: 'Microvision' },
  Mophun: { id: 71, name: 'Mophun' },
  'Motorola 6800': { id: 235, name: 'Motorola 6800' },
  'Motorola 68k': { id: 275, name: 'Motorola 68k' },
  'N-Gage': { id: 32, name: 'N-Gage' },
  'N-Gage (service)': { id: 89, name: 'N-Gage (service)' },
  nes: { id: 22, name: 'NES' },
  Nascom: { id: 175, name: 'Nascom' },
  'Neo Geo': { id: 36, name: 'Neo Geo' },
  'Neo Geo CD': { id: 54, name: 'Neo Geo CD' },
  'Neo Geo Pocket': { id: 52, name: 'Neo Geo Pocket' },
  'Neo Geo Pocket Color': { id: 53, name: 'Neo Geo Pocket Color' },
  'Neo Geo X': { id: 279, name: 'Neo Geo X' },
  'new-nintendo-3ds': { id: 174, name: 'New Nintendo 3DS' },
  NewBrain: { id: 177, name: 'NewBrain' },
  Newton: { id: 207, name: 'Newton' },
  '3ds': { id: 101, name: 'Nintendo 3DS' },
  n64: { id: 9, name: 'Nintendo 64' },
  'nintendo-ds': { id: 44, name: 'Nintendo DS' },
  'nintendo-dsi': { id: 87, name: 'Nintendo DSi' },
  switch: { id: 203, name: 'Nintendo Switch' },
  'North Star': { id: 266, name: 'North Star' },
  'Noval 760': { id: 244, name: 'Noval 760' },
  Nuon: { id: 116, name: 'Nuon' },
  OOParts: { id: 300, name: 'OOParts' },
  'OS/2': { id: 146, name: 'OS/2' },
  'oculus-go': { id: 218, name: 'Oculus Go' },
  'oculus-quest': { id: 271, name: 'Oculus Quest' },
  Odyssey: { id: 75, name: 'Odyssey' },
  'Odyssey 2': { id: 78, name: 'Odyssey 2' },
  'Ohio Scientific': { id: 178, name: 'Ohio Scientific' },
  onlive: { id: 282, name: 'OnLive' },
  Orao: { id: 270, name: 'Orao' },
  Oric: { id: 111, name: 'Oric' },
  ouya: { id: 144, name: 'Ouya' },
  'pc-booter': { id: 4, name: 'PC Booter' },
  'PC-6001': { id: 149, name: 'PC-6001' },
  'PC-8000': { id: 201, name: 'PC-8000' },
  pc88: { id: 94, name: 'PC-88' },
  pc98: { id: 95, name: 'PC-98' },
  'PC-FX': { id: 59, name: 'PC-FX' },
  'ps-vita': { id: 105, name: 'PS Vita' },
  psp: { id: 46, name: 'PSP' },
  palmos: { id: 65, name: 'Palm OS' },
  Pandora: { id: 308, name: 'Pandora' },
  Pebble: { id: 304, name: 'Pebble' },
  'Philips VG 5000': { id: 133, name: 'Philips VG 5000' },
  'Photo CD': { id: 272, name: 'Photo CD' },
  Pippin: { id: 112, name: 'Pippin' },
  psx: { id: 6, name: 'PlayStation' },
  ps2: { id: 7, name: 'PlayStation 2' },
  ps3: { id: 81, name: 'PlayStation 3' },
  ps4: { id: 141, name: 'PlayStation 4' },
  ps5: { id: 288, name: 'PlayStation 5' },
  'PlayStation Now': { id: 294, name: 'PlayStation Now' },
  Playdate: { id: 303, name: 'Playdate' },
  Playdia: { id: 107, name: 'Playdia' },
  'Plex Arcade': { id: 291, name: 'Plex Arcade' },
  Pokitto: { id: 230, name: 'Pokitto' },
  'Pokémon Mini': { id: 152, name: 'Pokémon Mini' },
  'Poly-88': { id: 249, name: 'Poly-88' },
  'RCA Studio II': { id: 113, name: 'RCA Studio II' },
  'Research Machines 380Z': { id: 309, name: 'Research Machines 380Z' },
  Roku: { id: 196, name: 'Roku' },
  'SAM Coupé': { id: 120, name: 'SAM Coupé' },
  'SC/MP': { id: 255, name: 'SC/MP' },
  'SD-200/270/290': { id: 267, name: 'SD-200/270/290' },
  'sega-32x': { id: 21, name: 'SEGA 32X' },
  'sega-cd': { id: 20, name: 'SEGA CD' },
  'sega-master-system': { id: 26, name: 'SEGA Master System' },
  'SEGA Pico': { id: 103, name: 'SEGA Pico' },
  'sega-saturn': { id: 23, name: 'SEGA Saturn' },
  'SG-1000': { id: 114, name: 'SG-1000' },
  'SK-VM': { id: 259, name: 'SK-VM' },
  'SMC-777': { id: 273, name: 'SMC-777' },
  SNES: { id: 15, name: 'SNES' },
  'SRI-500/1000': { id: 242, name: 'SRI-500/1000' },
  'SWTPC 6800': { id: 228, name: 'SWTPC 6800' },
  'Sharp MZ-80B/2000/2500': { id: 182, name: 'Sharp MZ-80B/2000/2500' },
  'Sharp MZ-80K/700/800/1500': { id: 181, name: 'Sharp MZ-80K/700/800/1500' },
  'sharp-x1': { id: 121, name: 'Sharp X1' },
  'sharp-x68000': { id: 106, name: 'Sharp X68000' },
  'Sharp Zaurus': { id: 202, name: 'Sharp Zaurus' },
  'Signetics 2650': { id: 278, name: 'Signetics 2650' },
  'Sinclair QL': { id: 131, name: 'Sinclair QL' },
  Socrates: { id: 190, name: 'Socrates' },
  'sol-20': { id: 199, name: 'Sol-20' },
  'Sord M5': { id: 134, name: 'Sord M5' },
  Spectravideo: { id: 85, name: 'Spectravideo' },
  stadia: { id: 281, name: 'Stadia' },
  "Super A'can": { id: 110, name: "Super A'can" },
  'Super Vision 8000': { id: 296, name: 'Super Vision 8000' },
  SuperGrafx: { id: 127, name: 'SuperGrafx' },
  Supervision: { id: 109, name: 'Supervision' },
  'Sure Shot HD': { id: 287, name: 'Sure Shot HD' },
  symbian: { id: 67, name: 'Symbian' },
  TADS: { id: 171, name: 'TADS' },
  'TI Programmable Calculator': { id: 239, name: 'TI Programmable Calculator' },
  'ti-994a': { id: 47, name: 'TI-99/4A' },
  TIM: { id: 246, name: 'TIM' },
  'trs-80': { id: 58, name: 'TRS-80' },
  'trs-80-coco': { id: 62, name: 'TRS-80 CoCo' },
  'TRS-80 MC-10': { id: 193, name: 'TRS-80 MC-10' },
  'TRS-80 Model 100': { id: 312, name: 'TRS-80 Model 100' },
  'Taito X-55': { id: 283, name: 'Taito X-55' },
  'Tatung Einstein': { id: 150, name: 'Tatung Einstein' },
  'Tektronix 4050': { id: 223, name: 'Tektronix 4050' },
  'Tele-Spiel ES-2201': { id: 220, name: 'Tele-Spiel ES-2201' },
  'Telstar Arcade': { id: 233, name: 'Telstar Arcade' },
  Terminal: { id: 209, name: 'Terminal' },
  'Thomson MO': { id: 147, name: 'Thomson MO' },
  'Thomson TO': { id: 130, name: 'Thomson TO' },
  'Tiki 100': { id: 263, name: 'Tiki 100' },
  'Timex Sinclair 2068': { id: 173, name: 'Timex Sinclair 2068' },
  Tizen: { id: 206, name: 'Tizen' },
  'Tomahawk F1': { id: 256, name: 'Tomahawk F1' },
  'Tomy Tutor': { id: 151, name: 'Tomy Tutor' },
  Triton: { id: 310, name: 'Triton' },
  'turbografx-cd': { id: 45, name: 'TurboGrafx CD' },
  'turbo-grafx': { id: 40, name: 'TurboGrafx-16' },
  'V.Flash': { id: 189, name: 'V.Flash' },
  'V.Smile': { id: 42, name: 'V.Smile' },
  'vic-20': { id: 43, name: 'VIC-20' },
  VIS: { id: 164, name: 'VIS' },
  Vectrex: { id: 37, name: 'Vectrex' },
  Versatile: { id: 299, name: 'Versatile' },
  VideoBrain: { id: 214, name: 'VideoBrain' },
  'Videopac+ G7400': { id: 128, name: 'Videopac+ G7400' },
  'Virtual Boy': { id: 38, name: 'Virtual Boy' },
  WIPI: { id: 260, name: 'WIPI' },
  'Wang 2200': { id: 217, name: 'Wang 2200' },
  wii: { id: 82, name: 'Wii' },
  'wii-u': { id: 132, name: 'Wii U' },
  windows: { id: 3, name: 'Windows' },
  win3x: { id: 5, name: 'Windows 3.x' },
  'windows-apps': { id: 140, name: 'Windows Apps' },
  windowsmobile: { id: 66, name: 'Windows Mobile' },
  'windows-phone': { id: 98, name: 'Windows Phone' },
  WonderSwan: { id: 48, name: 'WonderSwan' },
  'WonderSwan Color': { id: 49, name: 'WonderSwan Color' },
  XaviXPORT: { id: 191, name: 'XaviXPORT' },
  xbox: { id: 13, name: 'Xbox' },
  xbox360: { id: 69, name: 'Xbox 360' },
  xboxcloudgaming: { id: 293, name: 'Xbox Cloud Gaming' },
  'xbox-one': { id: 142, name: 'Xbox One' },
  'Xbox Series': { id: 289, name: 'Xbox Series' },
  'Xerox Alto': { id: 254, name: 'Xerox Alto' },
  'Z-machine': { id: 169, name: 'Z-machine' },
  'zx-spectrum': { id: 41, name: 'ZX Spectrum' },
  'ZX Spectrum Next': { id: 280, name: 'ZX Spectrum Next' },
  ZX80: { id: 118, name: 'ZX80' },
  zx81: { id: 119, name: 'ZX81' },
  Zeebo: { id: 88, name: 'Zeebo' },
  'Zilog Z80': { id: 227, name: 'Zilog Z80' },
  'Zilog Z8000': { id: 276, name: 'Zilog Z8000' },
  Zodiac: { id: 68, name: 'Zodiac' },
  Zune: { id: 211, name: 'Zune' },
  bada: { id: 99, name: 'bada' },
  digiBlast: { id: 187, name: 'digiBlast' },
  iPad: { id: 96, name: 'iPad' },
  iphone: { id: 86, name: 'iPhone' },
  'iPod Classic': { id: 80, name: 'iPod Classic' },
  tvos: { id: 179, name: 'tvOS' },
  watchOS: { id: 180, name: 'watchOS' },
  webOS: { id: 100, name: 'webOS' },
};
