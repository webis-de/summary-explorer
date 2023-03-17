const defaults = {
  separator: ", ",
  key: (v) => v,
};

function renderListWithSeparator(list, callback, options = {}) {
  const { separator, key } = { ...defaults, ...options };
  return list.map((e, i) => (
    <span key={key(e)}>
      {callback(e)}
      {i < list.length - 1 && separator}
    </span>
  ));
}

export { renderListWithSeparator };
