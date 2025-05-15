import '@testing-library/jest-dom';
import Light from '../basicSettings';
// Mock DOM elements
document.body.innerHTML = `
  <main>
    <button class="entry_point">Enter</button>
    <div class="application_container">
      <div class="light-switch"></div>
      <input type="range" class="intensity-slider" min="0" max="100" value="50">
    </div>
  </main>
`;
// Mock General class
jest.mock('../general', () => ({
    __esModule: true,
    default: class {
        addHidden(element) { element.classList.add('hidden'); }
        removeHidden(element) { element.classList.remove('hidden'); }
        getComponent() {
            return { isLightOn: false, lightIntensity: 50 };
        }
    }
}));
describe('Light Control App', () => {
    let lightController;
    let lightSwitch;
    let slider;
    beforeEach(() => {
        lightController = new Light();
        lightSwitch = document.querySelector('.light-switch');
        slider = document.querySelector('.intensity-slider');
        // Reset DOM state
        lightSwitch.classList.remove('active');
        slider.value = '50';
        jest.clearAllMocks();
    });
    describe('Light Switch Tests', () => {
        it('should initialize with default state', () => {
            expect(lightSwitch.classList.contains('active')).toBeFalsy();
            expect(slider.value).toBe('50');
        });
        it('should toggle light switch state', () => {
            lightSwitch.click();
            expect(lightSwitch.classList.contains('active')).toBeTruthy();
            lightSwitch.click();
            expect(lightSwitch.classList.contains('active')).toBeFalsy();
        });
        it('should handle rapid toggle clicks', () => {
            for (let i = 0; i < 5; i++) {
                lightSwitch.click();
            }
            // After 5 clicks, should end up in 'on' state
            expect(lightSwitch.classList.contains('active')).toBeTruthy();
        });
        it('should maintain state when clicked with modifier keys', () => {
            const clickEvent = new MouseEvent('click', {
                ctrlKey: true,
                shiftKey: true
            });
            lightSwitch.dispatchEvent(clickEvent);
            expect(lightSwitch.classList.contains('active')).toBeTruthy();
        });
    });
    describe('Intensity Slider Tests', () => {
        it('should update light intensity', () => {
            slider.value = '75';
            slider.dispatchEvent(new Event('input'));
            expect(slider.value).toBe('75');
        });
        it('should handle minimum intensity (0%)', () => {
            slider.value = '0';
            slider.dispatchEvent(new Event('input'));
            expect(slider.value).toBe('0');
        });
        it('should handle maximum intensity (100%)', () => {
            slider.value = '100';
            slider.dispatchEvent(new Event('input'));
            expect(slider.value).toBe('100');
        });
        it('should reject invalid intensity values', () => {
            slider.value = '-10';
            slider.dispatchEvent(new Event('input'));
            expect(slider.value).toBe('0');
            slider.value = '150';
            slider.dispatchEvent(new Event('input'));
            expect(slider.value).toBe('100');
        });
        it('should handle decimal intensity values', () => {
            slider.value = '50.5';
            slider.dispatchEvent(new Event('input'));
            expect(Number(slider.value)).toBe(51); // HTML range inputs round to nearest integer
        });
    });
    describe('Error Handling', () => {
        it('should handle missing DOM elements gracefully', () => {
            // Temporarily remove elements
            const container = document.querySelector('.application_container');
            container === null || container === void 0 ? void 0 : container.remove();
            expect(() => new Light()).not.toThrow();
        });
        it('should handle disabled controls', () => {
            slider.disabled = true;
            slider.value = '75';
            slider.dispatchEvent(new Event('input'));
            expect(slider.value).toBe('50'); // Should maintain previous value
            lightSwitch.setAttribute('disabled', '');
            lightSwitch.click();
            expect(lightSwitch.classList.contains('active')).toBeFalsy();
        });
    });
});
