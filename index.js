
/**
 * Module dependencies.
 */

var debug = require('debug')('css-parse');

module.exports = function(css){

  /**
   * Parse stylesheet.
   */

  function stylesheet() {
    var rules = [];
    var node;
    comments();
    while (node = rule()) {
      comments();
      rules.push(node);
    }
    return { stylesheet: { rules: rules }};
  }

  /**
   * Match `re` and return captures.
   */

  function match(re) {
    var m = re.exec(css);
    if (!m) return;
    css = css.slice(m[0].length);
    return m;
  }

  /**
   * Parse whitespace.
   */

  function whitespace() {
    match(/^\s*/);
  }

  /**
   * Parse comments;
   */

  function comments() {
    while (comment()) ;
  }

  /**
   * Parse comment.
   */

  function comment() {
    if ('/' == css[0] && '*' == css[1]) {
      var i = 2;
      while ('*' != css[i] && '/' != css[i + 1]) ++i;
      i += 2;
      css = css.slice(i);
      whitespace();
      return true;
    }
  }

  /**
   * Parse selector.
   */

  function selector() {
    var m = match(/^([^{]+)/);
    if (!m) return;
    return m[0].trim();
  }

  /**
   * Parse declaration.
   */

  function declaration() {
    // prop
    var prop = match(/^([-\w]+) */);
    if (!prop) return;
    prop = prop[0];

    // :
    if (!match(/^:/)) return;

    // val
    var val = match(/^([^};]+)/);
    if (!val) return;
    val = val[0].trim();

    // ;
    match(/^;\s+/);

    return { property: prop, value: val };
  }

  /**
   * Parse rule.
   */

  function rule() {
    var node = { selector: selector(), declarations: [] };

    // selector
    if (!node.selector) return;
    comments();

    // {
    if (!match(/^{\s+/)) return;
    comments();

    // declarations
    var decl;
    while (decl = declaration()) {
      node.declarations.push(decl);
      comments();
    }

    // }
    if (!match(/^}\s*/)) return;
    return node;
  }

  return stylesheet();
};