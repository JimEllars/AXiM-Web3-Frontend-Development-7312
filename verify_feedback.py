from playwright.sync_api import sync_playwright
import os

def run_cuj(page):
    # Navigate to the articles page where the Feedback component is
    page.goto("http://localhost:5173/#/articles")
    page.wait_for_timeout(2000)

    # Scroll down to the bottom where the Feedback component should be rendered
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(2000)

    # Take screenshot of the Feedback component to verify it renders correctly
    page.screenshot(path="/home/jules/verification/screenshots/articles_feedback.png")

if __name__ == "__main__":
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos",
            viewport={"width": 1280, "height": 720}
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()