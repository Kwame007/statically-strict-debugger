/// <reference types="node" />
import '@testing-library/jest-dom';
import AdvanceSettings from '../advanceSettings';
// Mock Chart.js
const mockChart = jest.fn();
globalThis.Chart = jest.fn((ctx, config) => mockChart);
jest.mock('../general', () => ({
    __esModule: true,
    default: class {
        addHidden(element) {
            element.classList.add('hidden');
        }
        removeHidden(element) {
            element.classList.remove('hidden');
        }
        getSelectedComponentName() {
            return 'living_room';
        }
        getComponent() {
            return {
                name: 'living_room',
                numOfLights: 2,
                lightIntensity: 50,
                isLightOn: false,
                autoOn: '08:00',
                autoOff: '22:00',
                usage: [5, 6, 7, 6, 8, 7, 5]
            };
        }
        selector(selector) {
            return document.querySelector(selector);
        }
    }
}));
describe('AdvanceSettings', () => {
    let advanceSettings;
    let container;
    beforeEach(() => {
        advanceSettings = new AdvanceSettings();
        document.body.innerHTML = `
      <div class="advanced_features_container hidden">
        <div class="rooms" data-room="living_room">
          <div class="light-switch"></div>
          <input type="range" id="light_intensity" min="0" max="100" value="0">
        </div>
      </div>
    `;
        container = document.querySelector('.advanced_features_container');
        advanceSettings.componentsData = {
            living_room: {
                name: 'living_room',
                numOfLights: 2,
                lightIntensity: 50,
                isLightOn: false,
                autoOn: '08:00',
                autoOff: '22:00',
                usage: [5, 6, 7, 6, 8, 7, 5],
                element: document.querySelector('.rooms')
            }
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
    });
    describe('Modal Operations', () => {
        it('should handle modal open and close', () => {
            const advancedSettingsBtn = document.createElement('div');
            advancedSettingsBtn.setAttribute('data-room', 'living_room');
            // Test opening
            advanceSettings.modalPopUp(advancedSettingsBtn);
            expect(container.classList.contains('hidden')).toBeFalsy();
            expect(container.querySelector('.advanced_features')).toBeTruthy();
            // Test closing
            advanceSettings.closeModalPopUp();
            expect(container.classList.contains('hidden')).toBeTruthy();
        });
    });
    describe('Time Settings', () => {
        it('should handle automatic time settings', () => {
            const advancedSettingsBtn = document.createElement('div');
            advancedSettingsBtn.setAttribute('data-room', 'living_room');
            advanceSettings.modalPopUp(advancedSettingsBtn);
            // Test auto-on time
            const autoOnInput = container.querySelector('#autoOnTime');
            const autoOnOkayBtn = container.querySelector('.defaultOn-okay');
            autoOnInput.value = '09:00';
            advanceSettings.customizeAutomaticOnPreset(autoOnOkayBtn);
            expect(advanceSettings.componentsData.living_room.autoOn).toBe('09:00');
            // Test auto-off time
            const autoOffInput = container.querySelector('#autoOffTime');
            const autoOffOkayBtn = container.querySelector('.defaultOff-okay');
            autoOffInput.value = '23:00';
            advanceSettings.customizeAutomaticOffPreset(autoOffOkayBtn);
            expect(advanceSettings.componentsData.living_room.autoOff).toBe('23:00');
        });
    });
    describe('Error Handling', () => {
        it('should handle invalid operations gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error');
            // Test invalid room
            const invalidBtn = document.createElement('div');
            invalidBtn.setAttribute('data-room', 'non_existent_room');
            advanceSettings.modalPopUp(invalidBtn);
            expect(consoleSpy).toHaveBeenCalledWith('Component data not found');
            // Test empty time input
            const autoOnOkayBtn = document.createElement('button');
            autoOnOkayBtn.className = 'defaultOn-okay';
            advanceSettings.customizeAutomaticOnPreset(autoOnOkayBtn);
            expect(consoleSpy).toHaveBeenCalledWith('No time value provided');
        });
    });
});
