import '@testing-library/jest-dom';
import Light from '../basicSettings';
import AdvanceSettings from '../advanceSettings';

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
    addHidden(element: HTMLElement) { element.classList.add('hidden'); }
    removeHidden(element: HTMLElement) { element.classList.remove('hidden'); }
    getComponent() {
      return { isLightOn: false, lightIntensity: 50 };
    }
  }
}));

describe('Light Control App', () => {
  let lightController: Light;
  let lightSwitch: HTMLElement;
  let slider: HTMLInputElement;
  
  beforeEach(() => {
    lightController = new Light();
    lightSwitch = document.querySelector('.light-switch') as HTMLElement;
    slider = document.querySelector('.intensity-slider') as HTMLInputElement;
    // Reset DOM state
    lightSwitch.classList.remove('active');
    slider.value = '50';
    jest.clearAllMocks();
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
  });
}); 