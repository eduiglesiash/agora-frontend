
/**
 * Devuelve un texto sin acentos
 * @param {string} text - Texto con acentos.
 * @return {string}
 */
const removeAccents = (str) => {
  const sustitutions = {
    àáâãäå: 'a',
    ÀÁÂÃÄÅ: 'A',
    èéêë: 'e',
    ÈÉÊË: 'E',
    ìíîï: 'i',
    ÌÍÎÏ: 'I',
    òóôõö: 'o',
    ÒÓÔÕÖ: 'O',
    ùúûü: 'u',
    ÙÚÛÜ: 'U',
    ýÿ: 'y',
    ÝŸ: 'Y',
    ß: 'ss',
    ñ: 'n',
    Ñ: 'N',
  };
  // Devuelve un valor si 'letter' esta incluido en la clave
  const getLetterReplacement = (letter, replacements) => {
    const findKey = Object.keys(replacements).reduce(
      (origin, item, index) => (item.includes(letter) ? item : origin),
      false
    );
    return findKey !== false ? replacements[findKey] : letter;
  };
  // Recorre letra por letra en busca de una sustitución
  return str
    .split('')
    .map((letter) => getLetterReplacement(letter, sustitutions))
    .join('');
};



export { removeAccents }
