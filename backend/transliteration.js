// Transliteration utility for Marathi (Devanagari) and English (Roman)
// Supports bidirectional conversion, normalization, live typing transliteration, and fuzzy phonetic search matching.

const COMMON_MARATHI_WORDS = {
  // Common Names & Surnames
  'sachin': 'सचिन',
  'amol': 'अमोल',
  'kunal': 'कुणाल',
  'pawar': 'पवार',
  'patil': 'पाटील',
  'biradwade': 'बिरदवडे',
  'birdawade': 'बिरदवडे',
  'biradavade': 'बिरदवडे',
  'shinde': 'शिंदे',
  'more': 'मोरे',
  'kalbhor': 'काळभोर',
  'dnyaneshwar': 'ज्ञानेश्वर',
  'jnaneshwar': 'ज्ञानेश्वर',
  'tukaram': 'तुकाराम',
  'rajendra': 'राजेंद्र',
  'ganesh': 'गणेश',
  'eknath': 'एकनाथ',
  'vitthal': 'विठ्ठल',
  'viththal': 'विठ्ठल',
  'rahul': 'राहुल',
  'santosh': 'संतोष',
  'deshmukh': 'देशमुख',
  'jadhav': 'जाधव',
  'bhosale': 'भोसले',
  'bhosle': 'भोसले',
  'kadam': 'कदम',
  'chavan': 'चव्हाण',
  'chavhan': 'चव्हाण',
  'gaikwad': 'गायकवाड',
  'gayakwad': 'गायकवाड',
  'jagtap': 'जगताप',
  'raut': 'राऊत',
  'mali': 'माळी',
  'kulkarni': 'कुलकर्णी',
  'joshi': 'जोशी',
  'shete': 'शेटे',
  'ghadge': 'घाडगे',
  'suresh': 'सुरेश',
  'ramesh': 'रमेश',
  'mahesh': 'महेश',
  'dinesh': 'दिनेश',
  'sandip': 'संदीप',
  'sandeep': 'संदीप',
  'prashant': 'प्रशांत',
  'vikas': 'विकास',
  'yogesh': 'योगेश',
  'vijay': 'विजय',
  'amit': 'अमित',
  'sunil': 'सुनील',
  'dipak': 'दीपक',
  'deepak': 'दीपक',
  'ashok': 'अशोक',
  'anil': 'अनिल',
  'sanjay': 'संजय',
  'supriya': 'सुप्रिया',
  'pooja': 'पूजा',
  'puja': 'पूजा',
  'snehal': 'स्नेहल',
  'priya': 'प्रिया',
  'swati': 'स्वाती',
  'anita': 'अनिता',
  'rekha': 'रेखा',
  'sunita': 'सुनिता',
  'shobha': 'शोभा',
  'pramod': 'प्रमोद',
  'prakash': 'प्रकाश',
  'vinod': 'विनोद',
  'nitin': 'नितीन',
  'mangesh': 'मंगेश',
  'santuk': 'संतुक',
  'dnyanoba': 'ज्ञानोबा',
  'tuka': 'तुका',
  'nivritti': 'निवृत्ती',
  'sopandev': 'सोपानदेव',
  'muktai': 'मुक्ताई',

  // Mandal & Devotional Words
  'youngstar': 'यंगस्टार',
  'mandal': 'मंडळ',
  'mitra': 'मित्र',
  'vargani': 'वर्गणी',
  'pavti': 'पावती',
  'bhavik': 'भाविक',
  'dehu': 'देहू',
  'dehugaon': 'देहुगाव',
  'malinagar': 'माळीनगर',
  'pune': 'पुणे',
  'haveli': 'हवेली',
  'ganeshotsav': 'गणेशोत्सव',
  'jayanti': 'जयंती',
  'utsav': 'उत्सव',
  'mahaprasad': 'महाप्रसाद',
  'prasad': 'प्रसाद',
  'aarti': 'आरती',
  'dhol': 'ढोल',
  'tasha': 'ताशा',
  'visarjan': 'विसर्जन',
  'shree': 'श्री',
  'bappa': 'बाप्पा',
  'morya': 'मोरया',
  'khajindar': 'खजिनदार',
  'adhyaksha': 'अध्यक्ष',
  'karyakarta': 'कार्यकर्ता',
  'padadhikari': 'पदाधिकारी',
  'bhakt': 'भक्त',
  'online': 'ऑनलाइन',
  'cash': 'नगद'
};

const CONSONANTS = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh',
  'ष': 'sh', 'स': 's', 'ह': 'h', 'ळ': 'l'
};

const VOWEL_SIGNS = {
  'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
  'ृ': 'ru', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  'ं': 'n', 'ँ': 'n', 'ः': 'h', 'ॅ': 'a', 'ॉ': 'o'
};

const INDEPENDENT_VOWELS = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u',
  'ऊ': 'oo', 'ऋ': 'ru', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o',
  'औ': 'au', 'अं': 'am', 'अः': 'ah', 'ॲ': 'a', 'ऑ': 'o'
};

const VIRAMA = '्';

function devanagariToRoman(text) {
  if (!text) return '';
  let str = text.trim();
  let result = '';

  str = str.replace(/ज्ञ/g, 'dny');
  str = str.replace(/क्ष/g, 'ksh');
  str = str.replace(/श्र/g, 'shr');
  str = str.replace(/त्र/g, 'tr');

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const nextChar = str[i + 1];

    if (INDEPENDENT_VOWELS[char]) {
      result += INDEPENDENT_VOWELS[char];
    } else if (CONSONANTS[char]) {
      const rom = CONSONANTS[char];
      result += rom;

      if (nextChar === VIRAMA) {
        i++;
      } else if (nextChar === 'ं' || nextChar === 'ँ') {
        result += 'an';
        i++;
      } else if (nextChar && VOWEL_SIGNS[nextChar]) {
      } else if (i === str.length - 1 || str[i + 1] === ' ') {
      } else {
        result += 'a';
      }
    } else if (VOWEL_SIGNS[char]) {
      result += VOWEL_SIGNS[char];
    } else {
      result += char;
    }
  }

  return result.toLowerCase();
}

function normalizePhonetic(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/w/g, 'v')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/ou/g, 'au')
    .replace(/ph/g, 'f')
    .replace(/sh/g, 's')
    .replace(/th/g, 't')
    .replace(/dh/g, 'd')
    .replace(/bh/g, 'b')
    .replace(/kh/g, 'k')
    .replace(/gh/g, 'g')
    .replace(/jh/g, 'j')
    .replace(/aa/g, 'a')
    .replace(/jn/g, 'dny')
    .replace(/gy/g, 'dny')
    .replace(/(.)\1+/g, '$1')
    .replace(/[^a-z0-9]/g, '');
}

function skeletonKey(str) {
  if (!str) return '';
  return normalizePhonetic(str).replace(/a/g, '');
}

function romanWordToDevanagari(rawWord) {
  if (!rawWord) return '';
  const word = rawWord.toLowerCase().trim();

  if (COMMON_MARATHI_WORDS[word]) {
    return COMMON_MARATHI_WORDS[word];
  }

  for (const [key, val] of Object.entries(COMMON_MARATHI_WORDS)) {
    if (word === key + 'ji' || word === key + 'rao' || word === key + 'sheth') {
      const suffix = word.endsWith('ji') ? 'जी' : (word.endsWith('rao') ? 'राव' : 'शेठ');
      return val + suffix;
    }
  }

  const multiMap = [
    { en: 'dny', dev: 'ज्ञ' },
    { en: 'jn', dev: 'ज्ञ' },
    { en: 'gy', dev: 'ज्ञ' },
    { en: 'ksh', dev: 'क्ष' },
    { en: 'shr', dev: 'श्र' },
    { en: 'chh', dev: 'छ' },
    { en: 'kh', dev: 'ख' },
    { en: 'gh', dev: 'घ' },
    { en: 'ch', dev: 'च' },
    { en: 'jh', dev: 'झ' },
    { en: 'th', dev: 'थ' },
    { en: 'dh', dev: 'ध' },
    { en: 'ph', dev: 'फ' },
    { en: 'bh', dev: 'भ' },
    { en: 'sh', dev: 'श' },
    { en: 'ee', dev: 'ी', start: 'ई' },
    { en: 'oo', dev: 'ू', start: 'ऊ' },
    { en: 'ai', dev: 'ै', start: 'ऐ' },
    { en: 'au', dev: 'ौ', start: 'औ' },
    { en: 'ou', dev: 'ौ', start: 'औ' },
    { en: 'aa', dev: 'ा', start: 'आ' }
  ];

  const singleConsonants = {
    'k': 'क', 'g': 'ग', 'c': 'क', 'j': 'ज', 'z': 'झ',
    't': 'त', 'd': 'द', 'n': 'न', 'p': 'प', 'f': 'फ',
    'b': 'ब', 'm': 'म', 'y': 'य', 'r': 'र', 'l': 'ल',
    'v': 'व', 'w': 'व', 's': 'स', 'h': 'ह', 'x': 'क्ष'
  };

  const vowels = {
    'a': { sign: '', start: 'अ' },
    'i': { sign: 'ि', start: 'इ' },
    'u': { sign: 'ु', start: 'उ' },
    'e': { sign: 'े', start: 'ए' },
    'o': { sign: 'ो', start: 'ओ' }
  };

  let out = '';
  let i = 0;
  let lastWasConsonant = false;

  while (i < word.length) {
    let matched = false;

    for (const item of multiMap) {
      if (word.startsWith(item.en, i)) {
        if (item.start) {
          out += lastWasConsonant ? item.dev : item.start;
          lastWasConsonant = false;
        } else {
          out += (lastWasConsonant ? '्' : '') + item.dev;
          lastWasConsonant = true;
        }
        i += item.en.length;
        matched = true;
        break;
      }
    }

    if (matched) continue;

    const char = word[i];
    const nextChar = word[i + 1];

    if ((char === 'n' || char === 'm') && lastWasConsonant && nextChar && (singleConsonants[nextChar] || ['sh', 'th', 'dh', 'ch'].some(p => word.startsWith(p, i + 1)))) {
      out += 'ं';
      lastWasConsonant = false;
      i++;
      continue;
    }

    if (vowels[char]) {
      if (lastWasConsonant) {
        if (char !== 'a') {
          out += vowels[char].sign;
        }
      } else {
        out += vowels[char].start;
      }
      lastWasConsonant = false;
      i++;
      continue;
    }

    if (singleConsonants[char]) {
      const devChar = singleConsonants[char];
      if (lastWasConsonant) {
        if (char === 'w' || char === 'v') {
          out += devChar;
        } else {
          out += '्' + devChar;
        }
      } else {
        out += devChar;
      }
      lastWasConsonant = true;
      i++;
      continue;
    }

    out += char;
    lastWasConsonant = false;
    i++;
  }

  return out;
}

function romanToDevanagari(text) {
  if (!text) return '';
  return text
    .split(/(\s+)/)
    .map(chunk => /^\s+$/.test(chunk) ? chunk : romanWordToDevanagari(chunk))
    .join('');
}

function matchesDevanagariSearch(target, query) {
  if (!query || !query.trim()) return true;
  if (!target) return false;

  const q = query.trim().toLowerCase();
  const t = target.trim().toLowerCase();

  // 1. Direct substring match
  if (t.includes(q)) return true;

  // 2. Transliterated query (English -> Devanagari) substring match
  const qDev = romanToDevanagari(q);
  if (t.includes(qDev)) return true;

  // 3. Both converted to Roman phonetics
  const tRoman = devanagariToRoman(target);
  const qRoman = devanagariToRoman(query);

  if (tRoman.includes(q)) return true;
  if (tRoman.includes(qRoman)) return true;

  // 4. Word-by-word token matching
  const qTokens = q.split(/\s+/).filter(Boolean);
  if (qTokens.length > 1) {
    const allTokensMatch = qTokens.every(tok => matchesDevanagariSearch(target, tok));
    if (allTokensMatch) return true;
  }

  // 5. Phonetic normalization match
  const normTarget = normalizePhonetic(tRoman || t);
  const normQuery = normalizePhonetic(qRoman || q);

  if (normTarget && normQuery) {
    if (normTarget.includes(normQuery)) return true;
    if (normTarget.replace(/a$/, '').includes(normQuery.replace(/a$/, ''))) return true;
  }

  // 6. Skeleton consonant match
  const skelTarget = skeletonKey(tRoman || t);
  const skelQuery = skeletonKey(qRoman || q);
  if (skelTarget && skelQuery && skelQuery.length >= 2 && skelTarget.includes(skelQuery)) {
    return true;
  }

  return false;
}

module.exports = {
  COMMON_MARATHI_WORDS,
  devanagariToRoman,
  romanToDevanagari,
  romanWordToDevanagari,
  normalizePhonetic,
  skeletonKey,
  matchesDevanagariSearch
};
