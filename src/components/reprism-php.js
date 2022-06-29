Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = {
  language: 'php',
  init: function init(Prism) {
    // eslint-disable-next-line no-shadow,func-names
    (function (Prism) {
      Prism.languages.php = Prism.languages.extend('clike', {
        // eslint-disable-next-line max-len
        keyword: /\b(?:and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
        constant: /\b[A-Z0-9_]{2,}\b/,
        comment: {
          pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
          lookbehind: true,
        },
      });

      Prism.languages.insertBefore('php', 'string', {
        'shell-comment': {
          pattern: /(^|[^\\])#.*/,
          lookbehind: true,
          alias: 'comment',
        },
      });

      Prism.languages.insertBefore('php', 'keyword', {
        delimiter: {
          pattern: /\?>|<\?(?:php|=)?/i,
          alias: 'important',
        },
        variable: /\$+(?:\w+\b|(?={))/i,
        package: {
          pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
          lookbehind: true,
          inside: {
            punctuation: /\\/,
          },
        },
      });

      // Must be defined after the function pattern
      Prism.languages.insertBefore('php', 'operator', {
        property: {
          pattern: /(->)[\w]+/,
          lookbehind: true,
        },
      });

      Prism.languages.insertBefore('php', 'string', {
        'nowdoc-string': {
          pattern: /<<<'([^']+)'(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;/,
          greedy: true,
          alias: 'string',
          inside: {
            delimiter: {
              pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
              alias: 'symbol',
              inside: {
                punctuation: /^<<<'?|[';]$/,
              },
            },
          },
        },
        'heredoc-string': {
          pattern: /<<<(?:"([^"]+)"(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;|([a-z_]\w*)(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\2;)/i,
          greedy: true,
          alias: 'string',
          inside: {
            delimiter: {
              pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
              alias: 'symbol',
              inside: {
                punctuation: /^<<<"?|[";]$/,
              },
            },
            interpolation: null, // See below
          },
        },
        'single-quoted-string': {
          pattern: /'(?:\\[\s\S]|[^\\'])*'/,
          greedy: true,
          alias: 'string',
        },
        'double-quoted-string': {
          pattern: /"(?:\\[\s\S]|[^\\"])*"/,
          greedy: true,
          alias: 'string',
          inside: {
            interpolation: null, // See below
          },
        },
      });
      // The different types of PHP strings "replace" the C-like standard string
      delete Prism.languages.php.string;

      // eslint-disable-next-line vars-on-top,camelcase
      const string_interpolation = {
        pattern: /{\$(?:{(?:{[^{}]+}|[^{}]+)}|[^{}])+}|(^|[^\\{])\$+(?:\w+(?:\[.+?]|->\w+)*)/,
        lookbehind: true,
        inside: {
          rest: Prism.languages.php,
        },
      };
      // eslint-disable-next-line camelcase
      Prism.languages.php['heredoc-string'].inside.interpolation = string_interpolation;
      // eslint-disable-next-line camelcase
      Prism.languages.php['double-quoted-string'].inside.interpolation = string_interpolation;

      // Prism.hooks.add('before-tokenize', (env) => {
      //   // if (!/(?:<\?php|<\?)/gi.test(env.code)) {
      //   //   return;
      //   // }
      //
      //   // const phpPattern = /(?:<\?php|<\?)[\s\S]*?(?:\?>|$)/gi;
      //   // Prism.languages['markup-templating'].buildPlaceholders(env, 'php', phpPattern);
      // });

      // Prism.hooks.add('after-tokenize', (env) => {
      //   // Prism.languages['markup-templating'].tokenizePlaceholders(env, 'php');
      // });
    }(Prism));
  },
};
