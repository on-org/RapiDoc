const i18n = {
  en: {
    api_server: 'API Server',
    api_servers: 'API Servers',
    authentication: 'Authentication',
    webhook: 'WEBHOOK',
    request: 'REQUEST',
    callback_request: 'CALLBACK REQUEST',
    path_params: 'PATH PARAMETERS',
    query_param: 'QUERY-STRING PARAMETERS',
    req_headers: 'REQUEST HEADERS',
    cookie: 'COOKIES',
    not_required: 'Not Required',
    required: 'Required  <span style="color:var(--red)">(None Applied)',
    clear_response: 'CLEAR RESPONSE',
    response: 'RESPONSE',
    response_head: 'RESPONSE HEADERS',
    curl: 'CURL',
    response_status: 'Response Status',
    callback_response: 'CALLBACK RESPONSE',
    view_new_tab: 'VIEW (NEW TAB)',
    copy: 'Copy',
    code_simples: 'CODE SAMPLES',
    request_simple_lang: 'Request Sample Language',
    try: 'TRY',
    file_with: 'Fills with example data (if provided)',
    clear: 'CLEAR',
    fill_example: 'FILL EXAMPLE',
    example: 'EXAMPLE',
    schema: 'SCHEMA',
    selected: 'SELECTED',
    multiline_description: 'Multiline description',
    singleline_description: 'Single line description',
    default: 'Default',
    pattern: 'Pattern',
    constraints: 'Constraints',
    allowed: 'Allowed',
  },
  ru: {
    api_server: 'API Сервер',
    api_servers: 'API Сервера',
    authentication: 'Авторизация',
    webhook: 'WEBHOOK',
    request: 'ЗАПРОС',
    callback_request: 'ЗАПРОС ОБРАТНОГО ВЫЗОВА',
    path_params: 'ПАРАМЕТРЫ ПУТИ',
    query_param: 'ПАРАМЕТРЫ СТРОКИ ЗАПРОСА',
    req_headers: 'ЗАГОЛОВКИ ЗАПРОСА',
    cookie: 'COOKIES',
    not_required: 'Не требуется',
    required: 'Требуется <span style="color:var(--red)">(не применяется)',
    clear_response: 'ОТЧИЧТИТЬ ОТВЕТ',
    response: 'ОТВЕТ',
    response_head: 'ЗАГОЛОВКИ ОТВЕТА',
    curl: 'CURL',
    response_status: 'Статус ответа',
    callback_response: 'ОБРАТНЫЙ ОТВЕТ',
    view_new_tab: 'ПОСМОТРЕТЬ (НОВАЯ ВКЛАДКА)',
    copy: 'Скопировать',
    code_simples: 'ПРИМЕР КОДА',
    request_simple_lang: 'Пример запроса на языке',
    try: 'Попробовать',
    file_with: 'Заполняется примерными данными (если они предоставлены)',
    clear: 'ОЧИСТИТЬ',
    fill_example: 'ПРИМЕР ЗАПОЛНЕНИЯ',
    example: 'ПРИМЕР',
    schema: 'СХЕМА',
    selected: 'ВЫБРАНО',
    multiline_description: 'Многострочное описание',
    singleline_description: 'Однострочное описание',
    default: 'По умолчанию',
    pattern: 'Шаблон',
    constraints: 'Ограничения',
    allowed: 'Разрешено',
  },
};

class Locale {
  locale = 'en';

  setLocale(locale) {
    this.locale = locale;
  }

  getLocale() {
    return this.locale;
  }

  i18n(key, def = '') {
    return (i18n[this.locale] ? i18n[this.locale][key] : null) || i18n.en[key] || def || '';
  }
}

const locale = new Locale();
const set = locale.setLocale;
const get = locale.getLocale;
export { locale, set, get };
