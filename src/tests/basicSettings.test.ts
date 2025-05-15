import '@testing-library/jest-dom';
import Light from '../basicSettings';

jest.mock('../general', () => ({
  __esModule: true,
  default: class {
    addHidden(element: HTMLElement) {
      element.classList.add('hidden');
    }
    removeHidden(element: HTMLElement) {
      element.classList.remove('hidden');
    }
    getSelectedComponentName() {
      return 'living_room';
    }
    getComponent() {
      return {
        isLightOn: false,
        lightIntensity: 0
      };
    }
    selector(selector: string) {
      return document.querySelector(selector);
    }
  }
}));

describe('Light', () => {
  let light: Light;
  let container: HTMLElement;

  beforeEach(() => {
    light = new Light();
    document.body.innerHTML = `
      <div class="rooms">
        <div class="light-switch" data-room="living_room">
          <img src="./assets/svgs/light_bulb_off.svg" data-lightOn="./assets/svgs/light_bulb.svg">
        </div>
        <img class="room-background" src="./assets/images/room.jpg">
        <input type="range" id="light_intensity" min="0" max="100" value="0">
      </div>
    `;
    container = document.querySelector('.rooms') as HTMLElement;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Light Switch', () => {
    it('should toggle light on and off', () => {
      const lightSwitch = document.querySelector('.light-switch') as HTMLElement;
      const lightImage = lightSwitch.querySelector('img') as HTMLElement;

      // Turn light on
      light.toggleLightSwitch(lightSwitch);
      expect(lightImage.getAttribute('src')).toBe('./assets/svgs/light_bulb.svg');
      
      // Turn light off
      light.toggleLightSwitch(lightSwitch);
      expect(lightImage.getAttribute('src')).toBe('./assets/svgs/light_bulb_off.svg');
    });
  });

  describe('Light Intensity', () => {
    it('should update light based on intensity value', () => {
      const lightSwitch = document.querySelector('.light-switch') as HTMLElement;
      const slider = document.querySelector('#light_intensity') as HTMLInputElement;
      
      // Test high intensity turns light on
      light.handleLightIntensitySlider(lightSwitch, 75);
      expect(slider.value).toBe('75');
      expect(lightSwitch.querySelector('img')?.getAttribute('src')).toBe('./assets/svgs/light_bulb.svg');

      // Test zero intensity turns light off
      light.handleLightIntensitySlider(lightSwitch, 0);
      expect(slider.value).toBe('0');
      expect(lightSwitch.querySelector('img')?.getAttribute('src')).toBe('./assets/svgs/light_bulb_off.svg');
    });
  });
}); 