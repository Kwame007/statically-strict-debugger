'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// elements declarations
const homepageButton = document.querySelector('.entry_point');
const homepage = document.querySelector('main');
const mainRoomsContainer = document.querySelector('.application_container');
const advanceFeaturesContainer = document.querySelector('.advanced_features_container');
const nav = document.querySelector('nav');
const loader = document.querySelector('.loader-container');
// imports
import Light from './basicSettings.js';
import AdvanceSettings from './advanceSettings.js';
// object creation
const lightController = new Light();
const advancedSettings = new AdvanceSettings();
// global variables
let selectedComponent = null;
let isWifiActive = true;
// Event handlers
// hide homepage after button is clicked
homepageButton === null || homepageButton === void 0 ? void 0 : homepageButton.addEventListener('click', function (e) {
    return __awaiter(this, void 0, void 0, function* () {
        lightController.addHidden(homepage);
        lightController.removeHidden(loader);
        // Simulate loading or wait for actual loading
        try {
            yield new Promise(resolve => setTimeout(resolve, 1000));
            lightController.removeHidden(mainRoomsContainer);
            lightController.removeHidden(nav);
        }
        catch (error) {
            console.error('Error during loading:', error);
            // Optionally show error to user
        }
    });
});
mainRoomsContainer === null || mainRoomsContainer === void 0 ? void 0 : mainRoomsContainer.addEventListener('click', (e) => {
    var _a;
    const selectedElement = e.target;
    // when click occurs on light switch
    if (selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.closest(".light-switch")) {
        const lightSwitch = (_a = selectedElement.closest(".basic_settings_buttons")) === null || _a === void 0 ? void 0 : _a.firstElementChild;
        if (!lightSwitch) {
            console.error('Light switch element not found');
            return;
        }
        lightController.toggleLightSwitch(lightSwitch);
        return;
    }
    // when click occurs on advance modal
    if (selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.closest('.advance-settings_modal')) {
        const advancedSettingsBtn = selectedElement.closest('.advance-settings_modal');
        if (!advancedSettingsBtn) {
            console.error('Advanced settings button not found');
            return;
        }
        advancedSettings.modalPopUp(advancedSettingsBtn);
        return;
    }
});
mainRoomsContainer === null || mainRoomsContainer === void 0 ? void 0 : mainRoomsContainer.addEventListener('change', (e) => {
    const slider = e.target;
    if (!slider || !slider.value) {
        console.error('Invalid slider value');
        return;
    }
    const value = parseFloat(slider.value);
    if (isNaN(value)) {
        console.error('Invalid slider value - not a number');
        return;
    }
    lightController.handleLightIntensitySlider(slider, value);
});
// advance settings modal
advanceFeaturesContainer === null || advanceFeaturesContainer === void 0 ? void 0 : advanceFeaturesContainer.addEventListener('click', (e) => {
    const selectedElement = e.target;
    if (!selectedElement) {
        console.error('No element selected');
        return;
    }
    if (selectedElement.closest('.close-btn')) {
        advancedSettings.closeModalPopUp();
        return;
    }
    // display customization markup
    if (selectedElement.closest('.customization-btn')) {
        advancedSettings.displayCustomization(selectedElement);
        return;
    }
    // set light on time customization
    if (selectedElement.matches('.defaultOn-okay')) {
        advancedSettings.customizeAutomaticOnPreset(selectedElement);
        return;
    }
    // set light off time customization
    if (selectedElement.matches('.defaultOff-okay')) {
        advancedSettings.customizeAutomaticOffPreset(selectedElement);
        return;
    }
    // cancel light time customization
    if ((selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.textContent) && selectedElement.textContent.includes("Cancel")) {
        if (selectedElement.matches('.defaultOn-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOn');
        }
        else if (selectedElement.matches('.defaultOff-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOff');
        }
    }
});
