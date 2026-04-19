from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:4173")
    page.wait_for_timeout(2000)

    # Click on the Dashboard link (it requires account auth, so it will redirect or show access denied)
    page.goto("http://localhost:4173/dashboard")
    page.wait_for_timeout(2000)

    # Take screenshot of Dashboard access denied page with the newly added Connect Button
    page.screenshot(path="/home/jules/verification/screenshots/dashboard_access_denied.png")

    # Navigate to Legal Infrastructure / Generator
    page.goto("http://localhost:4173/generator")
    page.wait_for_timeout(2000)
    page.get_by_placeholder("Full Legal Identity").fill("John Doe")
    page.get_by_placeholder("Entity or Individual").fill("Acme Corp")
    page.wait_for_timeout(500)

    # Click Proceed to Context
    page.get_by_role("button", name="Proceed to Context").click()
    page.wait_for_timeout(2000)

    # Fill amount and details
    page.get_by_placeholder("0.00").fill("15000")
    page.get_by_placeholder("Describe the breach or unpaid obligation...").fill("They breached contract.")
    page.wait_for_timeout(500)

    # Click Synchronize Draft
    page.get_by_role("button", name="Synchronize Draft").click()
    page.wait_for_timeout(3000)

    # After click, it should attempt to save and error out but continue to step 3, or show error message.
    # We take a screenshot
    page.screenshot(path="/home/jules/verification/screenshots/generator_step3.png")

if __name__ == "__main__":
    import os
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
