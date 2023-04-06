// Import required dependencies
const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const { assertions } = require("./assertion");
const should = require("chai").should();
// Load test case data from JSON file
const testSuite = require("./testCase.json");

// Create a new WebDriver instance for Chrome
const driver = new Builder().forBrowser("chrome").build();
// Handle browser navigation actions such as back, forward, and refresh
async function browserNavigation(action) {
  switch (action) {
    case "back":
      await driver.navigate().back();
      break;
    case "forward":
      await driver.navigate().forward();
      break;
    case "refresh":
      await driver.navigate().refresh();
      break;
    default:
      console.error("The action is not correct, please check your action");
      break;
  }
}

// Handle alerts such as accept, dismiss, and submit with text input
async function alertsHandler(action, text = "") {
  await driver.wait(until.alertIsPresent());
  let alert = await driver.switchTo().alert();
  switch (action) {
    case "accept":
      await alert.accept();
      break;
    case "dismiss":
      await alert.dismiss();
      break;
    case "submit":
      await alert.sendKeys(text);
      await alert.accept();
      break;
    default:
      console.error("The action is not correct, please check your action");
      break;
  }
}

// Handle window-related actions such as minimize, maximize, switch, and take screenshot
async function windowHandler(action, data = "") {
  const windows = await driver.getAllWindowHandles();
  switch (action) {
    case "minimize":
      await driver.manage().window().minimize();
      break;
    case "maximize":
      await driver.manage().window().maximize();
      break;
    case "fullScreen":
      await driver.manage().window().fullscreen();
      break;
    case "switchWindow":
      await driver.switchTo().window(windows[1]);
      break;
    case "switchBack":
      await driver.switchTo().window(windows[0]);
      break;
    case "takeScreenShot":
      let encodedString = await driver.takeScreenshot();
      fs.writeFileSync(`./images/${data}.png`, encodedString, "base64");
      break;
    case "time":
      await driver.sleep(data * 1000);
      break;
    case "quite":
      await driver.quit();
      break;
    default:
      console.error("The action is not correct, please check your action");
      break;
  }
}

// Perform an action on a specific element identified by its XPath
async function actionFunction(action = "", xpath = "", text = "") {
  switch (action) {
    case "get":
      await driver.get(text);
      break;
    case "click":
      await driver.findElement(By.xpath(xpath)).click();
      break;
    case "input":
      await driver.findElement(By.xpath(xpath)).sendKeys(text);
      break;
    default:
      console.error("The action is not correct, please check your action");
      break;
  }
}

// Main function to run the test cases

async function mainFunction(step) {
  // Wait before executing the current step
  step.beforeSleep > 0 ? await windowHandler("time", step.beforeSleep) : "";
  // Maximize the window
  step.windowZoom ? await windowHandler("maximize") : "";
  // Refresh the window
  step.refreshWindow ? await browserNavigation("refresh") : "";
  // Perform the action based on the given step
  await actionFunction(step.action.toLowerCase(), step.xpath, step.addText);
  // Check if the expected result matches the actual result
  const result = await assertions(driver, step.expectedResult, "url");
  // Store screenshot
  step.screenshot ? await windowHandler("takeScreenShot", step.screenshot) : "";
  return result
}

async function runTestSuite(suite) {
  try {
    // Loop through each test case
    const resultMap = {};
    for (let testCase of suite)  {
      if(!resultMap[testCase.testCaseID]) {
        resultMap[testCase.testCaseID] = [];
      }
      // Loop through each step in the test case
      for (let testStep of testCase.testSteps) {
          const result = await mainFunction(testStep);
        resultMap[testCase.testCaseID].push(result);
      }
    }
    console.log("Report====>>", resultMap);
  } catch (error) {
    console.log("error ===>", error);
  } finally {
    // Close the browser
    await driver.quit();
  }
}

runTestSuite(testSuite);