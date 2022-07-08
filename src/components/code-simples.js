import { LitElement, html, css } from 'lit';
import TableStyles from '~/styles/table-styles';
import FlexStyles from '~/styles/flex-styles';
import InputStyles from '~/styles/input-styles';
import FontStyles from '~/styles/font-styles';
import BorderStyles from '~/styles/border-styles';
import TabStyles from '~/styles/tab-styles';
import PrismStyles from '~/styles/prism-styles';
import CustomStyles from '~/styles/custom-styles';

import Prism, { loadLanguages, highlight } from 'reprism';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import HTTPSnippet from 'httpsnippet';

import 'prismjs/themes/prism-okaidia.css';

import jsx from 'reprism/languages/jsx';
import java from 'reprism/languages/java';
import javascript from 'reprism/languages/javascript';
import clojure from 'reprism/languages/clojure';
import csharp from 'reprism/languages/csharp';
import http from 'reprism/languages/http';
import kotlin from 'reprism/languages/kotlin';
import powershell from 'reprism/languages/powershell';
import r from 'reprism/languages/r';
import ruby from 'reprism/languages/ruby';
import swift from 'reprism/languages/swift';
import bash from 'reprism/languages/bash';
import ocaml from 'reprism/languages/ocaml';
import python from 'reprism/languages/python';
import json from 'reprism/languages/json';
import textile from 'reprism/languages/textile';
import php from './reprism-php';

loadLanguages(jsx, java, bash, javascript, clojure, csharp, http, kotlin, php, powershell, r, ruby, swift, ocaml, python, json, textile);

const localStorageKey = 'rapidoc';

if (typeof document !== 'undefined') {
  // Provide window.Prism for plugins
  window.Prism = Prism;
  // eslint-disable-next-line global-require
  require('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace');
  Prism.plugins.NormalizeWhitespace.setDefaults({
    'remove-trailing': true,
    'remove-indent': true,
    'left-trim': true,
    'right-trim': true,
    'break-lines': 60,
    'tabs-to-spaces': 4,
  });
  Prism.hooks.add('before-sanity-check', (env) => {
    env.element.innerHTML = env.element.innerHTML.replace(/<br>/g, '\n');
    env.code = env.element.textContent;
  });
}

const requestSampleConfigs = [
  {
    snippet: 'shell',
    libraries: {
      cURL: 'curl',
      HTTPie: 'httpie',
      Wget: 'wget',
    },
  },
  {
    snippet: 'javascript',
    libraries: {
      Fetch: 'fetch',
      XMLHttpRequest: 'xmlhttprequest',
      jQuery: 'jquery',
      Axios: 'axios',
    },
  },
  // {
  //   snippet: 'node',
  //   libraries: {
  //     Native: 'native',
  //     Request: 'request',
  //     Unirest: 'unirest',
  //     Fetch: 'fetch',
  //     Axios: 'axios',
  //   },
  // },
  {
    snippet: 'python',
    libraries: {
      'Python 3': 'python3',
      Requests: 'requests',
    },
  },
  {
    snippet: 'go',
  },
  {
    snippet: 'c',
  },
  // 'Objective-C': {
  //     snippet: 'objectivec',
  // },
  {
    snippet: 'ocaml',
  },
  {
    snippet: 'csharp',
    libraries: {
      HttpClient: 'httpclient',
      RestSharp: 'restsharp',
    },
  },
  {
    snippet: 'java',
    libraries: {
      AsyncHttp: 'asynchttp',
      NetHttp: 'nethttp',
      OkHttp: 'okhttp',
      Unirest: 'unirest',
    },
  },
  {
    snippet: 'http',
  },
  {
    snippet: 'clojure',
  },
  {
    snippet: 'kotlin',
  },
  {
    snippet: 'php',
    libraries: {
      'pecl/http 1': 'http1',
      'pecl/http 2': 'http2',
      cURL: 'curl',
    },
  },
  {
    snippet: 'powershell',
    libraries: {
      WebRequest: 'webrequest',
      RestMethod: 'restmethod',
    },
  },
  {
    snippet: 'r',
  },
  {
    snippet: 'ruby',
  },
  {
    snippet: 'swift',
  },
];

export default class CodeSimples extends LitElement {
  constructor() {
    super();
    this.url = '';
    this.lang = 'javascript';
    this.client = 'xmlhttprequest';
    this.showPopup = false;
    this.onPopupIndex = null;
    this.vals = [];
  }

  static get properties() {
    return {
      serverUrl: { type: String, attribute: 'server-url' },
      servers: { type: Array },
      method: { type: String },
      path: { type: String },
      security: { type: Array },
      parameters: { type: Array },
      request_body: { type: Object },
      api_keys: { type: Array },
      parser: { type: Object },
      resolved_spec: { type: Object },
      accept: { type: String },
    };
  }

  static get styles() {
    return [
      TableStyles,
      InputStyles,
      FontStyles,
      FlexStyles,
      BorderStyles,
      TabStyles,
      PrismStyles,
      css`
        .selector {
          cursor: pointer;
        }
        .code-panel {
          border-radius: 5px;
          min-height: 500px;
          outline: 2px solid rgba(0,0,0,0);
          outline-offset: 2px;
          overflow: hidden;
          width: 100%;
        }
        
        .code-panel-header {
          align-items: center;
          display: flex;
          background-color: #e0e6f0;
          border-color: #e0e6f0;
          color: #66676b;
          font-size: 12px;
          line-height: 1;
          padding-left: 16px;
          padding-right: 12px;
          position: relative;
          user-select: none;
          height: 30px;
        }
        
        .code-panel-body {
          background-color: #f2f5fb;
          padding: 0;
          position: relative;
        }
        
        .code-popup {
          background-color: #fff;
          border: 1px solid #ccd0d1;
          border-radius: 2px;
          box-sizing: border-box;
          left: 19px;
          padding-bottom: 8px;
          padding-top: 8px;
          position: absolute;
          top: 27px;
          width: 273px;
          z-index: 100000;
        }
        
        .code-popup-item {
          align-items: center;
          display: flex;
          font-size: 12px;
          padding: 4px 12px 4px 4px;
          white-space: nowrap;
        }
        
        .code-popup-item-icon {
          right: 10px;
          position: absolute;
        }
        .code-popup-sublist {
          background-color: #fff;
          border: 1px solid #ccd0d1;
          border-radius: 2px;
          left: 271px;
          position: absolute;
          z-index: 10;
        }
        .toolbar-btn {
          cursor: pointer;
          padding: 4px;
          margin: 0px 2px;
          font-size: var(--font-size-small);
          min-width: 50px;
          color: var(--primary-color-invert);
          border-radius: 2px;
          border: none;
          background-color: var(--primary-color);
        }
      `,
      CustomStyles,
    ];
  }

  render() {
    this.parentElement.querySelectorAll('input').forEach((input) => {
      if (!input) return;
      input.onkeyup = () => {
        this.vals[input.dataset.pname] = input.value;
        this.requestUpdate();
      };
    });

    return html`<div class="col regular-font request-panel">
      <section class="table-title" style="margin-top:24px;">CODE SAMPLES</div>
      <div class="code-panel">
        <div class="code-panel-header">
          ${this.renderSelectLang()}
          ${this.showPopup ? this.renderLangs() : ''}
        </div>
        <div class="code-panel-body">
          <button class="toolbar-btn" style="position:absolute;top: 26px;right: 17px;"> Copy </button>
          ${this.renderCode()}
        </div>
      </div>
    </div>`;
  }

  randomParam(type, name, secureStore = false) {
    const securityObj = this.resolved_spec.securitySchemes?.find((v) => (v.securitySchemeId === name));
    if (securityObj) {
      return securityObj.value;
    }
    if (secureStore) {
      const trEl = this.shadowRoot.getElementById(`security-scheme-${name}`);
      console.log(type, name, secureStore, trEl); // eslint-disable-line
      if (trEl) {
        return trEl.value;
      }
    }
    const store = JSON.parse(localStorage.getItem(localStorageKey)) || {};
    if (store[name]) {
      return store[name];
    }
    if (this.vals[name]) return this.vals[name];
    if (type === 'string') {
      return 'str';
    }
    if (type === 'integer') {
      return `${Math.floor(Math.random() * 5)}`;
    }
    if (type === 'boolean') {
      return 'true';
    }
    return '';
  }

  renderCode() {
    const headers = [];
    const queryString = [];
    const postData = [];
    const cookies = [];
    const method = this.method.toUpperCase();
    let url = this.serverUrl + this.path;
    for (const i in this.parameters) {
      const { name } = this.parameters[i];
      const { type } = this.parameters[i].schema;
      if (this.parameters[i].in === 'cookie') {
        cookies.push({ name, value: this.randomParam(type, name) });
      }
      if (this.parameters[i].in === 'header') {
        headers.push({ name, value: this.randomParam(type, name, true) });
      }
      if (this.parameters[i].in === 'query' && this.parameters[i].required) {
        queryString.push({ name, value: this.randomParam(type, name) });
      }
      if (this.parameters[i].in === 'path' && this.parameters[i].required) {
        url = url.replaceAll(`{${name}}`, this.randomParam(type, name));
      }
      if (this.parameters[i].in === 'body' && this.parameters[i].required) {
        postData.push({ name, value: this.randomParam(type, name) });
      }
    }

    if (this.request_body && Object.keys(this.request_body).length > 0) {
      const { content } = this.request_body;
      for (const mimeType in content) {
        this.mimeType = mimeType;
        if (content[mimeType].schema.properties) {
          for (const fieldName in content[mimeType].schema.properties) {
            if (!this.vals[fieldName]) continue;
            if (method === 'POST' || method === 'PUT') {
              postData.push({ name: fieldName, value: this.vals[fieldName] });
            } else {
              url = url.replaceAll(`{${fieldName}}`, this.vals[fieldName]);
            }
          }
        }
      }
    }

    const param = {
      method,
      url,
      headers,
      queryString,
      cookies,
    };
    if (method === 'POST' && postData.length > 0) {
      param.postData = { mimeType: this.mimeType, params: JSON.parse(JSON.stringify(postData)) };
    }

    const snippet = new HTTPSnippet(param);
    const code = snippet.convert(this.lang, this.client) || '';
    // const code = 'snippet.convert(this.lang, this.client) || null';
    return html`${unsafeHTML(highlight(code, this.lang))}`;
  }

  renderSelectLang() {
    return html` <div @click="${this.onOpenPopupClick}" class="selector">
      Request Sample Language: <span>${this.lang}</span>
      ${this.client ? html`<span>/</span>` : ''}
      ${this.client ? html`<span>${this.client}</span> ` : ''}
      <span>&#709;</span>
    </div>`;
  }

  renderLangs() {
    return html` <div class="code-popup">
      ${requestSampleConfigs.map((v, i) => html`
          <div class="code-popup-item" @mouseover="${this.onLangHover}" data-index="${i}">
            <a href="#" @click="${this.onLangClick}" data-index="${i}">${v.snippet}</a>
            ${v.libraries ? html`<span class="code-popup-item-icon">&#62;</span>` : ''}
            ${i === this.onPopupIndex ? this.renderClient() : ''}
          </div>
        `)}
    </div>`;
  }

  renderClient() {
    const select = requestSampleConfigs[this.onPopupIndex];
    return html`<div class="code-popup-sublist">
      ${Object.keys(select.libraries).map((v) => html`
        <div class="code-popup-item">
          <a href="#" @click="${this.onClientClick}" data-client="${select.libraries[v]}" data-index="${this.onPopupIndex}">${v}</a>
        </div>
      `)};
    </div>`;
  }

  onOpenPopupClick(e) {
    e.preventDefault();
    this.showPopup = !this.showPopup;
    this.requestUpdate();
  }

  onLangHover(e) {
    e.preventDefault();
    if (!e.target.dataset.index) return;
    const select = requestSampleConfigs[e.target.dataset.index];
    if (!select || !select.libraries) return;
    this.onPopupIndex = parseInt(e.target.dataset.index, 10);
    this.requestUpdate();
  }

  onClientClick(e) {
    e.preventDefault();
    if (!e.target.dataset.index) return;
    const select = requestSampleConfigs[e.target.dataset.index];
    if (!select || !select.libraries) return;
    this.lang = select.snippet;
    this.client = e.target.dataset.client;
    this.showPopup = false;
    this.onPopupIndex = null;
    this.requestUpdate();
  }

  onLangClick(e) {
    e.preventDefault();
    if (!e.target.dataset.index) return;
    const select = requestSampleConfigs[e.target.dataset.index];
    if (!select || select.libraries) return;
    this.lang = select.snippet;
    this.showPopup = false;
    this.onPopupIndex = null;
    this.requestUpdate();
  }
}

// Register the element with the browser
customElements.define('code-simples', CodeSimples);
