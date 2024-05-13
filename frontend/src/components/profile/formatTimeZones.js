/**
 * Format the raw time zone strings to be compatible
 * with the initial values of Cascader (see https://ant.design/components/cascader)
 * @param {List[String]} timeZones a list of strings indicating time zones
 * @returns a single Option object for the default value of Cascader
 */
const formatTimeZones = (timeZones) => {
  const root = {};

  timeZones.forEach((timeZone) => {
    const parts = timeZone.split("/");

    let currentLevel = root;
    parts.forEach((part) => {
      if (!currentLevel[part]) {
        currentLevel[part] = { value: part, label: part };
        if (part !== parts[parts.length - 1]) {
          currentLevel[part].children = {};
        }
      }
      currentLevel = currentLevel[part].children || {};
    });
  });

  const recurse = (node) => {
    const childrenArray = [];
    for (const key in node) {
      childrenArray.push(node[key]);
      if (node[key].children) {
        node[key].children = recurse(node[key].children);
      }
    }
    return childrenArray;
  };

  return recurse(root);
};

export default formatTimeZones;
