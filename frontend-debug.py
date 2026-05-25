from playwright.sync_api import sync_playwright
import json, time

URL = 'http://localhost:5173/register'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context(record_har_path='frontend_debug.har')
    page = context.new_page()

    logs = []
    page.on('console', lambda msg: logs.append({'type': msg.type, 'text': msg.text}))
    page.on('pageerror', lambda e: logs.append({'type': 'pageerror', 'text': str(e)}))

    print('Opening', URL)
    page.goto(URL, timeout=20000)
    time.sleep(1.2)
    print('Taking screenshot')
    page.screenshot(path='frontend_debug.png', full_page=True)

    with open('frontend_console.json', 'w', encoding='utf-8') as f:
        json.dump(logs, f, indent=2, ensure_ascii=False)

    print('Saved frontend_console.json and frontend_debug.har and frontend_debug.png')

    context.close()
    browser.close()
