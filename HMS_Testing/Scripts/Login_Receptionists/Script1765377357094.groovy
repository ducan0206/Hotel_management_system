import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import static com.kms.katalon.core.testobject.ObjectRepository.findWindowsObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testng.keyword.TestNGBuiltinKeywords as TestNGKW
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.windows.keyword.WindowsBuiltinKeywords as Windows
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

WebUI.openBrowser('http://localhost:5173/')

WebUI.click(findTestObject('Login_receptionist/Page_frontend/button_Admin'))

WebUI.click(findTestObject('Login_receptionist/Page_frontend/receptionist'))

WebUI.click(findTestObject('Login_receptionist/Page_frontend/input_username'))

WebUI.setText(findTestObject('Login_receptionist/Page_frontend/input_username'), username)

WebUI.click(findTestObject('Login_receptionist/Page_frontend/input_pass'))

WebUI.setText(findTestObject('Login_receptionist/Page_frontend/input_pass'), password)

WebUI.click(findTestObject('Page_customer/Page_frontend/button_Login'))

WebUI.verifyTextPresent(expected_message, false)

WebUI.closeBrowser()

