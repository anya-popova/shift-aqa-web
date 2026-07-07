import { Page } from "@playwright/test";
export const fillAllFields = async (
    page: Page,
    fields: {
        fullname?: string
        email?: string
        phone?: string
        message?: string
        code?: string
        checkbox?: boolean
    } = {}
) => {
    const {
        fullname = 'афы фыа фыафыа',
        email = 'as@asf.qw',
        phone = '+7 988 812 81 877',
        message = 'asf asfa asfqfqw фыафафыа фыа',
        code = 'qw12',
        checkbox = true
    } = fields
    await page.getByTestId('feedback-input-fullname').fill(fullname);
    await page.getByTestId('feedback-input-email').fill(email);
    await page.getByTestId('feedback-input-phone').fill(phone);
    await page.getByTestId('feedback-input-message').fill(message);
    if (checkbox) {
        await page.getByTestId('feedback-checkbox-consent').click();
    }
    await page.getByTestId('feedback-input-captcha').fill(code);
}