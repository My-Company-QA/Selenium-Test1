const should = require("chai").should();
const { AssertionError } = require("chai");
const { By } = require("selenium-webdriver");
const { PassThrough } = require("stream");
async function assertions(driver, expected_value = "", assertion_on = "") {
  let result, actualValue;
  try {
    switch (assertion_on) {
      //assertion on title
      case "title":
        actualValue = await driver.getTitle();
        result = await actualValue.should.equal(expected_value);
        break;
      // assert the current URL
      case "url":
        actualValue = await driver.getCurrentUrl();
        result = await actualValue.should.equal(expected_value);
        break;
      // find an element by xpath and assert its text
      default:
        const element = await driver.findElement(By.xpath(assertion_on));
        actualValue = element.getText();
        result = await actualValue.should.equal(expected_value);
    }
    return {result: "Passed"};
  } catch (error) {
    return {result: "Failed", reason: error.message}
  }
}

module.exports = { assertions };


