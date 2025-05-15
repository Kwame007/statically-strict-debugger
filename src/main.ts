'use strict';


// elements declarations
const homepageButton = document.querySelector('.entry_point') as HTMLButtonElement;
const homepage = document.querySelector('main') as HTMLElement;
const mainRoomsContainer = document.querySelector('.application_container') as HTMLElement;
const advanceFeaturesContainer = document.querySelector('.advanced_features_container') as HTMLElement;
const nav = document.querySelector('nav') as HTMLElement;
const loader = document.querySelector('.loader-container') as HTMLElement;

// imports
import Light from './basicSettings.js';
import AdvanceSettings from './advanceSettings.js';

// object creation
const lightController: Light = new Light();
const advancedSettings: AdvanceSettings = new AdvanceSettings();

// global variables
let selectedComponent: Element | null = null;
let isWifiActive: boolean = true;

// Event handlers
// hide homepage after button is clicked
homepageButton?.addEventListener('click', async function(e: MouseEvent): Promise<void> {
    lightController.addHidden(homepage);
    lightController.removeHidden(loader);
    
    // Simulate loading or wait for actual loading
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        lightController.removeHidden(mainRoomsContainer);
        lightController.removeHidden(nav);
    } catch (error) {
        console.error('Error during loading:', error);
        // Optionally show error to user
    }
});

mainRoomsContainer?.addEventListener('click', (e: MouseEvent): void => {
    const selectedElement = e.target as Element;

    // when click occurs on light switch
    if (selectedElement?.closest(".light-switch")) {
        const lightSwitch = selectedElement.closest(".basic_settings_buttons")?.firstElementChild;
        if (!lightSwitch) {
            console.error('Light switch element not found');
            return;
        }
        lightController.toggleLightSwitch(lightSwitch as HTMLElement);
        return;
    }

    // when click occurs on advance modal
    if (selectedElement?.closest('.advance-settings_modal')) {
        const advancedSettingsBtn = selectedElement.closest('.advance-settings_modal');
        if (!advancedSettingsBtn) {
            console.error('Advanced settings button not found');
            return;
        }
        advancedSettings.modalPopUp(advancedSettingsBtn as HTMLElement);
        return;
    }
});

mainRoomsContainer?.addEventListener('change', (e: Event): void => {
    const slider = e.target as HTMLInputElement;
    if (!slider || !slider.value) {
        console.error('Invalid slider value');
        return;
    }
    const value: number = parseFloat(slider.value);
    if (isNaN(value)) {
        console.error('Invalid slider value - not a number');
        return;
    }
    lightController.handleLightIntensitySlider(slider, value);
});

// advance settings modal
advanceFeaturesContainer?.addEventListener('click', (e: MouseEvent): void => {
    const selectedElement = e.target as HTMLElement;
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
    if (selectedElement?.textContent && selectedElement.textContent.includes("Cancel")) {
        if (selectedElement.matches('.defaultOn-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOn');
        } else if (selectedElement.matches('.defaultOff-cancel')) {
            advancedSettings.customizationCancelled(selectedElement, '.defaultOff');
        }
    }
});