// i18next-parser.config.js

module.exports = {
  contextSeparator: "_",
  // Key separator used in your translation keys

  createOldCatalogs: true,
  // Save the \_old files

  defaultNamespace: "translation",
  // Default namespace used in your i18next config

  defaultValue: (lng, ns, key) => {
    if (lng === "en") { // assume "en" as the default language (the language with which all the strings in code are expressed)
      return key; // use the key itself for the primary language
    }
    return '__STRING_NOT_TRANSLATED__'; // use the placeholder for other languages
  },
  // default value to give to empty keys

  indentation: 2,
  // Indentation of the catalog files

  keepRemoved: false,
  // Keep keys from the catalog that are no longer in code

  keySeparator: false,
  // Key separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t("Status: Loading...")` will not think that there are a namespace and three separator dots for instance.
  
  // see below for more details
  lexers: {
    hbs: ["HandlebarsLexer"],
    handlebars: ["HandlebarsLexer"],

    htm: ["HTMLLexer"],
    html: ["HTMLLexer"],

    mjs: ["JavascriptLexer"],
    js: ["JavascriptLexer"], // if you're writing jsx inside .js files, change this to JsxLexer
    ts: ["JavascriptLexer"],
    jsx: ["JsxLexer"],
    tsx: ["JsxLexer"],

    default: ["JavascriptLexer"]
  },

  lineEnding: "auto",
  // Control the line ending. See options at https://github.com/ryanve/eol

  locales: ["en", "it", "fr"],
  // An array of the locales in your applications

  namespaceSeparator: false,
  // Namespace separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t("Status: Loading...")` will not think that there are a namespace and three separator dots for instance.

  output: "src/locales/$LOCALE/$NAMESPACE.json",
  // Supports $LOCALE and $NAMESPACE injection
  // Supports JSON (.json) and YAML (.yml) file formats
  // Where to write the locale files relative to process.cwd()

  input: undefined,
  // An array of globs that describe where to look for source files
  // relative to the location of the configuration file

  reactNamespace: false,
  // For react file, extract the defaultNamespace - https://react.i18next.com/components/translate-hoc.html
  // Ignored when parsing a `.jsx` file and namespace is extracted from that file.

  sort: true,
  // Whether or not to sort the catalog

  useKeysAsDefaultValue: true,
  // Whether to use the keys as the default value; ex. "Hello": "Hello", "World": "World"
  // The option `defaultValue` will not work if this is set to true

  verbose: false
  // Display info about the parsing including some stats
};
