// const script = {
//   title: "Navigate to Google",
//   xpath: "",
//   action: "get",
//   text: "https://www.google.com",
//   sleep: 1,
//   screenshot: true,
//   window: false,
//   refresh: false,
// };

// sleep;
// refresh;
// window;
// action;
// expected_result;
// screenshot;

const testCase = {
  title: "Search for 'selenium-webdriver' on Google",
  preconditions: "WebdriverIO and Selenium should be installed",
  steps: [
    {
      title: "Navigate to Google",
      xpath: "",
      action: "get",
      text: "https://www.google.com",
      sleep: 2,
      screenshot: true,
      window: true,
      refresh: false,
      expected_result: {
        title: "Google",
      },
    },
    {
      title: "Search for 'selenium-webdriver'",
      action: "input",
      xpath: "//input[@name='q']",
      text: "selenium-webdriver",
      sleep: 2,
      screenshot: true,
      window: false,
      refresh: false,
      expected_result: {
        xpath: "//input[@name='q' and @value='selenium-webdriver']",
      },
    },
    {
      title: "Submit search query",
      action: "click",
      xpath: "//*[@value='Google Search']",
      text: "",
      sleep: 2,
      screenshot: true,
      window: false,
      refresh: true,
      expected_result: {
        title: "selenium-webdriver - Google Search",
      },
    },
  ],
};

module.exports = testCase;
