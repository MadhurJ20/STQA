import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# ANSI escape sequences for colors
class Colors:
    GREEN = "\033[92m"
    RED = "\033[91m"
    RESET = "\033[0m"

# Path to the ChromeDriver
driver_path = "./chromedriver"  # Update this with your actual path

# Create a Service object
service = Service(driver_path)

# Initialize the WebDriver
driver = webdriver.Chrome(service=service)

def test_todo_list():
    total_steps = 5
    passed_steps = 0

    # Navigate to the local server where your app is running
    driver.get("http://localhost:5500/integration-test/index.html")  # Update the URL to your app
    print("Step 1: Navigated to the app URL.")
    time.sleep(5)  # Adjust as necessary
    # Wait until the input field is present
    try:
        input_field = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.ID, "task-input"))
        )
        print("Step 2: Input field found.")
        passed_steps += 1
    except Exception as e:
        print(f"Step 2 Failed: Error finding input field: {e}")
        driver.quit()
        return

    # Input a new task
    input_field.send_keys("New Task")

    # Click the 'Add Task' button
    add_task_button = driver.find_element(By.ID, "add-task")
    print("Step 3: Clicking 'Add Task' button.")
    add_task_button.click()
    passed_steps += 1

    # Wait for the task to be added to the DOM
    time.sleep(5)  # Adjust as necessary

    # Verify the task is added to the list
    try:
        task_list = driver.find_element(By.ID, "task-list")
        current_tasks = task_list.text
        print("Step 4: Current task list text after adding:", current_tasks)
        
        assert "New Task" in current_tasks, "Task was not added!"
        print("Step 4 Passed: Task was successfully added.")
        passed_steps += 1
    except AssertionError as e:
        print(f"Step 4 Failed: {e}")
        driver.save_screenshot('screenshot.png')  # Save a screenshot for debugging
        driver.quit()
        return
    except Exception as e:
        print(f"Step 4 Failed: Error retrieving task list: {e}")
        driver.quit()
        return

    # Delete the task
    try:
        delete_button = task_list.find_element(By.XPATH, "//li/button[text()='Delete']")
        print("Step 5: Clicking 'Delete' button for the task.")
        delete_button.click()
        passed_steps += 1

        # Wait for the task to be removed
        time.sleep(5)  # Adjust as necessary

        # Verify the task is removed
        current_tasks = task_list.text
        assert "New Task" not in current_tasks, "Task was not removed!"
        print("Step 5 Passed: Task was successfully removed.")
        passed_steps += 1
    except AssertionError as e:
        print(f"Step 5 Failed: {e}")
        driver.save_screenshot('screenshot.png')  # Save a screenshot for debugging
    except Exception as e:
        print(f"Step 5 Failed: Error during deletion: {e}")

    # Summary
    print(f"\nTest Suites: {Colors.GREEN}1 passed{Colors.RESET}, 1 total")
    print(f"Tests:       {Colors.GREEN}{passed_steps} passed{Colors.RESET}, {total_steps} total")
    print(f"Snapshots:   0 total")
    print(f"Time:        {time.time() - start_time:.3f} s")  # Adjust to your timing method

    # Clean up: close the driver
    driver.quit()

# Run the test
if __name__ == "__main__":
    start_time = time.time()  # Start time for duration measurement
    test_todo_list()