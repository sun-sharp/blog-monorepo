export const toUnderscoreCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z])(?=[A-Z])/g, '$1_$2')
    .toLowerCase();
};

export const toUpperCaseFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const underlineToCamel = (str: string, type: 'small' | 'big' = 'small'): string => {
  let resStr = str.replace(/\_(\w)/g, (_all, letter) => letter.toUpperCase());

  if (type === 'big') {
    resStr = resStr.slice(0, 1).toUpperCase() + resStr.slice(1);
  }

  return resStr;
};
