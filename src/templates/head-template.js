import { html } from 'lit';

/* eslint-disable indent */
export default function headTemplate() {
  let selectedLang = this.attributes['spec-lang']?.value ?? null;
  let langs = this.attributes['spec-langs']?.value ?? null;
  if (langs && typeof langs === 'string') {
    langs = window[langs];
  }
  let selectedName = this.attributes['spec-name']?.value ?? null;
  let names = this.attributes['spec-names']?.value ?? null;
  if (names && typeof names === 'string') {
    names = window[names];
  }

  return html`
    <header class="row regular-font head-title" part="section-header" style="">
      <button class="toggle-menu" @click="${() => {
        this.shadowRoot.querySelector('.nav-bar').classList.toggle('mobile-show');
      }}">Show Menu</button>
      <slot name="nav-logo" class="logo"></slot>
      ${(this.allowSearch === 'false' && this.allowAdvancedSearch === 'false')
        ? ''
        : html`
          <div style="display:flex; flex-direction:row; justify-content:center; align-items:stretch; padding:8px 24px 12px 24px; flex-grow: 5; ${this.allowAdvancedSearch === 'false' ? 'border-bottom: 1px solid var(--nav-hover-bg-color)' : ''}" part="section-navbar-search">
            ${this.allowSearch === 'false'
          ? ''
          : html`
                <div style="display:flex; flex:1; line-height:22px;">
                  <input id="nav-bar-search" 
                    part = "textbox textbox-nav-filter"
                    style = "width:100%; padding-right:20px; color:var(--nav-hover-text-color); border-color:var(--nav-accent-color); background-color:var(--nav-hover-bg-color);" 
                    type = "text"
                    placeholder = "Filter" 
                    @change = "${this.onSearchChange}"  
                    spellcheck = "false" 
                  >
                  <div style="margin: 6px 5px 0 -24px; font-size:var(--font-size-regular); cursor:pointer;">&#x21a9;</div>
                </div>  
                ${this.matchPaths
            ? html`
              <button @click = '${this.onClearSearch}' class="m-btn thin-border" style="margin-left:5px; color:var(--nav-text-color); width:75px; padding:6px 8px;" part="btn btn-outline btn-clear-filter">
                CLEAR
              </button>`
            : ''
          }
              `
        }
            ${this.allowAdvancedSearch === 'false' || this.matchPaths
          ? ''
          : html`
                <button class="m-btn primary" part="btn btn-fill btn-search" style="margin-left:5px; padding:6px 8px; width:75px" @click="${this.onShowSearchModalClicked}">
                  SEARCH
                </button>
              `
        }
          </div>
        `
      }
      
      ${html`<div style="display:flex; flex-direction:row; justify-content:center; align-items:stretch; padding:8px 0 12px 0; flex-grow: 1;"></div>`}
      ${html`<div style="display:flex; flex-direction:row; justify-content: end; align-items:stretch; padding:8px 0 12px 0; flex-grow: 3; ${this.allowAdvancedSearch === 'false' ? 'border-bottom: 1px solid var(--nav-hover-bg-color)' : ''}" part="section-navbar-search">
        <nav class='nav-lang' part="section-lang-scroll" style="display:flex; flex-direction:row; justify-content:center; align-items:stretch;">
        ${(!langs || !names)
        ? ''
        : html`
          <select class="textbox" @change="${(e) => {
            selectedLang = e.target.value;
            window.selectedLang(selectedLang, selectedName);
          }}" style='z-index:1;width: 92%;margin: 2px 10px;color: var(--nav-hover-text-color);border-color: var(--nav-accent-color);background-color: var(--nav-hover-bg-color);'>
            ${Object.keys(langs).map((lang) => html`<option value='${lang}' ?selected = '${lang === selectedLang}'> ${langs[lang]} </option>`)}
          </select>
          </div>`}
        </nav>
        <nav class='nav-lang' part="section-lang-scroll" style="display:flex; flex-direction:row; justify-content:center; align-items:stretch;">
        ${(!langs || !names)
        ? ''
        : html`
          <select @change="${(e) => {
            selectedName = e.target.value;
            window.selectedLang(selectedLang, selectedName);
          }}" style='z-index:1;width: 92%;margin: 2px 10px;color: var(--nav-hover-text-color);border-color: var(--nav-accent-color);background-color: var(--nav-hover-bg-color);'>
            ${Object.keys(names).map((name) => html`<option value='${name}' ?selected = '${name === selectedName}'> ${names[name]} </option>`)}
          </select>`}
        </nav>

        ${!this.pdfBtn ? '' : html`
          <rapi-pdf
            style = "width: 67px; height:40px; font-size:18px;"
            spec-url = "${this.specUrl}"
            button-bg = "#00A2FB"
            button-label = "PDF"
            hide-input = "true"
          > </rapi-pdf>`}

         ${!this.openapiBtn ? '' : html`
        <button class="m-btn primary" href="" style='font-family: "";font-size: 17px;' @click="${() => {
          const a = document.createElement('a');
          a.href = this.specUrl;
          a.download = this.specUrl.split('/').pop();
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }}">YAML</button>
        `}
      </div>`}
      <slot name="head"></slot>
    </header>`;
  }
/* eslint-enable indent */
